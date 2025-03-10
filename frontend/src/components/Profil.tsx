// import { useParams } from 'react-router-dom';
// import { useAuth } from '../context/auth';
import { useState } from 'react';
import { Card, CardContent, CardTitle } from "./ui/card"
import { useEffect } from 'react';


interface User{
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  description: string;
  gender: number;
  preference: number;
  birthDate: number;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  // const [error, setError] = useState<string | null>(null);
  
  
  useEffect(() => {
    const fetchUserProfile = async () => {

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5000/api/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération du profil');
      }
      
      setUser(data.user);
    } catch (err) {
      console.error('Erreur:', err);

    }
  }
  fetchUserProfile();
  }, []);

    if (!user) {
      return <div>Aucune information utilisateur trouvée.</div>;
    }
  
    const handleUpdate = async () => {

      if (!user) {
        return;
      }

      const token = localStorage.getItem('token');
      try{
        const response = await fetch('http://localhost:5000/api/updateUser', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
      });

      const data = await response.json();

      if (!data)
        return ;

    } catch (error) {
      console.error(error);
    }
    if (!token) {
      window.location.href = '/login';
      return ;
    }
  }

  // const { username } = useParams<SearchParams>();
  // const { username } = useParams<{ username: string }>();

  // const { firstname } = useAuth();

  // const { ProfilData } = getProfile(username);

    return (
      <Card>
        <CardTitle><h1>Votre Profil</h1></CardTitle>
        <img></img>


          <span className="">Profil de {user.firstName} {user.lastName}</span>
        <CardContent className='flex flex-col space-y-4'>
          <h2>Description de {user.firstName}: </h2>
          <label>Description :</label>
          <input value={user.description || ''} onChange={(e) => setUser({ ...user, description: e.target.value })}/>
          <label>FirstName :</label>
          <input value={user.firstName || ''} onChange={(e) => setUser({ ...user, firstName: e.target.value })}/>
          <label>LastName :</label>
          <input value={user.lastName || ''}  onChange={(e) => setUser({ ...user, lastName: e.target.value })} />
          {/* <p className='value'>{user.description}</p> */}
          <button className='text-white' onClick={handleUpdate}>Mettre à jour</button>
        </CardContent>
      </Card>
    );
  };
  
export default Profile;


// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardTitle } from "./ui/card";

// interface User {
//   id: number;
//   email: string;
//   firstName: string;
//   lastName: string;
//   description: string;
//   gender: number;
//   preference: number;
// }

// const Profile = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         window.location.href = '/login';
//         return;
//       }

//       try {
//         const response = await fetch('http://localhost:5000/api/user', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.message || 'Erreur lors de la récupération du profil');
//         }

//         setUser(data.user);
//       } catch (err) {
//         console.error('Erreur:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, []);

//   const handleUpdate = async () => {
//     if (!user) return;

//     const token = localStorage.getItem('token');
//     try {
//       const response = await fetch('http://localhost:5000/api/updateUser', {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(user),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || 'Erreur lors de la mise à jour');
//       }

//       alert('Profil mis à jour avec succès !');
//       window.location.href = "/profil"; // Redirection après update
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour:', error);
//     }
//   };

//   if (loading) return <div>Chargement...</div>;
//   if (!user) return <div>Aucune information utilisateur trouvée.</div>;

//   return (
//     <Card>
//       <CardTitle><h1>Votre Profil</h1></CardTitle>
//       <CardContent>
//         <span>Profil de {user.firstName} {user.lastName}</span>

//         <label>Description :</label>
//         <input 
//           value={user.description || ''} 
//           onChange={(e) => setUser({ ...user, description: e.target.value })} 
//         />

//         <label>FirstName :</label>
//         <input 
//           value={user.firstName || ''} 
//           onChange={(e) => setUser({ ...user, firstName: e.target.value })} 
//         />

//         <label>LastName :</label>
//         <input 
//           value={user.lastName || ''} 
//           onChange={(e) => setUser({ ...user, lastName: e.target.value })} 
//         />

//         <button onClick={handleUpdate}>Mettre à jour</button>
//       </CardContent>
//     </Card>
//   );
// };

// export default Profile;