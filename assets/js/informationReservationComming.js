const BASE_URL = 'http://172.16.195.254:5000';
fetch(`${BASE_URL}/reservation/comming`, {
    credentials: 'include'
})
    .then(
        function (reponse) {
            if (reponse.status === 200) {
                reponse.json()
                    .then(
                        function (datas) {
                            let informationReservationComming = document.getElementById('informationReservationComming');
                            if (datas.length === 0) {
                                let ligne = document.createElement('tr');
                                ligne.textContent = "Vous n'avez aucune reservations a venir pour ce moment.";
                                ligne.style.color = "white";
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
    let idReservation = dataUser.IdReservation;

    const dateFormatee = new Date(date).toLocaleDateString('fr-FR');
    const heureFormatee = heure.substring(0, 5);
    
    let supprimer = document.createElement('button');
    let modifier = document.createElement('button');
    let buttonGroup = document.createElement('div');

    supprimer.textContent = 'Supprimer';
    supprimer.id = 'btn-suprimer';
    supprimer.dataset.id = idReservation;

    supprimer.addEventListener('click', function() {
        ouvrirModalSuppression(ligne, idReservation, dateFormatee, heureFormatee, marque, modele);
    });

    modifier.addEventListener('click', function () {
        const params = new URLSearchParams({
            id: idReservation,
            date: dataUser.DateReservation,
            heure: heureFormatee,
            marque: marque,
            modele: modele
        });
        window.location.href = `../html/reservation.html?${params.toString()}`;
    })

    modifier.textContent = 'Modifier';
    modifier.id = 'btn-modifier';

    buttonGroup.appendChild(modifier);
    buttonGroup.appendChild(supprimer);

    buttonGroup.classList.add('btn-group');

    let ligne = document.createElement('tr');

    let colDate = document.createElement('td');
    let colHeure = document.createElement('td');
    let colMarque = document.createElement('td');
    let colModele = document.createElement('td');
    let colButtonGroup = document.createElement('td');

    colDate.textContent = dateFormatee;
    colHeure.textContent = heureFormatee;
    colMarque.textContent = marque;
    colModele.textContent = modele;
    colButtonGroup.appendChild(buttonGroup);

    ligne.appendChild(colDate);
    ligne.appendChild(colHeure);
    ligne.appendChild(colMarque);
    ligne.appendChild(colModele);
    ligne.appendChild(colButtonGroup);

    return ligne;
}