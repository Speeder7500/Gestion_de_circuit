fetch('http://172.16.195.254:5000/reservation/past', {
    credentials: 'include'
})
    .then(
        function (reponse) {
            if (reponse.status === 200) {
                reponse.json()
                    .then(
                        function (datas) {
                            let informationReservationPast = document.getElementById('informationReservationPast');
                            if (datas.length === 0) {
                                let ligne = document.createElement('tr');
                                ligne.textContent = "Aucune reservation enregistrées dans l'historique";
                                informationReservationPast.appendChild(ligne);
                            }
                            datas.forEach(
                                function (data) {
                                    informationReservationPast.appendChild(historique(data));
                                }
                            )
                        }
                    );
            }
        }
    );

function historique(dataUser) {
    let date = dataUser.DateSession;
    let marque = dataUser.Marque;
    let modele = dataUser.Modele;

    let ligne = document.createElement('tr');

    let colDate = document.createElement('td');
    let colMarque = document.createElement('td');
    let colModele = document.createElement('td');

    colDate.textContent = date;
    colMarque.textContent = marque;
    colModele.textContent = modele;

    ligne.appendChild(colDate);
    ligne.appendChild(colMarque);
    ligne.appendChild(colModele);

    return ligne;
}