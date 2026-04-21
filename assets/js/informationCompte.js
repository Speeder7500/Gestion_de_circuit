fetch('http://172.16.195.254:5000/compte', {
    credentials: 'include'  // ← IMPORTANT !
})
    .then(
        function (response) {
            if (response.status === 200) {
                response.json()
                    .then(
                        function (datas) {
                            let informationCompte = document.getElementById('informationCompte');
                            datas.forEach(
                                function (data) {
                                    informationCompte.appendChild(compte(data));
                                }
                            )
                        }
                    )
            } else {
                console.log(`Status de la reponse de la route compte : ${response.status}`);
            }
        }
    );

function compte(dataUser) {
    let mail = dataUser.Mail;
    let nom = dataUser.Nom;
    let prenom = dataUser.Prenom;
    let identifiant = dataUser.Identifiant;

    let ligne = document.createElement('tr');

    let colMail = document.createElement('td');
    let colNom = document.createElement('td');
    let colPrenom = document.createElement('td');
    let colIdentifiant = document.createElement('td');

    colMail.textContent = mail;
    colNom.textContent = nom;
    colPrenom.textContent = prenom;
    colIdentifiant.textContent = identifiant;

    ligne.appendChild(colMail);
    ligne.appendChild(colNom);
    ligne.appendChild(colPrenom);
    ligne.appendChild(colIdentifiant);

    return ligne;
}