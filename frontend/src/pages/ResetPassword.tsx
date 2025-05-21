import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
    <div className="reset-password-container">
      <h2>Réinitialisation du mot de passe</h2>
      
      {!success ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword">Nouveau mot de passe:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength={8}
              className="input-field"
              disabled={isLoading}
            />
            <small>8 caractères minimum</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmez le mot de passe:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
              className="input-field"
              disabled={isLoading}
            />
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <button 
            type="submit" 
            className="primary-button"
            disabled={isLoading}
          >
            {isLoading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
          </button>
        </form>
      ) : (
        <div className="success-message">
          <p>Votre mot de passe a été réinitialisé avec succès!</p>
          <p>Vous allez être redirigé vers la page de connexion...</p>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;