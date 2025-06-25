import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { Heart, Eye, EyeOff, UserRound, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState(location.state?.userName || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [online, setOnline] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { setFirstname, logout, refreshUser } = useAuth();
  const { setLastname } = useAuth();
  const { setAge } = useAuth();
  const { setGender } = useAuth();
  const { setLatitude } = useAuth();
  const { setLongitude } = useAuth();
  const { setSexualPreference } = useAuth();

  // Nettoyer les données au montage du composant
  useEffect(() => {
    logout(); // Assure-toi que l'utilisateur est déconnecté quand il arrive sur la page login
    setError(""); // Reset les erreurs
  }, []);

  // Afficher un message si l'utilisateur a été déconnecté automatiquement
  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userName || !password) {
      setError("Tous les champs sont requis.");
      return;
    }

    try {
      setIsLoading(true);
      setOnline(true);

      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          password,
          online,
          lastConnection: new Date(),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);

        // Modifier le message d'erreur selon l'état de vérification de l'email
        if (response.status === 403) {
          if (data.emailVerified === true) {
            setError(
              "Vous devez finaliser votre profil en complétant les informations demandées. Utilisez le lien envoyé dans l'email précédent pour terminer votre inscription."
            );
          } else {
            setError(data.message);
          }
        } else {
          setError(data.message);
        }
        return;
      }

      // Stocker le token
      localStorage.setItem("token", data.token);

      // Mettre à jour les données utilisateur dans le contexte
      setFirstname(data.firstname || "");
      setLastname(data.lastname || "");
      setAge(data.age || 0);
      setGender(data.gender || "");
      setLatitude(data.latitude || 0);
      setLongitude(data.longitude || 0);
      setSexualPreference(data.sexualPreference || "");

      // Actualiser les données utilisateur via le contexte
      await refreshUser();

      // Redirection
      navigate("/profil");
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      setError("Erreur lors de la connexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
      {/* Particules flottantes décoratives */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-pink-300 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-purple-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-fuchsia-300 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-pink-300 rounded-full animate-pulse delay-700"></div>
        <Heart
          className="absolute bottom-32 right-1/4 text-purple-200 animate-bounce delay-1000"
          size={12}
        />
      </div>

      <div className="w-full max-w-md relative">
        {/* En-tête avec logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-6 shadow-xl transform hover:scale-105 transition-all duration-300">
            <Heart
              size={32}
              fill="white"
              className="text-white animate-pulse"
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Matcha
          </h1>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Bon retour parmi nous ! 💕
          </h2>
          <p className="text-gray-600">
            Connectez-vous pour retrouver vos matchs
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl shadow-black/30 border-0 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100/20 to-gray-200/20 pointer-events-none"></div>

          <CardContent className="p-8 relative">
            {error && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-lg shadow-sm animate-in slide-in-from-top-1">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-5 w-5 text-red-400">⚠️</div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800 font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champ nom d'utilisateur */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <UserRound size={16} className="text-pink-500" />
                  Nom d'utilisateur
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    className="w-full px-4 py-3.5 pl-12 bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 placeholder-gray-400 group-hover:border-gray-400"
                    placeholder="Votre nom d'utilisateur"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                  <UserRound
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors"
                    size={18}
                  />
                </div>
              </div>

              {/* Champ mot de passe */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Lock size={16} className="text-pink-500" />
                    Mot de passe
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-sm text-pink-600 hover:text-pink-800 font-medium hover:underline transition-colors"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3.5 pl-12 pr-12 bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 placeholder-gray-400 group-hover:border-gray-400"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Lock
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors"
                    size={18}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Case à cocher Se souvenir */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                        rememberMe
                          ? "bg-pink-500 border-pink-500"
                          : "bg-white border-gray-300 group-hover:border-pink-400"
                      }`}
                    >
                      <svg
                        className={`w-3 h-3 text-white transition-opacity duration-200 ${
                          rememberMe ? "opacity-100" : "opacity-0"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                    Se souvenir de moi
                  </span>
                </label>
              </div>

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Connexion en cours...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Heart size={18} className="mr-2" fill="currentColor" />
                    Se connecter
                  </div>
                )}

                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </form>

            {/* Lien d'inscription */}
            <div className="mt-8 text-center relative">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">
                    ou
                  </span>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-600">
                Pas encore membre ?{" "}
                <a
                  href="/Register"
                  className="font-semibold text-pink-600 hover:text-pink-800 hover:underline transition-colors"
                >
                  Rejoignez l'aventure ! 💫
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Petite animation en bas */}
        <div className="text-center mt-6 text-gray-400 text-xs">
          <p className="flex items-center justify-center gap-1">
            Fait avec{" "}
            <Heart size={12} className="text-pink-400" fill="currentColor" />{" "}
            pour vous
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
