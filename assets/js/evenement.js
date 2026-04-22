fetch('http://172.16.195.254:5000/evenement')
    .then(
        function (response) {
            if (response.status === 200) {
                response.json()
                    .then(
                        function (datas) {
                            let listeEvenement = document.getElementById('listeEvenement');
                            datas.forEach(
                                function (data) {
                                    listeEvenement.appendChild(evenement(data));
                                }
                            )
                        }
                    )
            } else {
                console.log(`Status de la reponse de la route evenement : ${response.status}`);
            }
        }
    );
    
function evenement(data) {
    let LibelleEvenement = data.LibelleEvenement;
    let DateEvenement = data.DateEvenement;
    let Prix = `${data.Prix} €`;

    let ligne = document.createElement('tr');

    let colLibelleEvenement = document.createElement('td');
    let colDateEvenement = document.createElement('td');
    let colPrix = document.createElement('td');

    colLibelleEvenement.textContent = LibelleEvenement;
    colDateEvenement.textContent = DateEvenement;
    colPrix.textContent = Prix;

    ligne.appendChild(colLibelleEvenement);
    ligne.appendChild(colDateEvenement);
    ligne.appendChild(colPrix);

    

    return ligne;
}