<?php
    // Connexion à la base de données
    require_once('includes/connexion.php');

    /*include_once('../../vendor/autoload.php');

    Sentry\Init(['dsn' => 'http://c59212feb7e244a19d9bf0c88e3fb7e5@172.16.0.100:8000/11']);*/

    // Récupération des variables nécessaires
    $id = htmlspecialchars(trim($_POST['identifiant']), ENT_QUOTES, 'UTF-8');
    $nom = htmlspecialchars(trim($_POST['nom']), ENT_QUOTES, 'UTF-8');
    $mdp = $_POST['mdp'];
    $mail = filter_var(trim($_POST['mail']), FILTER_SANITIZE_EMAIL);
    $confirmMdp = $_POST['confirm_mdp'];
    $prenom = htmlspecialchars(trim($_POST['prenom']), ENT_QUOTES, 'UTF-8');
    $age = filter_var($_POST['age'], FILTER_VALIDATE_INT);

    $mdpHash = hash('sha256', $mdp);

    // Validation de l'email
    if(!filter_var($mail, FILTER_VALIDATE_EMAIL)){
        //\Sentry\captureMessage("‼️Gestion de circuit : Email invalide pour l'inscription de ".$id." ‼️", \Sentry\Severity::warning());
        header("Location: ../html/erreur/erreurEmail.html");
        exit(); 
    }
    
    // Vérification si le mot de passe de confirmation correspond au mot de passe
    if($confirmMdp !== $mdp){
        //\Sentry\captureMessage("‼️Gestion de circuit : Mot de passe et confirmation non identiques pour l'inscription de ".$id." ‼️", \Sentry\Severity::warning());
        header("Location: ../html/erreur/erreurMdp.html");
        exit(); 
    }

    // 🔒 HACHAGE SÉCURISÉ DU MOT DE PASSE (CRITIQUE!)
    //$mdpHache = password_hash($mdp, PASSWORD_ARGON2ID);
    // Alternative si Argon2id non disponible : PASSWORD_BCRYPT

    // Vérification de l'email AVANT l'insertion
    $sql = "SELECT COUNT(*) as nb FROM `Entite` WHERE `Mail` = :mail";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':mail', $mail, PDO::PARAM_STR);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if($result['nb'] > 0){
        //\Sentry\captureMessage("‼️Gestion de circuit : ".$mail." déjà utilisé pour l'inscription de ".$id." ‼️", \Sentry\Severity::warning());
        header("Location: ../html/erreur/erreurInscription.html");
        exit(); 
    }

    // Vérification de l'unicité de l'identifiant
    $sql = "SELECT COUNT(*) as nb FROM `Entite` WHERE `Identifiant` = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id', $id, PDO::PARAM_STR);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if($result['nb'] > 0){
        //\Sentry\captureMessage("‼️Gestion de circuit : Identifiant déjà utilisé pour l'inscription de ".$id." ‼️", \Sentry\Severity::warning());
        header("Location: ../html/erreur/erreurIdentifiant.html");
        exit(); 
    }

    // 🔒 TRANSACTION pour garantir l'intégrité des données
    try {
        $pdo->beginTransaction();

        // Création de la requête d'inscription
        $sql = "INSERT INTO `Entite`(`Identifiant`, `Nom`, `mdp`, `Mail`) VALUES (:id, :nom, :mdp, :mail)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);
        $stmt->bindParam(':nom', $nom, PDO::PARAM_STR);
        $stmt->bindParam(':mdp', $mdpHash, PDO::PARAM_STR); // Mot de passe haché
        $stmt->bindParam(':mail', $mail, PDO::PARAM_STR);
        $stmt->execute();

        // Récupération de l'ID inséré
        $idEntite = $pdo->lastInsertId();
        //\Sentry\captureMessage("👌Gestion de circuit : Nouvel utilisateur inscrit avec l'identifiant ".$id." 👌", \Sentry\Severity::info());

        // Enregistrement du client dans la table client
        $sql = "INSERT INTO `Client`(`Prenom`, `Age`, `IdEntite`) VALUES (:prenom, :age, :idEntite)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':prenom', $prenom, PDO::PARAM_STR);
        $stmt->bindParam(':age', $age, PDO::PARAM_INT);
        $stmt->bindParam(':idEntite', $idEntite, PDO::PARAM_INT);
        $stmt->execute();

        // Validation de la transaction
        $pdo->commit();

         session_start();
            // creation de cookie de connection
            $_SESSION['logged_in'] = true;
            $_SESSION['username'] = $idEntite;
            setcookie('user_name', $idEntite, time() + (24 * 60 * 60), '/');
            //\Sentry\captureMessage("👌Gestion de circuit : ".$id." est connecté après inscription ! 👌", \Sentry\Severity::info());
        header('Location: ../html/informationCompte.html');
        exit(); 

    } catch(Exception $e) {
        // En cas d'erreur, annulation de toutes les opérations
        $pdo->rollBack();
        error_log("Erreur inscription ☠️☠️☠️☠️☠️☠️⚰️⚰️⚰️⚰️⚰️⚰️⚰️ : " . $e->getMessage());
        header("Location: ../html/erreur/erreurSysteme.html");
        exit();
    }
?>