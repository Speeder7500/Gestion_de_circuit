<?php
require_once('includes/connexion.php');

if (!isset($_COOKIE['user_name'])) {
    header('Location: ../html/authentification.html');
    exit;
} else {
    $date = ($_POST['date']);
    $heure = $_POST['heure'];
    $prix = ($_POST['prix']);
    $client = ($_COOKIE['user_name']);
    $marque = $_POST['marque'];
    $modele = $_POST['modele'];

    try {
        $stmt = $pdo->prepare('SELECT IdVehicule FROM Vehicule WHERE Modele = :vehicule');
        $stmt->bindParam(':vehicule', $modele, PDO::PARAM_STR);
        $stmt->execute();

        $arrAll = $stmt->fetchAll();

        if (empty($arrAll)) {
            die('Véhicule introuvable');
        }

        $IdVehicule = $arrAll[0]["IdVehicule"];
    } catch (PDOException $e) {
        die('Erreur lors de la connexion à la BDD ' . $e->getMessage());
    }
}
