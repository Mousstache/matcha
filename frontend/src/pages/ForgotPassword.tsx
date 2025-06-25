import React, { useState } from "react";
import {
  Heart,
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ForgotPassword: React.FC = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5001/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const errorData = await res.json();
        setError(
          errorData.message ||
            "Une erreur est survenue lors de l'envoi de l'email."
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      setError("Erreur de connexion. Veuillez réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-purple-100 flex items-center justify-center p-4">
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
          {!submitted ? (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Mot de passe oublié ? 🔐
              </h2>
              <p className="text-gray-600">
                Pas de souci, on va retrouver votre accès !
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Email envoyé ! 📧
              </h2>
              <p className="text-gray-600">Vérifiez votre boîte de réception</p>
            </>
          )}
        </div>

        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl shadow-black/30 border-0 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100/20 to-gray-200/20 pointer-events-none"></div>

          <CardContent className="p-8 relative">
            {!submitted ? (
              <>
                {error && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-lg shadow-sm animate-in slide-in-from-top-1">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <AlertTriangle size={20} className="text-red-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-800 font-medium">
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Mail size={16} className="text-pink-500" />
                      Adresse email
                    </label>
                    <div className="relative group">
                      <input
                        type="email"
                        className="w-full px-4 py-3.5 pl-12 bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 placeholder-gray-400 group-hover:border-gray-400"
                        placeholder="votre.email@exemple.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Mail
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors"
                        size={18}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Nous vous enverrons un lien pour réinitialiser votre mot
                      de passe
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Envoi en cours...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Mail size={18} className="mr-2" />
                        Envoyer le lien de réinitialisation
                      </div>
                    )}

                    {/* Effet de brillance */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle size={32} className="text-white" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Email envoyé avec succès !
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Si votre adresse email existe dans notre base de données,
                    vous recevrez un lien de réinitialisation dans quelques
                    minutes.
                  </p>
                  <p className="text-gray-500 text-xs">
                    N'oubliez pas de vérifier vos spams ! 📬
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setEmail("");
                    setError("");
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Renvoyer un email
                </button>
              </div>
            )}

            {/* Lien de retour */}
            <div className="mt-8 text-center">
              <a
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-pink-600 hover:text-pink-800 font-medium hover:underline transition-colors"
              >
                <ArrowLeft size={16} />
                Retour à la connexion
              </a>
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

export default ForgotPassword;
