// Utilitaire pour valider les tokens JWT
// filepath: /Users/mouslimaptievitch.mourdalov/matcha/frontend/src/utils/tokenValidator.ts

export const validateJWTToken = (token: string | null): { isValid: boolean; error?: string; payload?: any } => {
  if (!token) {
    return { isValid: false, error: "Aucun token trouvé" };
  }

  // Vérifier que c'est un JWT (3 parties séparées par des points)
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.log("🚨 Token invalide (pas un JWT):", token.substring(0, 20) + "...");
    return { isValid: false, error: "Token invalide - ce n'est pas un JWT" };
  }

  try {
    // Décoder le payload
    const payload = JSON.parse(atob(parts[1]));
    
    // Vérifier l'expiration
    const now = Date.now() / 1000;
    if (payload.exp && payload.exp < now) {
      console.log("🚨 Token expiré");
      return { isValid: false, error: "Token expiré" };
    }

    console.log("✅ Token JWT valide, payload:", payload);
    return { isValid: true, payload };
  } catch (error) {
    console.log("🚨 Erreur lors de la validation du token:", error);
    return { isValid: false, error: "Token corrompu" };
  }
};

export const cleanupInvalidToken = () => {
  const token = localStorage.getItem("token");
  const validation = validateJWTToken(token);
  
  if (!validation.isValid) {
    console.log("🧹 Nettoyage du token invalide:", validation.error);
    localStorage.removeItem("token");
    return false;
  }
  
  return true;
};
