<?php
require_once('includes/connexion.php');

session_start();

try {
    if (!isset($_POST['identifiant']) || !isset($_POST['password'])) {
        die('Champs d\'authentification manquants');
    }

    $identifiant = htmlspecialchars($_POST['identifiant'], ENT_QUOTES, 'UTF-8');
    $mdp_user = $_POST['password'];

    $stmt = $pdo->prepare('SELECT mdp, IdEntite FROM Entite WHERE Identifiant = :identifiant');
    $stmt->bindParam(':identifiant', $identifiant, PDO::PARAM_STR);
    $stmt->execute();

    $arrColumn = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($arrColumn)) {
        die('Identifiant introuvable');
    }

    $mdp = $arrColumn[0]['mdp'];
    $id = $arrColumn[0]['IdEntite'];

    if (hash('sha256', $mdp_user) === $mdp) {
        $_SESSION['logged_in'] = true;
        $_SESSION['user_name'] = $id;
        setCookie('user_name', $id, time() + (24 * 60 * 60), '/');
        header('Location: ../html/informationCompte.html');
        exit;
    } else {
        die("Echec de la connexion : mot de passe incorrect");
    }
} catch (PDOException $e) {
    error_log('Erreur BDD : ' . $e->getMessage());
    die('Erreur lors de la connexion à la BDD '. $e->getMessage());
}
