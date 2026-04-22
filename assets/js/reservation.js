/**
 * Script de gestion de la réservation - Charge et affiche les voitures disponibles
 */

// Configuration
const API_URL = 'http://172.16.195.254:5000/vehicule/'; // API Node backend
const FALLBACK_API_URL = '../php/reservation.php'; // API PHP fallback

const selectedCar = document.getElementById('selectedCar');
let selectedCarMarque = null;
let selectedModele = null;
let selectedPriceCar = null;
let selectedCarId = null;
let selectedCarName = null;
let selectedCarModel = null;
let carPrice = null;

// Au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadVehicles();

    const radios = document.querySelectorAll('input[name="locationOption"]');
    const carPanel = document.querySelector('.carDisplayPanel');
    selectedPriceCar = document.getElementById('priceCar');
    selectedCarMarque = document.getElementById('marque');
    selectedModele = document.getElementById('modele');


    function updateCarPanelVisibility() {
        const selected = document.querySelector('input[name="locationOption"]:checked');
        carPanel.style.display = selected?.value === 'avec' ? 'flex' : 'none';
        selectedCar.style.display = selected?.value === 'avec' ? '' : 'none';
        selectedPriceCar.value = selected?.value === 'avec' ? '' : '120 €';
        selectedCarMarque.value = selected?.value === 'avec' ? '' : '';
        selectedModele.value = selected?.value === 'avec' ? '' : '';
    }

    updateCarPanelVisibility();
    radios.forEach(radio => radio.addEventListener('change', updateCarPanelVisibility));
});

/**
 * Charge les véhicules depuis l'API
 */
async function loadVehicles() {
    const grilleVehicules = document.getElementById('grilleVehicules');
    const compteur = document.getElementById('compteurVehicules');

    try {
        // Essayer d'abord l'API Node
        let response = await fetch(API_URL);
        let data = response.json();

        // Si l'API Node échoue, utiliser le fallback PHP
        if (!response.ok) {
            response = await fetch(FALLBACK_API_URL);
            data = await response.json();
        } else {
            data = await data;
        }

        // Vérifier si les données sont valides
        if (!Array.isArray(data)) {
            throw new Error('Format de données invalide');
        }

        // Afficher les véhicules
        displayVehicles(data);
        compteur.textContent = `${data.length} voiture${data.length > 1 ? 's' : ''}`;

    } catch (error) {
        console.error('Erreur lors du chargement des véhicules:', error);
        grilleVehicules.innerHTML = `<p style="color: red; grid-column: 1/-1;">Erreur de chargement. Veuillez rafraîchir la page.</p>`;
        compteur.textContent = '0 voiture';
    }
}

/**
 * Affiche les véhicules dans la grille
 */
function displayVehicles(vehicles) {
    const grilleVehicules = document.getElementById('grilleVehicules');
    grilleVehicules.innerHTML = ''; // Effacer le contenu précédent

    if (vehicles.length === 0) {
        grilleVehicules.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">Aucune voiture disponible</p>';
        return;
    }

    // Générer les cartes de véhicules
    vehicles.forEach((vehicle, index) => {
        const card = createCarCard(vehicle, index);
        grilleVehicules.appendChild(card);
    });
}

/**
 * Crée une carte de véhicule
 */
function createCarCard(vehicle, index) {
    const card = document.createElement('div');
    card.className = 'carCard';
    card.innerHTML = `
        <div class="carImageWrapper">
            <img src="../img/Vehicule/${vehicle.IdVehicule}.png" alt="${vehicle.Marque} ${vehicle.Modele}" class="carImage">
        </div>
        <div class="carDetails">
            <div class="carName">${vehicle.Marque} ${vehicle.Modele}</div>
            <div class="carSpecs">
                <span class="availabilityTag ${vehicle.libelleEtat}">${vehicle.libelleEtat}</span>
            </div>
        </div>
    `;
    if (vehicle.IdEtat === 1) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => selectVehicle(vehicle.IdVehicule, vehicle.Marque, vehicle.Modele, vehicle.Prix));
    } else {
        card.style.cursor = 'not-allowed';
    }
    return card;
}

/**
 * Sélectionne un véhicule et met à jour le formulaire
 */
function selectVehicle(id, marque, modele, prix) {
    selectedCarId = id;
    selectedCarName = `${marque}`;
    selectedCarModel = `${modele}`;
    carPrice = `${prix} €`;

    selectedCarMarque = document.getElementById('marque');
    selectedModele = document.getElementById('modele');
    // Mettre à jour le champ du formulaire

    if (selectedCar && selectedPriceCar) {
        selectedCarMarque.value = selectedCarName;
        selectedPriceCar.value = carPrice;
        selectedModele.value = selectedCarModel;
    }
}
