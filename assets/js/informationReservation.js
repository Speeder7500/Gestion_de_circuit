fetch('http://172.16.195.254:5000/reservation', {
    credentials: 'include'
})
    .then(
        function (reponse) {
            if (reponse.status === 200) {
                reponse.json()
                    .then(
                        function (datas) {
                            let informationReservation = document.getElementById('informationReservation');
                            if (datas.length === 0) {
                                let ligne = document.createElement('tr');
                                ligne.textContent = "Vous n'avez aucune reservations a venir pour ce moment.";
                                informationReservation.appendChild(ligne);
                            }
                            datas.forEach(
                                function (data) {
                                    informationReservation.appendChild(reservation(data));
                                }
                            )
                        }
                    )
            }
        }
    );

function reservation(dataUser) {
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