import React from "react";
import { AlertTriangle } from "lucide-react";

interface SessionExpiredProps {
  message?: string;
  onRetry?: () => void;
}

const SessionExpired: React.FC<SessionExpiredProps> = ({
  message = "Votre session a expiré ou est invalide. Veuillez vous reconnecter.",
  onRetry,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md bg-white rounded-xl shadow-lg p-8">
        {/* Icône d'alerte */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        {/* Titre */}
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Session expirée
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-8">{message}</p>

        {/* Boutons */}
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-colors"
          >
            Se reconnecter
          </a>
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-200 transition-colors"
            >
              Réessayer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionExpired;
