fetch('http://172.16.195.254:5000/reservation/comming', {
    credentials: 'include'
})
    .then(
        function (reponse) {
            if (reponse.status === 200) {
                reponse.json()
                    .then(
                        function (datas) {
                            console.log(datas);
                            let informationReservationComming = document.getElementById('informationReservationComming');
                            console.log(informationReservationComming);
                            if (datas.length === 0) {
                                let ligne = document.createElement('tr');
                                ligne.textContent = "Vous n'avez aucune reservations a venir pour ce moment.";
                                informationReservationComming.appendChild(ligne);
                            }
                            datas.forEach(
                                function (data) {
                                    informationReservationComming.appendChild(reservationComming(data));
                                }
                            )
                        }
                    );
            }
        }
    );

function reservationComming(dataUser) {
    let date = dataUser.DateReservation;
    let heure = dataUser.HeureReservation;
    let marque = dataUser.Marque;
    let modele = dataUser.Modele;

    let ligne = document.createElement('tr');

    let colDate = document.createElement('td');
    let colHeure = document.createElement('td');
    let colMarque = document.createElement('td');
    let colModele = document.createElement('td');

    colDate.textContent = new Date(date).toLocaleDateString('fr-FR');
    colHeure.textContent = heure.substring(0, 5);
    colMarque.textContent = marque;
    colModele.textContent = modele;

    ligne.appendChild(colDate);
    ligne.appendChild(colHeure);
    ligne.appendChild(colMarque);
    ligne.appendChild(colModele);

    return ligne;
}