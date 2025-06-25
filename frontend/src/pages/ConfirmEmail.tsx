import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ConfirmEmail = () => {
  const [status, setStatus] = useState("loading");
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  useEffect(() => {
    let called = false;

    const confirmEmailtoken = async () => {
      try {
        if (called) return;
        called = true;


        // Utiliser fetch natif sans intercepteur pour éviter d'ajouter automatiquement le JWT
        const response = await window.fetch(
          `http://localhost:5001/api/confirm-email/${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();


        if (response.ok) {
          setStatus("success");

          // Stocker le token JWT reçu pour continuer l'inscription
          if (data.token) {
            localStorage.setItem("token", data.token);
          }

          // Ne pas rediriger automatiquement vers signup
          // L'utilisateur cliquera sur le bouton "Terminer mon inscription"
        } else {
          console.error("Erreur de confirmation:", data);
          setStatus("error");
        }
      } catch (error) {
        console.error("Erreur lors de la confirmation:", error);
        setStatus("error");
      }
    };

    if (token) {
      confirmEmailtoken();
    } else {
      setStatus("error");
    }
  }, [token]); // Ajouter token comme dépendance

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 p-4">
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-4 shadow-xl transform hover:scale-105 transition-all duration-300">
            <span className="text-white text-2xl">📧</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Matcha
          </h1>
        </div>

        <div className="bg-white/90 backdrop-blur-sm shadow-2xl shadow-black/20 border-0 overflow-hidden rounded-2xl p-8">
          {status === "loading" && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Confirmation en cours...
              </h3>
              <p className="text-gray-600">
                Veuillez patienter pendant que nous vérifions votre email.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-4 animate-bounce">
                <span className="text-green-600 text-2xl">✅</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Email confirmé avec succès!
              </h3>
              <p className="text-gray-600 mb-6">
                Votre adresse email a été vérifiée. Vous pouvez maintenant
                terminer la création de votre profil.
              </p>
              <a
                href="/signup"
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-medium inline-block"
              >
                Terminer mon inscription
              </a>
            </div>
          )}

          {status === "error" && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center p-4 bg-red-100 rounded-full mb-4">
                <span className="text-red-600 text-2xl">❌</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Erreur de confirmation
              </h3>
              <p className="text-gray-600 mb-6">
                Le lien de confirmation est invalide ou a expiré. Veuillez vous
                réinscrire ou demander un nouveau lien.
              </p>
              <div className="space-y-3">
                <a
                  href="/register"
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-medium inline-block w-full"
                >
                  Nouvelle inscription
                </a>
                <a
                  href="/login"
                  className="text-pink-600 hover:text-pink-800 font-semibold hover:underline transition-colors inline-block"
                >
                  Déjà un compte ? Se connecter
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer stylé */}
        <div className="text-center mt-6 text-gray-400 text-xs">
          <p className="flex items-center justify-center gap-1">
            Fait avec <span className="text-pink-400">💕</span> pour vous
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
