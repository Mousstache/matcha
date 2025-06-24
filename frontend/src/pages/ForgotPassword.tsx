import React, { useState } from 'react';
import { HeartIcon, EnvelopeOpenIcon, ArrowLeftIcon } from '@radix-ui/react-icons';

const ForgotPassword: React.FC = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const res = await fetch('http://localhost:5001/api/forgot-password', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email }),
      });
      
      if (res.ok) {
        setSubmitted(true);
        setSuccessMessage('Un email de réinitialisation a été envoyé à votre adresse si elle existe dans notre base de données.');
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Une erreur est survenue lors de l\'envoi de l\'email.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      setError('Erreur de connexion. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <HeartIcon className="mx-auto text-pink-500 mb-2" width={32} height={32} />
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Mot de passe oublié</h2>
          <p className="text-gray-600 text-sm">On va retrouver votre accès !</p>
        </div>

        {!submitted ? (
          <div className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Votre adresse email"
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={handleSubmit}
                disabled={isLoading || !email}
                className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Envoi...' : 'Envoyer le lien'}
              </button>
              
              <button
                onClick={() => window.location.href = '/login'}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 text-gray-600 py-2 hover:text-gray-800 disabled:opacity-50 transition-colors"
              >
                <ArrowLeftIcon width={16} height={16} />
                Retour à la connexion
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <EnvelopeOpenIcon className="text-green-500 mr-2" width={24} height={24} />
                <h3 className="font-semibold">Email envoyé !</h3>
              </div>
              <p className="text-sm mb-2">{successMessage}</p>
              <p className="text-sm text-green-600">
                📧 Vérifiez votre boîte de réception et vos spams
              </p>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors"
              >
                Retour à la connexion
              </button>
              
              <button
                onClick={() => {
                  setSubmitted(false);
                  setEmail('');
                  setSuccessMessage('');
                  setError('');
                }}
                className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors"
              >
                Renvoyer un email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  //   <div className="forgot-password-container">
  //     <h2>Mot de passe oublié</h2>
      
  //     {!submitted ? (
  //       <form onSubmit={handleSubmit}>
  //         <div className="form-group">
  //           <label htmlFor="email">Email:</label>
  //           <input
  //             type="email"
  //             id="email"
  //             name="email"
  //             value={formData.email}
  //             onChange={handleChange}
  //             required
  //             className="input-field"
  //             disabled={isLoading}
  //           />
  //         </div>
          
  //         {error && <p className="error-message">{error}</p>}
          
  //         <div className="button-group">
  //           <button 
  //             type="submit" 
  //             className="primary-button"
  //             disabled={isLoading}
  //           >
  //             {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
  //           </button>
            
  //           <button 
  //             type="button" 
  //             onClick={() => navigate('/login')}
  //             className="secondary-button"
  //             disabled={isLoading}
  //           >
  //             Retour à la connexion
  //           </button>
  //         </div>
  //       </form>
  //     ) : (
  //       <div className="success-message">
  //         <p>Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.</p>
  //         <p>Veuillez vérifier votre boîte de réception et vos spams.</p>
  //         <button 
  //           onClick={() => navigate('/login')}
  //           className="primary-button"
  //         >
  //           Retour à la connexion
  //         </button>
  //       </div>
  //     )}
  //   </div>
  // );
};

export default ForgotPassword;