// import { useParams } from 'react-router-dom';
// import { useAuth } from '../context/auth';
import { useState } from 'react';
import { Card, CardContent, CardTitle } from "../components/ui/card"
import { useEffect } from 'react';
import { XIcon } from 'lucide-react';


interface User{
  id: number;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  description: string;
  gender: string;
  birthDate: number;
  city: string;
  age: number;
  preference: string;
}


interface Geolocation {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  // const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Geolocation>({
    latitude: null,
    longitude: null,
    error: null,
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [profilePictureIndex, setProfilePictureIndex] = useState(0);
  
  
  const [images, setImages] = useState<File[]>([]);
  // const [preview, setPreview] = useState<string[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5001/api/user', {
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
  };
  const fetchLocation = async () => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({ ...prev, error: "La géolocalisation n'est pas supportée" }));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => {
        setLocation((prev) => ({ ...prev, error: error.message }));
      }
    );
    console.log("locacation = ", location);
  };
  fetchLocation();
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
        const response = await fetch('http://localhost:5001/api/updateUser', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Profil mis à jour avec succès !');
      }
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


    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   const files = e.target.files;
    //   if (!files) return;

    //   const fileList = Array.from(files);

    //   if (fileList.length > 5) {
    //     alert("Vous pouvez télécharger au maximum 5 images.");
    //     return;
    //   }
  
    //   setImages(fileList);
    //   setPreview(fileList.map((file) => URL.createObjectURL(file)));
    // };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      
      const fileList = Array.from(files);
      
      // Vérifier si l'ajout des nouvelles images dépasse la limite de 5
      if (imageUrls.length + fileList.length > 5) {
        alert("Vous ne pouvez pas avoir plus de 5 images au total.");
        return;
      }
      
      // Ajouter les nouvelles images à la liste existante
      setImages(prev => [...prev, ...fileList]);
      
      // Créer des URL pour la prévisualisation
      const newImageUrls = fileList.map(file => URL.createObjectURL(file));
      setImageUrls(prev => [...prev, ...newImageUrls]);
    };
  
    const handleRemoveImage = (index: number) => {
      // Supprimer l'image à l'index spécifié
      const newImageUrls = [...imageUrls];
      newImageUrls.splice(index, 1);
      setImageUrls(newImageUrls);
      
      // Ajuster l'index de l'image de profil si nécessaire
      if (profilePictureIndex >= newImageUrls.length) {
        setProfilePictureIndex(newImageUrls.length > 0 ? 0 : -1);
      } else if (profilePictureIndex === index && newImageUrls.length > 0) {
        setProfilePictureIndex(0);
      }
      
      // Supprimer également du tableau de fichiers si présent
      const newImages = [...images];
      if (index < newImages.length) {
        newImages.splice(index, 1);
        setImages(newImages);
      }
    };
  
    const handleSetProfilePicture = (index: number) => {
      setProfilePictureIndex(index);
    };
  
    // const handleUpload = async () => {
    //   const formData = new FormData();
    //   images.forEach((image) => formData.append("images", image));
  
    //   try {
    //     const token = localStorage.getItem("token");
    //     const response = await fetch("http://localhost:5001/api/upload", {
    //       headers: {
    //         'Authorization': `Bearer ${token}`,
    //     },
    //       method: "POST",
    //       body: formData,
    //     });
  

    //     console.log("Réponse brute:", response);
    //     const data = await response.json();
    //     console.log("Données reçues:", data);

    //     if (data.profil_pictures) {
    //       setUploadStatus("Images uploadées avec succès !");
    //       console.log("Images Cloudinary:", data.profile_pictures);
    //     } else {
    //       setUploadStatus("Erreur lors de l'upload.");
    //     }
    //   } catch (error) {
    //     console.error("Erreur lors de l'upload:", error);
    //     setUploadStatus("Erreur lors de l'upload.");
    //   }
    // };

    const handleUpload = async () => {
      const formData = new FormData();
      
      // Ajouter toutes les images au FormData
      images.forEach((image) => formData.append("images", image));
      
      // Ajouter l'index de l'image de profil
      formData.append("profilePictureIndex", profilePictureIndex.toString());
      
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5001/api/upload", {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          method: "POST",
          body: formData,
        });
        
        console.log("Réponse brute:", response);
        const data = await response.json();
        console.log("Données reçues:", data);
        
        if (data.success) {
          setUploadStatus("Images uploadées avec succès !");
          // Mettre à jour les URLs d'images si retournées par l'API
          if (data.imageUrls) {
            setImageUrls(data.imageUrls);
          }
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
          <label>username :</label>
          <input value={user.username || ''} onChange={(e) => setUser({ ...user, firstname: e.target.value })}/>
          <label>FirstName :</label>
          <input value={user.firstname || ''} onChange={(e) => setUser({ ...user, firstname: e.target.value })}/>
          <label>LastName :</label>
          <input value={user.lastname || ''}  onChange={(e) => setUser({ ...user, lastname: e.target.value })} />
          <label>email :</label>
          <input value={user.email || ''}  onChange={(e) => setUser({ ...user, email: e.target.value })} />
          <label>city :</label>
          <input value={user.city || ''}  onChange={(e) => setUser({ ...user, city: e.target.value })} />
          <label>age :</label>
          <input type="number" value={user.age}  onChange={(e) => setUser({ ...user, age: Number(e.target.value) })} />
          <label>preference :</label>
          <input value={user.preference || ''}  onChange={(e) => setUser({ ...user, lastname: e.target.value })} />
          <label>gender :</label>
          <input value={user.gender || ''}  onChange={(e) => setUser({ ...user, lastname: e.target.value })} />

          {/* <p className='value'>{user.description}</p> */}
          

          {/* <div className="p-4">
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
          </div> */}

          <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Photos ({imageUrls.length}/5)</h2>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          {imageUrls.map((url, index) => (
            <div 
              key={index} 
              className={`relative rounded-lg overflow-hidden h-48 ${profilePictureIndex === index ? 'ring-4 ring-blue-500' : ''}`}
            >
              <img 
                src={url} 
                alt={`Photo ${index + 1}`} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <button 
                  onClick={() => handleRemoveImage(index)} 
                  className="self-end bg-red-500 text-white p-1 rounded-full"
                >
                  <XIcon size={16} />
                </button>
                <button 
                  onClick={() => handleSetProfilePicture(index)}
                  className={`mt-auto w-full py-1 text-sm font-medium rounded ${
                    profilePictureIndex === index 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-blue-600'
                  }`}
                >
                  {profilePictureIndex === index ? 'Photo principale' : 'Définir comme principale'}
                </button>
              </div>
            </div>
          ))}
          
          {imageUrls.length < 5 && (
            <label className="flex items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="text-center">
                <div className="mt-2 text-sm text-gray-600">
                  Ajouter une photo
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
              </div>
            </label>
          )}
        </div>
        
        {images.length > 0 && (
          <button
            onClick={handleUpload}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Uploader les nouvelles images
          </button>
        )}
        
        {uploadStatus && (
          <p className="mt-2 text-green-600">{uploadStatus}</p>
        )}
      </div>



          <button className='text-white' onClick={handleUpdate}>Mettre à jour</button>
        </CardContent>
      </Card>
    );
  };
  
export default Profile;






// interface LocationInfo {
//   city: string | null;
//   country: string | null;
//   error: string | null;
// }

// const useReverseGeolocation = (latitude: number | null, longitude: number | null): LocationInfo => {
//   const [locationInfo, setLocationInfo] = useState<LocationInfo>({
//     city: null,
//     country: null,
//     error: null,
//   });

//   useEffect(() => {
//     if (!latitude || !longitude) return;

//     const fetchLocation = async () => {
//       try {
//         const res = await fetch(
//           `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//         );
//         const data = await res.json();

//         if (data.address) {
//           setLocationInfo({
//             city: data.address.city || data.address.town || data.address.village || "Inconnu",
//             country: data.address.country || "Inconnu",
//             error: null,
//           });
//         } else {
//           setLocationInfo((prev) => ({ ...prev, error: "Impossible de récupérer l'emplacement" }));
//         }
//       } catch (error) {
//         setLocationInfo((prev) => ({ ...prev, error: "Erreur lors de la récupération des données" }));
//       }
//     };

//     fetchLocation();
//   }, [latitude, longitude]);

//   return locationInfo;
// };



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
//         const response = await fetch('http://localhost:5001/api/user', {
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
//       const response = await fetch('http://localhost:5001/api/updateUser', {
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