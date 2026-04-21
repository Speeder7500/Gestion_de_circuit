<?php
// --- LOGIQUE MÉTIER (BACKEND) ---

// Configuration
$apiUrl = 'http://172.16.195.254:5000/vehicule/';


// Initialisation des variables
$voitures = [];
$sourceData = "API Node";
$erreurApi = false;

// 1. Récupération des données (Appel API)
// L'opérateur @ masque les warnings si le serveur est éteint
$json = @file_get_contents($apiUrl);

// 2. Traitement de la réponse
if ($json === FALSE) {
    // Cas d'erreur : API inaccessible
    $erreurApi = true;
    $sourceData = "Mode Démo (Erreur API)";

    // Données de secours 
    $voitures = [
        ['IdVehicule' => 1, 'Marque' => 'Audi', 'Modele' => 'R8 V10 (Démo)'],
        ['IdVehicule' => 2, 'Marque' => 'Porsche', 'Modele' => '911 GT3 (Démo)'],
        ['IdVehicule' => 3, 'Marque' => 'Ferrari', 'Modele' => '488 Pista (Démo)'],
        ['IdVehicule' => 4, 'Marque' => 'Lamborghini', 'Modele' => 'Huracan (Démo)']
    ];
} else {
    // Cas succès : Décodage du JSON
    $voitures = json_decode($json, true);

    // Sécurité si le JSON est malformé
    if (!is_array($voitures)) {
        $voitures = [];
    }
}

// 4. Préparer les données pour JavaScript
$vehData = [];
foreach ($voitures as $index => $voiture) {
    $vehData[] = [
        'IdVehicule' => $voiture['IdVehicule'] ?? $index,
        'Marque' => $voiture['Marque'] ?? 'Unknown',
        'Modele' => $voiture['Modele'] ?? 'Unknown',
        'image' => getImageByIndex($index, $defaultImages),
        'status' => 'Disponible'
    ];
}

// 5. Retourner JSON pour le client
header('Content-Type: application/json');
echo json_encode([
    'success' => !$erreurApi,
    'source' => $sourceData,
    'vehicles' => $vehData
]);
