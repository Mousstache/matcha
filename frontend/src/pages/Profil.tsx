import { useState, useEffect } from 'react';
import { useAuth } from "@/context/auth";
import { Card, CardContent, CardTitle } from "../components/ui/card";
import { XIcon, Camera, Heart, MapPin, Mail, User, Calendar, Edit3 } from 'lucide-react';

interface User {
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
  profile_picture: string | null;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const { id, profile_picture } = useAuth();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [profilePictureIndex, setProfilePictureIndex] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
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
        console.log("user", data.profile_picture);
      } catch (err) {
        console.error('Erreur:', err);
      }
    };

    const fetchimageUrls = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5001/api/user-images', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Erreur lors de la récupération des images');
        }
        
        setImageUrls(data.images.map((img: any) => img.image_url));

      } catch (err) {
        console.error('Erreur:', err);
      }
    };

    fetchimageUrls();
    fetchUserProfile();
  }, [id]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-pink-100 to-purple-100">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-pink-300 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-pink-300 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-pink-300 rounded"></div>
              <div className="h-4 bg-pink-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdate = async () => {
    if (!user) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5001/api/updateUser', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        setUploadStatus('Profil mis à jour avec succès !');
        setTimeout(() => setUploadStatus(null), 3000);
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
      setUploadStatus('Erreur lors de la mise à jour du profil');
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const fileList = Array.from(files);
    
    if (imageUrls.length + fileList.length > 5) {
      alert("Vous ne pouvez pas avoir plus de 5 images au total.");
      return;
    }
    
    setImages(prev => [...prev, ...fileList]);
    
    const newImageUrls = fileList.map(file => URL.createObjectURL(file));
    setImageUrls(prev => [...prev, ...newImageUrls]);
  };

  const handleRemoveImage = (index: number) => {
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);
    
    if (profilePictureIndex >= newImageUrls.length) {
      setProfilePictureIndex(newImageUrls.length > 0 ? 0 : -1);
    } else if (profilePictureIndex === index && newImageUrls.length > 0) {
      setProfilePictureIndex(0);
    }
    
    const newImages = [...images];
    if (index < newImages.length) {
      newImages.splice(index, 1);
      setImages(newImages);
    }
  };

  const handleSetProfilePicture = async (index: number) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5001/api/set-profile-picture", {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ position: index + 1 })
      });
      const data = await response.json();
      if (data.success) {
        setProfilePictureIndex(index);
        setUploadStatus("Photo principale mise à jour !");
        setTimeout(() => setUploadStatus(null), 3000);
      } else {
        setUploadStatus("Erreur lors du changement de photo principale.");
        setTimeout(() => setUploadStatus(null), 3000);
      }
    } catch (error) {
      setUploadStatus("Erreur lors du changement de photo principale.");
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));
    formData.append("profilePictureIndex", profilePictureIndex.toString());

    // LOG : ce que tu vas envoyer
    console.log("Images à uploader :", images);
    for (let pair of formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5001/api/upload", {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        method: "POST",
        body: formData,
      });

      // LOG : la réponse brute
      console.log("Réponse brute:", response);

      const data = await response.json();
      // LOG : le contenu de la réponse
      console.log("Données reçues:", data);

      if (data.success) {
        setUploadStatus("Images uploadées avec succès !");
        setTimeout(() => setUploadStatus(null), 3000);
        if (data.images) {
          setImageUrls(data.images.map((img: any) => img.image_url));
        }
        setImages([]);
      } else {
        setUploadStatus("Erreur lors de l'upload.");
        setTimeout(() => setUploadStatus(null), 3000);
      }
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      setUploadStatus("Erreur lors de l'upload.");
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  // Fonction pour supprimer une image côté backend
  const handleDeleteImage = async (position: number) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5001/api/delete-image/${position}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setImageUrls(data.images.map((img: any) => img.image_url));
        setUploadStatus("Image supprimée !");
        setTimeout(() => setUploadStatus(null), 3000);
      } else {
        setUploadStatus("Erreur lors de la suppression.");
        setTimeout(() => setUploadStatus(null), 3000);
      }
    } catch (error) {
      setUploadStatus("Erreur lors de la suppression.");
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-purple-100 py-8 px-4">
      <Card className="max-w-4xl mx-auto overflow-hidden shadow-xl rounded-xl">
        <div className="relative h-48 bg-gradient-to-r from-pink-500 to-purple-600">
          {imageUrls.length > 0 && profilePictureIndex >= 0 ? (
            <img 
              src={imageUrls[profilePictureIndex]} 
              alt="Couverture de profil" 
              className="w-full h-full object-cover opacity-50"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart size={64} className="text-white opacity-25" />
            </div>
          )}
          
          <div className="absolute left-8 -bottom-14">
            <div className="w-28 h-28 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
              {imageUrls.length > 0 && profilePictureIndex >= 0 ? (
                <img 
                  src={profile_picture} 
                  alt="Photo de profil" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-pink-100">
                  <User size={36} className="text-pink-500" />
                </div>
              )}
            </div>
          </div>
          
          <div className="absolute right-4 top-4">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white bg-opacity-80 hover:bg-opacity-100 text-pink-600 p-2 rounded-full shadow transition-all duration-300"
            >
              <Edit3 size={20} />
            </button>
          </div>
        </div>
        
        <div className="pt-16 px-8 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {user.firstname} {user.lastname}
              </h1>
              <p className="text-gray-500 flex items-center mt-1">
                <User size={16} className="mr-1" /> @{user.username}
              </p>
            </div>
            
            <div className="bg-pink-100 text-pink-800 px-4 py-2 rounded-full font-medium text-sm">
              {user.age} ans
            </div>
          </div>
          
          <div className="flex items-center mt-3 text-gray-600">
            <MapPin size={16} className="mr-1" /> 
            <span>{user.city || "Ville non définie"}</span>
            <span className="mx-2">•</span>
            <Heart size={16} className="mr-1" /> 
            <span>Intéressé(e) par: {user.preference || "Non précisé"}</span>
          </div>
        </div>

        <CardContent className="px-8 py-6 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <Camera size={20} className="mr-2 text-pink-600" /> 
                Photos ({imageUrls.length}/5)
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {imageUrls.map((url, index) => (
                  <div 
                    key={index} 
                    className={`relative rounded-lg overflow-hidden h-36 ${
                      profilePictureIndex === index ? 'ring-2 ring-pink-500' : ''
                    }`}
                  >
                    <img 
                      src={url} 
                      alt={`Photo ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <button 
                        onClick={() => handleDeleteImage(index + 1)} 
                        className="self-end bg-red-500 text-white p-1 rounded-full"
                      >
                        <XIcon size={16} />
                      </button>
                      <button 
                        onClick={() => handleSetProfilePicture(index)}
                        className={`mt-auto w-full py-1 text-xs font-medium rounded ${
                          profilePictureIndex === index 
                            ? 'bg-pink-600 text-white' 
                            : 'bg-white text-pink-600'
                        }`}
                      >
                        {profilePictureIndex === index ? 'Photo principale' : 'Définir comme principale'}
                      </button>
                    </div>
                  </div>
                ))}
                
                {imageUrls.length < 5 && (
                  <label className="flex items-center justify-center h-36 border-2 border-dashed border-pink-200 rounded-lg cursor-pointer hover:bg-pink-50 transition-colors duration-300">
                    <div className="text-center">
                      <Camera size={24} className="mx-auto text-pink-400" />
                      <div className="mt-2 text-sm text-pink-600">
                        Ajouter une photo
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        multiple
                        onChange={handleFileChange} 
                      />
                    </div>
                  </label>
                )}
              </div>
              
              {images.length > 0 && (
                <button
                  onClick={handleUpload}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg shadow transition-colors duration-300"
                >
                  Uploader les nouvelles images
                </button>
              )}
              
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">À propos de moi</h2>
                {isEditing ? (
                  <textarea
                    value={user.description || ''}
                    onChange={(e) => setUser({ ...user, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    rows={4}
                    placeholder="Parlez de vous, vos passions, ce que vous recherchez..."
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {user.description || "Aucune description pour le moment."}
                  </p>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Informations personnelles</h2>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Pseudonyme</label>
                        <input 
                          value={user.username || ''} 
                          onChange={(e) => setUser({ ...user, username: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Prénom</label>
                        <input 
                          value={user.firstname || ''} 
                          onChange={(e) => setUser({ ...user, firstname: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Nom</label>
                        <input 
                          value={user.lastname || ''}  
                          onChange={(e) => setUser({ ...user, lastname: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                        <input 
                          value={user.email || ''}  
                          onChange={(e) => setUser({ ...user, email: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Ville</label>
                        <input 
                          value={user.city || ''}  
                          onChange={(e) => setUser({ ...user, city: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Âge</label>
                        <input 
                          type="number" 
                          value={user.age}  
                          onChange={(e) => setUser({ ...user, age: Number(e.target.value) })}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Préférence</label>
                        <select
                          value={user.preference || ''}  
                          onChange={(e) => setUser({ ...user, preference: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                          <option value="">Sélectionnez une préférence</option>
                          <option value="Hommes">Hommes</option>
                          <option value="Femmes">Femmes</option>
                          <option value="Tous">Tous</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Genre</label>
                        <select
                          value={user.gender || ''}  
                          onChange={(e) => setUser({ ...user, gender: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                          <option value="">Sélectionnez votre genre</option>
                          <option value="Homme">Homme</option>
                          <option value="Femme">Femme</option>
                          <option value="Non-binaire">Non-binaire</option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Mail size={18} className="mr-2 text-pink-500 mt-1" />
                        <div>
                          <span className="text-sm text-gray-500">Email</span>
                          <p className="text-gray-800">{user.email}</p>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <MapPin size={18} className="mr-2 text-pink-500 mt-1" />
                        <div>
                          <span className="text-sm text-gray-500">Localisation</span>
                          <p className="text-gray-800">{user.city || "Non précisée"}</p>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <Calendar size={18} className="mr-2 text-pink-500 mt-1" />
                        <div>
                          <span className="text-sm text-gray-500">Âge</span>
                          <p className="text-gray-800">{user.age} ans</p>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <User size={18} className="mr-2 text-pink-500 mt-1" />
                        <div>
                          <span className="text-sm text-gray-500">Genre</span>
                          <p className="text-gray-800">{user.gender || "Non précisé"}</p>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <Heart size={18} className="mr-2 text-pink-500 mt-1" />
                        <div>
                          <span className="text-sm text-gray-500">Intéressé(e) par</span>
                          <p className="text-gray-800">{user.preference || "Non précisé"}</p>
                        </div>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {isEditing && (
            <div className="mt-8 flex justify-end space-x-3">
              <button 
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors duration-300"
              >
                Annuler
              </button>
              <button 
                onClick={handleUpdate}
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg shadow transition-colors duration-300"
              >
                Enregistrer
              </button>
            </div>
          )}
          
          {uploadStatus && (
            <div className={`mt-4 p-3 rounded-lg ${
              uploadStatus.includes('succès') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {uploadStatus}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;