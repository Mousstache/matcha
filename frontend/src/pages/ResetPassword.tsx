import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, Heart } from 'lucide-react';


interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromUrl = new URLSearchParams(location.search).get('token');
    setToken(tokenFromUrl);
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }
    
    if (!token) {
      setError('Token manquant');
      setIsLoading(false);
      return;
    }
    
    try {
      const res = await fetch('http://localhost:5001/api/reset-password',{
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token,
        newPassword: formData.newPassword
      }),
      });
      if (!res)
        return ;
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }catch (error){
      console.error(error);
    }
  };

  if (!token) {
    return (
      <div className="reset-password-container error-container">
        <h2>Erreur</h2>
        <p>Token manquant. Veuillez utiliser le lien envoyé par email.</p>
        <button 
          onClick={() => navigate('/forgot-password')}
          className="primary-button"
        >
          Demander un nouveau lien
        </button>
      </div>
    );
  }

  return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-pink-100 p-3 rounded-full">
              <Lock className="text-pink-500" size={24} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Nouveau mot de passe</h2>
          <p className="text-gray-600">Choisissez un mot de passe sécurisé pour protéger votre cœur 💖</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Nouveau mot de passe */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={"password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                minLength={8}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                placeholder="Minimum 8 caractères"
              />
            </div>
          </div>

          {/* Confirmation mot de passe */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmez le mot de passe
            </label>
            <div className="relative">
              <input
                type={"password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                placeholder="Répétez votre mot de passe"
              />
            </div>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Bouton submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Réinitialisation en cours...
              </>
            ) : (
              <>
                <Heart size={18} />
                Réinitialiser le mot de passe
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Vous vous souvenez de votre mot de passe ?{' '}
            <button 
              onClick={() => window.location.href = '/login'}
              className="text-pink-500 hover:text-pink-600 font-medium"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
  //   <div className="reset-password-container">
  //     <h2>Réinitialisation du mot de passe</h2>
      
  //     {!success ? (
  //       <form onSubmit={handleSubmit}>
  //         <div className="form-group">
  //           <label htmlFor="newPassword">Nouveau mot de passe:</label>
  //           <input
  //             type="password"
  //             id="newPassword"
  //             name="newPassword"
  //             value={formData.newPassword}
  //             onChange={handleChange}
  //             required
  //             minLength={8}
  //             className="input-field"
  //             disabled={isLoading}
  //           />
  //           <small>8 caractères minimum</small>
  //         </div>
          
  //         <div className="form-group">
  //           <label htmlFor="confirmPassword">Confirmez le mot de passe:</label>
  //           <input
  //             type="password"
  //             id="confirmPassword"
  //             name="confirmPassword"
  //             value={formData.confirmPassword}
  //             onChange={handleChange}
  //             required
  //             minLength={8}
  //             className="input-field"
  //             disabled={isLoading}
  //           />
  //         </div>
          
  //         {error && <p className="error-message">{error}</p>}
          
  //         <button 
  //           type="submit" 
  //           className="primary-button"
  //           disabled={isLoading}
  //         >
  //           {isLoading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
  //         </button>
  //       </form>
  //     ) : (
  //       <div className="success-message">
  //         <p>Votre mot de passe a été réinitialisé avec succès!</p>
  //         <p>Vous allez être redirigé vers la page de connexion...</p>
  //       </div>
  //     )}
  //   </div>
  // );
};

export default ResetPassword;