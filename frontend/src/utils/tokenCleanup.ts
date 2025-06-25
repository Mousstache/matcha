// Utilitaire pour nettoyer automatiquement les données invalides au démarrage de l'app
export const cleanupInvalidTokens = () => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return; // Pas de token, rien à nettoyer
  }

  try {
    // Vérifier si le token est valide
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Date.now() / 1000;
    
    // Vérifier l'expiration
    if (payload.exp && payload.exp < now) {
      clearStorageData();
      return;
    }
    
    // Vérifier la structure du token
    if (!payload.id && !payload.email) {
      clearStorageData();
      return;
    }
    
  } catch (error) {
    clearStorageData();
  }
};

const clearStorageData = () => {
  // Nettoyer toutes les données d'authentification
  localStorage.removeItem("token");
  
  // Optionnel: nettoyer d'autres données de cache si nécessaire
  // localStorage.removeItem("user_preferences");
  // sessionStorage.clear();
  
};

// Fonction pour vérifier périodiquement la validité du token
export const startTokenValidationInterval = (onInvalidToken: () => void) => {
  const checkToken = () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      return; // Pas de token, pas de vérification nécessaire
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Date.now() / 1000;
      
      if (payload.exp && payload.exp < now) {
        onInvalidToken();
      }
    } catch (error) {
      onInvalidToken();
    }
  };
  // Vérifier toutes les 5 minutes
  return setInterval(checkToken, 5 * 60 * 1000);
};
