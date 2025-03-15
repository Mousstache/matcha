// import { useParams } from 'react-router-dom';
// import { useAuth } from '../context/auth';
import { useState } from 'react';
import { Card, CardContent, CardTitle } from "./ui/card"
import { useEffect } from 'react';


interface User{
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  description: string;
  gender: number;
  preference: number;
  birthDate: number;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  // const [error, setError] = useState<string | null>(null);
  
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  
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



  // const UploadProfilePictures: React.FC = () => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const fileList = Array.from(files);

      if (fileList.length > 5) {
        alert("Vous pouvez télécharger au maximum 5 images.");
        return;
      }
  
      setImages(fileList);
      setPreview(fileList.map((file) => URL.createObjectURL(file)));
    };
  
    const handleUpload = async () => {
      const formData = new FormData();
      images.forEach((image) => formData.append("images", image));
  
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/upload", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
          method: "POST",
          body: formData,
        });
  

        console.log("Réponse brute:", response);
        const data = await response.json();
        console.log("Données reçues:", data);

        if (data.images) {
          setUploadStatus("Images uploadées avec succès !");
          console.log("Images Cloudinary:", data.images);
        } else {
          setUploadStatus("Erreur lors de l'upload.");
        }
      } catch (error) {
        console.error("Erreur lors de l'upload:", error);
        setUploadStatus("Erreur lors de l'upload.");
      }
    };

    return (
      <Card>
        <CardTitle><h1>Votre Profil</h1></CardTitle>
        <img></img>


          <span className="">Profil de {user.firstname} {user.lastname}</span>
         <CardContent className='flex flex-col space-y-4'>
          <h2>Description de {user.firstname}: </h2>
          <label>Description :</label>
          <input value={user.description || ''} onChange={(e) => setUser({ ...user, description: e.target.value })}/>
          <label>FirstName :</label>
          <input value={user.firstname || ''} onChange={(e) => setUser({ ...user, firstname: e.target.value })}/>
          <label>LastName :</label>
          <input value={user.lastname || ''}  onChange={(e) => setUser({ ...user, lastname: e.target.value })} />
          {/* <p className='value'>{user.description}</p> */}
          

          <div className="p-4">
            <input type="file" multiple accept="image/*" onChange={handleFileChange} />
            <div className="flex space-x-2 mt-2">
              {preview.map((src, index) => (
                <img key={index} src={src} alt="preview" className="w-20 h-20 rounded-lg" />
              ))}
            </div>
            <button 
              onClick={handleUpload} 
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Uploader
            </button>
            {uploadStatus && <p className="mt-2 text-green-600">{uploadStatus}</p>}
          </div>



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