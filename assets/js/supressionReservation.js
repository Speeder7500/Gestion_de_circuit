let _modalLigneEnCours = null;
let _modalIdEnCours = null;

(function () {
    const overlay = document.getElementById('modalSuppression');
    const btnAnnuler = document.getElementById('modalBtnAnnuler');
    const btnSupprimer = document.getElementById('modalBtnSupprimer');

    btnAnnuler.addEventListener('click', fermerModal);

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) fermerModal();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') fermerModal();
    });

    btnSupprimer.addEventListener('click', async function() {
        btnSupprimer.disabled = true;
        btnSupprimer.textContent = 'Suppression...';

        try {
            const response = await fetch(`http://172.16.195.254:5000/reservation/delete/${_modalIdEnCours}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                afficherFeedback('success', '✔️ Réservation suprimmée avec succès');
                setTimeout(function () {
                    if (_modalLigneEnCours) _modalLigneEnCours.remove();
                    fermerModal();
                }, 1200);
            } else {
                afficherFeedback('error', '✖️ Impossible de contacter le serveur.');
                btnSupprimer.disabled = false;
                btnSupprimer.textContent = 'Réessayer';
            }
        } catch (err) {
            afficherFeedback('error', '✖️ Impossible de contacter le serveur.');
                btnSupprimer.disabled = false;
                btnSupprimer.textContent = 'Réessayer';
        }
    });
})();

function ouvrirModalSuppression(ligne, idReservation, date, heure, marque, modele) {
    _modalLigneEnCours = ligne;
    _modalIdEnCours = idReservation;

    document.getElementById('modal-date').textContent = date;
    document.getElementById('modal-heure').textContent = heure;
    document.getElementById('modal-marque').textContent = marque;
    document.getElementById('modal-modele').textContent = modele;

    const btnSupprimer = document.getElementById('modalBtnSupprimer');
    btnSupprimer.disabled = false;
    btnSupprimer.textContent = 'Supprimer';

    const feedback = document.getElementById('modalFeedback');
    feedback.style.display = 'none';
    feedback.className = 'modal-feedback';

    document.getElementById('modalSuppression').classList.add('active');
    document.getElementById('modalBtnAnnuler').focus();
}

function fermerModal() {
    document.getElementById('modalSuppression').classList.remove('active');
    _modalIdEnCours = null;
    _modalLigneEnCours = null;
}

function afficherFeedback(type, message) {
    const feedback = document.getElementById('modalFeedback');
    feedback.textContent = message;
    feedback.className = `modal-feedback ${type}`;
    feedback.style.display = 'block';
}