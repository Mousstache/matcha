import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({ email: '' });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
     const res = await fetch('http://localhost:5001/api/forgot-password',{
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: formData.email }),
      });
      if (!res)
        return ;
    }catch (error){
      console.error(error);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Mot de passe oublié</h2>
      
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
              disabled={isLoading}
            />
          </div>
          
          {error && <p className="error-message">{error}</p>}
          
          <div className="button-group">
            <button 
              type="submit" 
              className="primary-button"
              disabled={isLoading}
            >
              {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
            </button>
            
            <button 
              type="button" 
              onClick={() => navigate('/login')}
              className="secondary-button"
              disabled={isLoading}
            >
              Retour à la connexion
            </button>
          </div>
        </form>
      ) : (
        <div className="success-message">
          <p>Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.</p>
          <p>Veuillez vérifier votre boîte de réception et vos spams.</p>
          <button 
            onClick={() => navigate('/login')}
            className="primary-button"
          >
            Retour à la connexion
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;