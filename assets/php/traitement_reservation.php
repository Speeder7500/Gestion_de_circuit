<?php
require_once('includes/connexion.php');

if (!isset($_COOKIE['user_name'])) {
    header('Location: ../html/authentification.html');
    exit;
} else {
    $date = ($_POST['date']);
    $heure = $_POST['heure'];
    $prix = floatval(str_replace(['€', ' '], '', $_POST['prix']));
    $idEntite = ($_COOKIE['user_name']);
    $marque = $_POST['marque'];
    $modele = $_POST['modele'];


    try {
        $stmt = $pdo->prepare('SELECT IdVehicule FROM Vehicule WHERE Modele = :vehicule');
        $stmt->bindParam(':vehicule', $modele, PDO::PARAM_STR);
        $stmt->execute();

        $arrAll = $stmt->fetchAll();

        if (empty($arrAll)) {
            $IdVehicule = 100;
        } else {
            $IdVehicule = $arrAll[0]["IdVehicule"];
        }
    } catch (PDOException $e) {
        die('Erreur lors de la connexion à la BDD ' . $e->getMessage());
    }

    try {
        $stmt = $pdo->prepare('SELECT IdClient FROM Client WHERE IdEntite = :id');
        $stmt->bindParam(':id', $idEntite, PDO::PARAM_STR);
        $stmt->execute();

        $arrAll = $stmt->fetchAll();
        var_dump($arrAll);

        $client = $arrAll[0]['IdClient'];
    } catch (PDOException $e) {
        die('Erreur lors de la connexion à la BDD ' . $e->getMessage());
    }

    try {
        $stmt = $pdo->query('SELECT IdSession, COUNT(IdSession) as nb FROM Reservation GROUP BY IdSession;');
        $arrAll = $stmt->fetchAll();

        $idSession = null;
        for ($i = 0; $i < count($arrAll); $i++) {
            if ($arrAll[$i]['nb'] < 5) {
                $idSession = $arrAll[$i]["IdSession"];
                break;
            }
        }

        if ($idSession === null) {
            die('Aucune session disponible à la location');
        }
    } catch (PDOException $e) {
        die('Erreur lors de la connexion à la BDD ' . $e->getMessage());
    }


    try {
        $stmt = $pdo->prepare('INSERT INTO Reservation (DateReservation, HeureReservation, Prix, IdSession, IdVehicule, IdClient) VALUES (:date, :heure, :prix, :idSession, :idVehicule, :client);');
        $stmt->bindParam(':date', $date, PDO::PARAM_STR);
        $stmt->bindParam(':heure', $heure, PDO::PARAM_STR);
        $stmt->bindParam(':prix', $prix, PDO::PARAM_STR);
        $stmt->bindParam(':idSession', $idSession, PDO::PARAM_INT);
        $stmt->bindParam(':idVehicule', $IdVehicule, PDO::PARAM_INT);
        $stmt->bindParam(':client', $client, PDO::PARAM_INT);

        $stmt->execute();

        header('Location: ../html/informationCompte.html');
        exit;
    } catch (PDOException $e) {
        die('Erreur lors de la connexion à la BDD ' . $e->getMessage());
    }
}
