// 
const PORT = 5000;
const express = require('express');
const mysql = require('mysql');
const app = express();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const cors = require('cors');

app.use(cors({
    origin: true, // En production, spécifiez l'origine exacte
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createPool({
    host: '127.0.0.1',
    user: 'circuit',
    password: 'VQ2kbJaHf0PmItial7SZ',
    database: 'SpeedCircuit'
});

function parseCookies(cookieHeader) {
    const cookies = {};
    if (cookieHeader) {
        cookieHeader.split(';').forEach(cookie => {
            const parts = cookie.trim().split('=');
            if (parts.length === 2) {  // Vérification ajoutée
                cookies[parts[0]] = parts[1];
            }
        });
    }
    return cookies;
}

app.listen(PORT, () => {
    console.log(`Serveur backend opérationnel : http://172.16.195.254:${PORT}`);
});

/***********************************************************************************/
/**
 * Routes utilisées par l'application Légère
 */
/***********************************************************************************/

/**
 * Route qui permets de récupérer les informations de l'utilisateur sur l'application légère 
 * en récupérant sont cookie de connexion.
 */

app.get('/compte', (req, res) => {
    console.log('Route /compte appelée');
    console.log('Headers cookie:', req.headers.cookie); // Voir tous les cookies

    const cookies = parseCookies(req.headers.cookie);
    console.log('Cookies parsés:', cookies); // Voir le résultat du parsing
    console.log('Noms des cookies disponibles:', Object.keys(cookies));

    let idEntite = cookies.user_name;
    console.log(`idEntite : ${idEntite}`);

    // Vérifiez si idEntite existe
    if (!idEntite) {
        return res.status(401).json({ message: 'Non authentifié - cookie user_name manquant' });
    }
    let query = 'SELECT E.Mail, E.Nom, C.Prenom, E.Identifiant FROM Client C, Entite E WHERE E.IdEntite = C.IdEntite AND E.IdEntite = ?';

    connection.query(query, [idEntite], (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ message: 'Erreur interne au serveur' });
        }
        console.log(results);
        res.json(results);
    });
});

app.delete('/reservation/delete/:id', (req, res) => {
    console.log('route /reservation/delete appelée');
    const cookie = parseCookies(req.headers.cookie);
    const idEntite = cookie.user_name;

    if (!idEntite) {
        return res.status(401).json({ message: 'Erreur vous n\'êtes pas authentifie' });
    }

    const idReservation = req.params.id;

    let query = `DELETE FROM Reservation 
WHERE IdReservation = ? 
AND IdClient = (SELECT IdClient FROM Client WHERE IdEntite = ?)`;

    connection.query(query, [idReservation, idEntite], (err, result) => {
        if (err) {
            console.error('Erreur SQL  : ', err);
            return res.status(500).json({ message: 'Erreur interne au serveur' });
        }

        if (result.affectedRows === 0) {
            return res.status(403).json({ message: 'Réservation introuvable ou non authorisée' });
        }

        res.json({ sucess: true });
    });
});

app.get('/reservation/past', (req, res) => {
    console.log('Route /reservation/past appelée');
    const cookie = parseCookies(req.headers.cookie);

    let idEntite = cookie.user_name;
    console.log(`idEntite : ${idEntite}`);

    if (!idEntite) {
        return res.status(401).json({ message: 'Non authentifié - cookie user_name manquant' });
    }

    let query = `SELECT R.DateReservation, R.HeureReservation, V.Marque, V.Modele 
FROM Client C 
INNER JOIN Reservation R ON C.IdClient = R.IdClient 
INNER JOIN Vehicule V ON R.IdVehicule = V.IdVehicule 
WHERE C.IdEntite = ? AND R.DateReservation < CURDATE()`;

    connection.query(query, [idEntite], (err, results) => {
        if (err) {
            console.error('Erreur SQL : ', err);
            return res.status(500).json({ message: 'Erreur interne au serveur' });
        }

        console.log(results);
        res.json(results);
    });
});

app.get('/reservation/comming', (req, res) => {
    console.log('Route /reservation/comming appelée');
    const cookie = parseCookies(req.headers.cookie);

    let idEntite = cookie.user_name;
    console.log(`idEntite : ${idEntite}`);

    if (!idEntite) {
        return res.status(401).json({ message: 'Non authentifié - cookie user_name manquant' });
    }

    let query = `SELECT R.IdReservation, R.DateReservation, R.HeureReservation, V.Marque, V.Modele 
FROM Client C 
INNER JOIN Reservation R ON C.IdClient = R.IdClient 
INNER JOIN Vehicule V ON R.IdVehicule = V.IdVehicule 
WHERE C.IdEntite = ? AND R.DateReservation > CURDATE()`;

    connection.query(query, [idEntite], (err, results) => {
        if (err) {
            console.error('Erreur SQL : ', err);
            return res.status(500).json({ message: 'Erreur interne au serveur' });
        }

        console.log(results);
        res.json(results);
    });
});

app.get('/reservation', (req, res) => {
    console.log('Route /reservation appelée');
    const cookie = parseCookies(req.headers.cookie);

    let idEntite = cookie.user_name;
    console.log(`idEntite : ${idEntite}`);

    if (!idEntite) {
        return res.status(401).json({ message: 'Non authentifié - cookie user_name manquant' });
    }

    let query = `SELECT R.DateReservation, R.HeureReservation, V.Marque, V.Modele 
FROM Client C 
INNER JOIN Reservation R ON C.IdClient = R.IdClient 
INNER JOIN Vehicule V ON R.IdVehicule = V.IdVehicule 
WHERE C.IdEntite = ? AND R.DateReservation = CURDATE();`;

    connection.query(query, [idEntite], (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ message: 'Erreur interne au serveur' });
        }
        console.log(results);
        res.json(results);
    });
});




app.get('/vehicule', (req, res) => {
    console.log('Route /vehicule appellée');
    const query = `
      SELECT v.IdVehicule, v.Marque, v.Modele, v.Prix,
         e.IdEtat, e.libelleEtat
  FROM Vehicule v
  INNER JOIN Etat e ON v.IdEtat = e.IdEtat
  WHERE v.IdVehicule < 100
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ message: 'Erreur interne au serveur' });
        }
        console.log(results);
        res.json(results);
    });
});

app.get('/evenement', (req, res) => {
    const query =
        'SELECT LibelleEvenement, DateEvenement, HeureEvenement, Prix FROM Evenement;'
        ;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ message: 'Erreur interne au serveur' });
        }
        res.json(results);
    });
});

/***********************************************************************************/
/**
 * Routes utilisées par l'application lourde
 */
/***********************************************************************************/

app.post('/login', (req, res) => {
    console.log('Route /login appelée');
    const { identifiant, mdp } = req.body;

    if (!identifiant || !mdp) {
        return res.status(400).json({ message: 'Identifiant et mot de passe requis.' });
    }

    const query = `
        SELECT 
            e.IdEntite,
            e.mdp as mdpHash,
            p.Prenom as prenom, 
            p.IdPoste as idPoste
        FROM Entite e
        LEFT JOIN Personnel p ON e.IdEntite = p.IdEntite
        WHERE e.Identifiant = ?
    `;
    console.log(`Identifiant : ${identifiant}`);

    connection.query(query, [identifiant], async (err, results) => {
        if (err) {
            console.error(`Erreur SQL : ${err}`);
            return res.status(500).json({ message: 'Erreur interne au serveur' });
        }

        console.log('Résultats de la requête : ', results);

        // Utilisateur introuvable
        if (results.length === 0) {
            return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect' });
        }

        function sha256(str) {
            return crypto.createHash('sha256').update(str).digest('hex');
        }

        // Vérification du mot de passe avec bcrypt
        const isMatch = sha256(mdp) === results[0].mdpHash;
        console.log('isMatch : ', isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect ' });
        }

        // Vérification de l'accès à l'application
        if (!results[0].prenom) {
            return res.status(401).json({ message: 'Vous n\'avez pas de compte pour accéder à cette application' });
        }

        console.log(results);

        res.json({
            user: {
                prenom: results[0].prenom,
                IdEntite: results[0].IdEntite
            }
        });
    });
});

app.get('/toutes-reservations', (req, res) => {
    console.log('Route /toutes-reservations appelée');
    const query = `
    SELECT 
        S.IdSession, 
        S.NbReservationMax, 
        S.DateSession, 
        V.Marque, 
        V.Modele, 
        C.Prenom, 
        E.Nom
    FROM Session S
    INNER JOIN Reservation R ON S.IdSession = R.IdSession
    INNER JOIN Vehicule V ON R.IdVehicule = V.IdVehicule
    INNER JOIN Client C ON R.IdClient = C.IdClient
    INNER JOIN Entite E ON C.IdEntite = E.IdEntite
    ORDER BY S.DateSession DESC;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erreur SQL  :', err);
            return res.status(500).json({ message: 'Erreur interne au serveur' });
        }

        console.log('Résultats de la requête :', results); // Debug important

        res.json(results);
    });
});

app.get('/toutes-reservations/today', (req, res) => {
    console.log('Route /toutes-reservations/upcoming appelée');
    const query = `
    SELECT 
        S.IdSession, 
        S.NbReservationMax, 
        S.DateSession, 
        V.Marque, 
        V.Modele, 
        C.Prenom, 
        E.Nom
    FROM Session S
    INNER JOIN Reservation R ON S.IdSession = R.IdSession
    INNER JOIN Vehicule V ON R.IdVehicule = V.IdVehicule
    INNER JOIN Client C ON R.IdClient = C.IdClient
    INNER JOIN Entite E ON C.IdEntite = E.IdEntite
    WHERE S.DateSession = NOW()
    ORDER BY S.DateSession DESC;
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erreur SQL  :', err);
            return res.status(500).json({ message: 'Erreur interne au serveur' });
        }

        console.log('Résultats de la requête :', results); // Debug important

        res.json(results);
    });
});

app.get('/toutes-reservations/past', (req, res) => {
    console.log('Route /toutes-reservations/past appelée');
    const query = `
    SELECT 
        S.IdSession, 
        S.NbReservationMax, 
        S.DateSession, 
        V.Marque, 
        V.Modele, 
        C.Prenom, 
        E.Nom
    FROM Session S
    INNER JOIN Reservation R ON S.IdSession = R.IdSession
    INNER JOIN Vehicule V ON R.IdVehicule = V.IdVehicule
    INNER JOIN Client C ON R.IdClient = C.IdClient
    INNER JOIN Entite E ON C.IdEntite = E.IdEntite
    WHERE S.DateSession < NOW()
    ORDER BY S.DateSession DESC;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Erreur SQL  :', err);
            return res.status(500).json({ message: 'Erreur interne au serveur' });
        }

        console.log('Résultats de la requête :', results); // Debug important

        res.json(results);
    });
});

app.get('/compte/pro', (req, res) => {
    const idEntite = req.headers['x-user-id'];
    console.log(`idEntite reçu : ${idEntite}`);
    console.log(`Type : ${typeof idEntite}`);
    console.log('Route /compte/pro appelée');

    if (!idEntite) {
        return res.status(401).json({ message: 'Non authentifié - cookie x-user-id manquant' });
    }

    let query = 'SELECT E.Mail, E.Nom, P.Prenom, E.Identifiant FROM Personnel P, Entite E WHERE E.IdEntite = P.IdEntite AND E.IdEntite = ?';

    connection.query(query, [idEntite], (err, results) => {
        if (err) {
            console.error('erreur SQL:', err);
            return res.status(500).json({ message: 'Erreur interne au serveur ' });
        }

        console.log(results);
        res.json(results);
    });
});

app.put('/compte/pro/infos', (req, res) => {
    const idEntite = req.headers['x-user-id'];

    if (!idEntite) {
        return res.status(401).json({ message: 'Non authentifié - header x-user-id manquant' });
    }

    const { mail, identifiant } = req.body;

    if (!mail || !identifiant) {
        return res.status(400).json({ message: 'Mail et identifiant sont requis' });
    }

    // Vérifier si le mail ou l'identifiant est déjà utilisé par une autre entité
    const checkQuery = `
        SELECT IdEntite FROM Entite 
        WHERE (Mail = ? OR Identifiant = ?) AND IdEntite != ?
    `;

    connection.query(checkQuery, [mail, identifiant, idEntite], (err, results) => {
        if (err) {
            console.error('Erreur SQL (vérification):', err);
            return res.status(500).json({ message: 'Erreur interne au serveur' });
        }

        if (results.length > 0) {
            return res.status(409).json({ message: 'Ce mail ou identifiant est déjà utilisé' });
        }

        // Mise à jour
        const updateQuery = `
            UPDATE Entite 
            SET Mail = ?, Identifiant = ? 
            WHERE IdEntite = ?
        `;

        connection.query(updateQuery, [mail, identifiant, idEntite], (err, result) => {
            if (err) {
                console.error('Erreur SQL (update):', err);
                return res.status(500).json({ message: 'Erreur interne au serveur' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Compte introuvable' });
            }

            console.log(`Compte ${idEntite} mis à jour (mail + identifiant)`);
            res.json({ message: 'Informations mise à jour avec succès' });
        });
    });
});

function sha256(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
}

app.put('/compte/pro/password', (req, res) => {
    const idEntite = req.headers['x-user-id'];

    if (!idEntite) {
        return res.status(401).json({ message: 'Non authentifié - header x-user-id manquant' });
    }

    const { ancienMotDePasse, nouveauMotDePasse } = req.body;

    if (!ancienMotDePasse || !nouveauMotDePasse) {
        return res.status(400).json({ message: 'Ancien et nouveau mot de passe sont requis' });
    }

    const selectQuery = 'SELECT mdp FROM Entite WHERE idEntite = ?';

    connection.query(selectQuery, [idEntite], async (err, results) => {
        if (err) {
            console.error('Erreur SQL (select) : ', err);
            return res.status(500).json({ message: 'Erreur interne au serveur' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Compte introuvable' });
        }

        const hashActuel = results[0].mdp;

        if (sha256(ancienMotDePasse) !== hashActuel) {
            return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
        }

        const nouveauHash = sha256(nouveauMotDePasse);

        const updateQuery = 'UPDATE Entite SET mdp = ? WHERE IdEntite = ?';

        connection.query(updateQuery, [nouveauHash, idEntite], (err, results) => {
            if (err) {
                console.error('Erreur SQL (update password) : ', err);
                return res.status(500).json({ message: 'Erreur interne au serveur' });
            }

            console.log(`Mot de passe du compte ${idEntite} mis à jour`);
            res.json({ message: 'Mot de passe mis à jour avec succès' });
        });
    });
});


app.put('/vehicule/:id/etat', (req, res) => {
    console.log('Route /vehicule/:id/etat appellée');
    const { id } = req.params;
    const { IdEtat } = req.body;

    console.log('Id Véhicule : ', id);
    if (!IdEtat) {
        return res.status(400).json({ message: 'IdEtat manquant' });
    }

    const query = `
    UPDATE Vehicule
    SET IdEtat = ?
    WHERE IdVehicule = ?
    `;
    connection.query(query, [IdEtat, id], (err, results) => {
        if (err) {
            console.error('Erreur SQL : ', err);
            return res.status(500).json({ message: 'Erreur interne au serveur' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Véhicule non trouvé' });
        }
        console.log(results);
        res.json({ message: 'Etat mis à jour avec succès' });
    });
});