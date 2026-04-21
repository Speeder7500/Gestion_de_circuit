<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=SpeedCircuit;charset=utf8mb4', 'circuit', 'VQ2kbJaHf0PmItial7SZ');
    
    // 🔒 CONFIGURATION SÉCURISÉE OBLIGATOIRE
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false); // Vraies requêtes préparées
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // Exceptions
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    error_log( 'Connexion établie');
    
} catch(PDOException $e) {
    error_log("Erreur connexion : " . $e->getMessage());
    die("Erreur de connexion à la base de données");
}
?>