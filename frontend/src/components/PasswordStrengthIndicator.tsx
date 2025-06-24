import React, { useState, useEffect } from 'react';
import { validatePassword, calculatePasswordStrength } from '../utils/passwordValidation';

interface PasswordStrengthIndicatorProps {
  password: string;
  showDetails?: boolean;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  password, 
  showDetails = true 
}) => {
  const [validation, setValidation] = useState<{
    isValid: boolean;
    errors: string[];
    commonWords: string[];
  }>({ isValid: true, errors: [], commonWords: [] });
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (password) {
      const result = validatePassword(password);
      const strengthScore = calculatePasswordStrength(password);
      setValidation(result);
      setStrength(strengthScore);
    } else {
      setValidation({ isValid: true, errors: [], commonWords: [] });
      setStrength(0);
    }
  }, [password]);

  const getStrengthColor = (score: number) => {
    if (score < 30) return 'bg-red-500';
    if (score < 60) return 'bg-yellow-500';
    if (score < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number) => {
    if (score < 30) return 'Faible';
    if (score < 60) return 'Moyen';
    if (score < 80) return 'Fort';
    return 'Très fort';
  };

  if (!password) return null;

  return (
    <div className="mt-2">
      {/* Barre de progression de la force */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm text-gray-600 font-medium">Force:</span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength)}`}
            style={{ width: `${strength}%` }}
          />
        </div>
        <span className={`text-sm font-medium ${
          strength < 30 ? 'text-red-600' : 
          strength < 60 ? 'text-yellow-600' : 
          strength < 80 ? 'text-blue-600' : 'text-green-600'
        }`}>
          {getStrengthText(strength)}
        </span>
      </div>

      {/* Détails des erreurs */}
      {showDetails && validation.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm font-medium text-red-800 mb-1">
            Critères manquants :
          </p>
          <ul className="text-sm text-red-700 space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index} className="flex items-center gap-1">
                <span className="text-red-500">•</span>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Indication de mots communs détectés */}
      {showDetails && validation.commonWords.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-md p-3 mt-2">
          <p className="text-sm font-medium text-orange-800 mb-1">
            ⚠️ Mots communs détectés :
          </p>
          <p className="text-sm text-orange-700">
            Évitez d'utiliser des mots courants comme "{validation.commonWords.join('", "')}" 
            dans votre mot de passe.
          </p>
        </div>
      )}

      {/* Indication de mot de passe valide */}
      {showDetails && validation.isValid && password.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-2">
          <p className="text-sm font-medium text-green-800 flex items-center gap-1">
            ✓ Mot de passe valide
          </p>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
