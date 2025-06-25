// Script de diagnostic et réparation automatique du token
// filepath: /Users/mouslimaptievitch.mourdalov/matcha/frontend/src/utils/tokenDiagnostic.ts

export const diagnoseAndFixToken = () => {
  console.log("🔍 === DIAGNOSTIC DU TOKEN ===");
  
  const token = localStorage.getItem("token");
  
  if (!token) {
    console.log("❌ Aucun token trouvé dans localStorage");
    return {
      status: "NO_TOKEN",
      message: "Aucun token trouvé. Veuillez vous connecter.",
      action: "LOGIN_REQUIRED"
    };
  }
  
  console.log("📍 Token trouvé, longueur:", token.length);
  console.log("📍 Premiers 20 caractères:", token.substring(0, 20));
  
  // Vérifier si c'est un hex string (confirmationtoken)
  if (token.length === 64 && /^[a-f0-9]+$/i.test(token)) {
    console.log("🚨 PROBLÈME DÉTECTÉ: C'est le confirmationtoken!");
    console.log("🔧 Suppression du token invalide...");
    localStorage.removeItem("token");
    
    return {
      status: "CONFIRMATION_TOKEN_DETECTED",
      message: "Token de confirmation d'email détecté au lieu du JWT. Token supprimé.",
      action: "LOGIN_REQUIRED",
      details: "Le confirmationtoken de l'email a remplacé le JWT d'authentification"
    };
  }
  
  // Vérifier si c'est un JWT
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.log("🚨 PROBLÈME DÉTECTÉ: Ce n'est pas un JWT valide!");
    console.log("🔧 Suppression du token invalide...");
    localStorage.removeItem("token");
    
    return {
      status: "INVALID_JWT_FORMAT",
      message: "Token avec format invalide détecté. Token supprimé.",
      action: "LOGIN_REQUIRED"
    };
  }
  
  // Vérifier le contenu du JWT
  try {
    const payload = JSON.parse(atob(parts[1]));
    console.log("✅ JWT valide détecté");
    console.log("📋 Payload:", payload);
    
    // Vérifier l'expiration
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000);
      const now = new Date();
      
      if (expDate <= now) {
        console.log("🚨 Token expiré:", expDate);
        console.log("🔧 Suppression du token expiré...");
        localStorage.removeItem("token");
        
        return {
          status: "EXPIRED_TOKEN",
          message: "Token expiré détecté. Token supprimé.",
          action: "LOGIN_REQUIRED",
          expiredAt: expDate
        };
      }
      
      console.log("✅ Token valide et non expiré");
      console.log("⏰ Expire le:", expDate);
    }
    
    return {
      status: "VALID_TOKEN",
      message: "Token JWT valide",
      action: "CONTINUE",
      payload
    };
    
  } catch (error) {
    console.log("🚨 ERREUR lors du parsing du JWT:", error);
    console.log("🔧 Suppression du token corrompu...");
    localStorage.removeItem("token");
    
    return {
      status: "CORRUPTED_TOKEN",
      message: "Token corrompu détecté. Token supprimé.",
      action: "LOGIN_REQUIRED",
      error: error.message
    };
  }
};

// Fonction pour afficher les résultats de diagnostic de manière user-friendly
export const displayDiagnosticResult = (result: ReturnType<typeof diagnoseAndFixToken>) => {
  const messages = {
    NO_TOKEN: "Aucun token trouvé. Veuillez vous connecter.",
    CONFIRMATION_TOKEN_DETECTED: "❌ Problème identifié: Le token de confirmation d'email a remplacé votre token de connexion. Veuillez vous reconnecter.",
    INVALID_JWT_FORMAT: "❌ Token invalide détecté. Veuillez vous reconnecter.",
    EXPIRED_TOKEN: "❌ Votre session a expiré. Veuillez vous reconnecter.",
    CORRUPTED_TOKEN: "❌ Token corrompu détecté. Veuillez vous reconnecter.",
    VALID_TOKEN: "✅ Token valide - vous pouvez continuer."
  };
  
  return messages[result.status] || "Statut inconnu";
};
