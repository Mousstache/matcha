import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Mail, ArrowLeft } from 'lucide-react';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({ email: '' });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState('');
  
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
     <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <div className="text-center mb-6">
          <Heart className="mx-auto text-pink-500 mb-2" size={32} />
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Mot de passe oublié</h2>
          <p className="text-gray-600 text-sm">On va retrouver votre accès !</p>
        </div>

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
            <p className="text-red-500 text-sm text-center">{error}</p>
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
              <ArrowLeft size={16} />
              Retour à la connexion
            </button>
          </div>
        </div>
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