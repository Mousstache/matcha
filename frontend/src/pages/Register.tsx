import { useState } from "react";
import {
  Card,
  CardContent,
  CardTitle,
} from "../../src/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Mail,
  User,
  Key,
  UserCircle,
  Users,
  Loader2,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !userName) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    setError("");
    setStep(2);
  };

  const sendForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          userName,
          firstName,
          lastName,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        setError(data.message);
        setLoading(false);
      } else {
        localStorage.setItem("token", data.token);
        setEmailSent(true);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 p-4">
      {/* Particules décoratives */}
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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-4 shadow-xl transform hover:scale-105 transition-all duration-300">
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
            Commencez votre nouvelle histoire 💕
          </h2>
          <p className="text-gray-600">Créez votre compte et trouvez l'amour</p>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl shadow-black/20 border-0 overflow-hidden rounded-2xl transform hover:scale-[1.01] transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100/20 to-gray-200/20 pointer-events-none"></div>

          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 relative">
            <CardTitle className="text-white text-center flex justify-center items-center gap-3">
              <Heart fill="white" size={24} className="animate-pulse" />
              <h2 className="text-xl font-bold">
                Inscription - Étape {step}/2
              </h2>
            </CardTitle>
          </div>

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

            {emailSent ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-4 animate-bounce">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Vérifiez votre email !
                </h3>
                <p className="text-gray-600 mb-4">
                  Nous avons envoyé un lien de confirmation à{" "}
                  <strong className="text-pink-600">{email}</strong>
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  Cliquez sur le lien dans l'email pour activer votre compte.
                  N'oubliez pas de vérifier vos spams si vous ne trouvez pas
                  l'email.
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-medium flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} />
                    Aller à la connexion
                  </button>
                </div>
              </div>
            ) : step === 1 ? (
              <form onSubmit={handleNext} className="flex flex-col space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Mail size={16} className="text-pink-500" />
                    Email
                  </label>
                  <div className="relative group">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 placeholder-gray-400 group-hover:border-gray-300"
                      placeholder="exemple@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <User size={16} className="text-pink-500" />
                    Nom d'utilisateur
                  </label>
                  <div className="relative group">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors"
                    />
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 placeholder-gray-400 group-hover:border-gray-300"
                      placeholder="Votre pseudo unique"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Continuer vers l'étape 2
                </button>

                <div className="text-center pt-2">
                  <p className="text-gray-600 text-sm">
                    Déjà un compte ?{" "}
                    <a
                      href="/login"
                      className="text-pink-600 hover:text-pink-800 font-semibold hover:underline transition-colors"
                    >
                      Connectez-vous
                    </a>
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={sendForm} className="flex flex-col space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <UserCircle size={16} className="text-pink-500" />
                      Prénom
                    </label>
                    <div className="relative group">
                      <UserCircle
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors"
                      />
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 placeholder-gray-400 group-hover:border-gray-300"
                        placeholder="Votre prénom"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Users size={16} className="text-pink-500" />
                      Nom
                    </label>
                    <div className="relative group">
                      <Users
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors"
                      />
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 placeholder-gray-400 group-hover:border-gray-300"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Key size={16} className="text-pink-500" />
                    Mot de passe
                  </label>
                  <div className="relative group">
                    <Key
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors"
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 placeholder-gray-400 group-hover:border-gray-300"
                      placeholder="••••••••••"
                    />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <span>🔒</span>
                    Au moins 8 caractères avec lettres et chiffres
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 border-2 border-pink-300 text-pink-600 rounded-xl font-semibold hover:bg-pink-50 hover:border-pink-400 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} />
                    Retour
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Inscription en cours...
                      </>
                    ) : (
                      <>
                        <Heart size={18} fill="currentColor" />
                        Créer mon compte
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer stylé */}
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

export default Register;
