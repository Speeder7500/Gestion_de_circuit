const BASE_URL = 'http://172.16.195.254:5000';

document.addEventListener('DOMContentLoaded', function () {
    prefillFromURL();

    document.querySelector('form').addEventListener('submit', async function (e) {
        const idReservation = document.getElementById('idReservation').value;

        if (!idReservation) return;

        e.preventDefault();

        const body = {
            date: document.querySelector('input[name="date"]').value,
            heure: document.querySelector('input[name="heure"]').value,
            marque: document.getElementById('marque').value,
            modele: document.getElementById('modele').value,
        };

        try {
            const response = await fetch(`${BASE_URL}/reservation/${idReservation}`, {
                method: 'PUT',
                credentials: "include",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                window.location.href = 'informationCompte.html';
            } else {
                const err = await response.json();
                alert(err.message || 'Erreur lors de la modification');
            }
        } catch (error) {
            console.error(error);
            alert('Erreur réseau');
        }
    });
});

function prefillFromURL() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    const form = document.querySelector('form');
    form.removeAttribute('action');
    form.removeAttribute('method');

    document.querySelector('.formTitle').textContent = 'Modifier la réservation';
    document.querySelector('.submitButton').textContent = 'Modifier';
    document.getElementById('idReservation').value = id;

    const dateInput = document.querySelector('input[name="date"]');
    const heureInput = document.querySelector('input[name="heure"]');
    if (params.get('date')) dateInput.value = params.get('date').substring(0, 10);
    if (params.get('heure')) heureInput.value = params.get('heure');

    const marque = params.get('marque');
    const modele = params.get('modele');
    if (marque !== "Votre"  && modele !== "Vehicule") {
        const radioAvec = document.querySelector('input[name="locationOption"][value="avec"]');
        radioAvec.checked = true;
        radioAvec.dispatchEvent(new Event('change'));
        document.getElementById('marque').value = marque;
        document.getElementById('modele').value = modele;
    }
}