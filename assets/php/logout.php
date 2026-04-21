<?php

//include_once('../../vendor/autoload.php');
//Sentry\Init(['dsn' => 'http://c59212feb7e244a19d9bf0c88e3fb7e5@172.16.0.100:8000/11']);
    
// Détruit la session et redirige vers la page d'authentification
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Effacer toutes les variables de session
$_SESSION = [];

// Détruire le cookie de session si présent
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params['path'],
        $params['domain'],
        $params['secure'],
        $params['httponly']
    );
}

// Supprimer le cookie personnalisé 'user_name'
if (isset($_COOKIE['user_name'])) {
    setcookie('user_name', '', time() - 3600, '/');
    // Si le cookie a été créé avec des paramètres spécifiques, utilisez les mêmes :
    // setcookie('user_name', '', time() - 3600, '/', 'votre-domaine.com', true, true);
}

// Détruire la session côté serveur
/*if(session_destroy()) {
    // Session détruite avec succès
    \Sentry\captureMessage("🙈🙉Gestion de circuit : Utilisateur déconnecté 🥸", \Sentry\Severity::info());
}
else {
    \Sentry\captureMessage("🐷🐮Gestion de circuit : Échec de la déconnexion de l'utilisateur ⚠️", \Sentry\Severity::warning());
};
*/

// Redirection vers la page d'authentification
header('Location: ../html/authentification.html');
exit;
