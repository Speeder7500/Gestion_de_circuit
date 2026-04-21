// Appeler la fonction lors du chargement de la page
window.onload = function () {
  checkLoginCookie();  // Vérifie le cookie à chaque fois qu'une page protégée est chargée
};
function getCookie(name) {
  // Ajoute "=" pour chercher "nomCookie=valeur"
  const nameEQ = name + "=";

  // Sépare tous les cookies (séparés par "; ")
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];

    // Supprime les espaces au début
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }

    // Si le cookie correspond, retourne sa valeur
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }

  return null; // Cookie non trouvé
}

// Vérification du cookie de connexion
function checkLoginCookie() {
  const userName = getCookie('user_name');  // Nom du cookie (par exemple 'user_name')

  // Si le cookie 'user_name' existe, on laisse l'utilisateur sur la page
  if (userName) {
    console.log("Utilisateur connecté : " + userName);
    window.location.href = '../html/informationCompte.html';
    return true;
  } else {
    // Si le cookie n'existe pas, redirige vers la page de connexion
    console.log("Utilisateur non connecté, redirection vers la page de connexion.");
    return false;
  }
}