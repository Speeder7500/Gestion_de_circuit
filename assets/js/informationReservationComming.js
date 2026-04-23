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
    
    let supprimer = document.createElement('button');
    let modifier = document.createElement('button');
    let buttonGroup = document.createElement('div');

    supprimer.textContent = 'Supprimer';
    supprimer.id = 'btn-suprimer';
    supprimer.dataset.id = idReservation;

    supprimer.addEventListener('click', async() => {
        const confirmation = confirm('Etes-vous sûr de vouloir supprimer cette réservation ?');

        if (!confirmation) return;

        console.log('URL appelée :', `/reservation/delete/${idReservation}`);
        console.log('idReservation : ', idReservation);

        const reponse = await fetch(`${BASE_URL}/reservation/delete/${idReservation}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (reponse.ok) {
            ligne.remove();
        } else {
            alert('Erreur lors de la suppression');
        }
    });

    modifier.textContent = 'Modifier';
    modifier.id = 'btn-modifier';

    buttonGroup.appendChild(supprimer);
    buttonGroup.appendChild(modifier);

    buttonGroup.classList.add('btn-group');

    let ligne = document.createElement('tr');

    let colDate = document.createElement('td');
    let colHeure = document.createElement('td');
    let colMarque = document.createElement('td');
    let colModele = document.createElement('td');
    let colButtonGroup = document.createElement('td');

    colDate.textContent = new Date(date).toLocaleDateString('fr-FR');
    colHeure.textContent = heure.substring(0, 5);
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