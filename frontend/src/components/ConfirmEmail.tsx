import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ConfirmEmail = () => {
  const [status, setStatus] = useState('loading');
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    const confirmEmail = async () => {
      try {

        const token_id = localStorage.getItem('token');

        await fetch('http://localhost:5000/api/confirm-email', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token_id}`,
              'Content-Type': 'application/json'
            }
        })
      } catch (error) {
        console.error('Erreur lors de la confirmation:', error);
        setStatus('error');
      }
    };

    if (token) {
      confirmEmail();
    } else {
      setStatus('error');
    }
  }, [token]);

  return (
    <div>
      {status === 'loading' && <p>Confirmation en cours...</p>}
      {status === 'success' && (
        <div>
          <h2>Email confirmé avec succès!</h2>
          <p>Vous pouvez maintenant vous connecter à votre compte.</p>
        </div>
      )}
      {status === 'error' && (
        <div>
          <h2>Erreur de confirmation</h2>
          <p>Le lien de confirmation est invalide ou a expiré.</p>
        </div>
      )}
    </div>
  );
};

export default ConfirmEmail;