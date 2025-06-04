import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


const ConfirmEmail = () => {
  const [status, setStatus] = useState('loading');
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');
  const navigate = useNavigate();


  console.log("ICCCCCCCCCCCCCCCCCCCCCIIIIIIIIIIIIII", token);

  console.log('Tentative de confirmation avec token:', token);
  useEffect(() => {
    let called = false;

    const confirmEmailtoken = async () => {
      try {
        if (called) return;
        called = true;

        // const token_id = localStorage.getItem('token');
        console.log('here');


        const response = await fetch(`http://localhost:5001/api/confirm-email/${token}`, {
            method: 'GET',
            headers: {
              // 'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        })

        const data = await response.json();

        console.log(data);
        
        if (response.ok) {
          console.log('Confirmation réussie:', data);
          setStatus('success');
          navigate("/signup");
        } else {
          console.error('Erreur de confirmation:', data);
          setStatus('error');
        }
        
      } catch (error) {
        console.error('Erreur lors de la confirmation:', error);
        setStatus('error');
      }
    };

    if (token) {
      confirmEmailtoken();
    } else {
      setStatus('error');
      console.log('puree');
    }
  }, []);

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