// Intercepteur pour gérer automatiquement les erreurs d'authentification
export const createAuthFetch = (logout: () => void) => {
  return async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");
    
    // Vérifier si le token est expiré avant la requête
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Date.now() / 1000;
        
        if (payload.exp && payload.exp < now) {
          console.log("🚨 Token expiré détecté avant requête, déconnexion automatique");
          logout();
          window.location.href = "/login";
          return Promise.reject(new Error("Token expiré"));
        }
      } catch (error) {
        console.log("🚨 Token invalide détecté, déconnexion automatique");
        logout();
        window.location.href = "/login";
        return Promise.reject(new Error("Token invalide"));
      }
    }

    // Ajouter automatiquement l'en-tête d'autorisation si un token existe
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Gérer les erreurs d'authentification
      if (response.status === 401 || response.status === 403) {
        console.log("🚨 Erreur d'authentification détectée, déconnexion automatique");
        logout();
        window.location.href = "/login";
        return Promise.reject(new Error("Authentification échouée"));
      }

      return response;
    } catch (error) {
      // En cas d'erreur réseau, on peut également nettoyer si nécessaire
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.warn("Erreur réseau détectée:", error);
      }
      throw error;
    }
  };
};

// Hook pour utiliser facilement l'intercepteur dans les composants
export const useAuthFetch = (logout: () => void) => {
  return createAuthFetch(logout);
};
