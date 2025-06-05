import { useState, useEffect } from 'react';
import { useAuth } from "@/context/auth";
import { Heart, MapPin, Mail, User, Calendar, Edit3, Camera, X, Bell, Trash } from 'lucide-react';
import { Button, Badge, Avatar, Input, Select, Textarea, Card } from "@heroui/react";

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-purple-100 py-12 px-2">
      <Card className="max-w-3xl mx-auto overflow-hidden shadow-2xl rounded-3xl border-0">
        <div className="relative h-52 bg-gradient-to-r from-pink-400 via-pink-300 to-fuchsia-300">
          {imageUrls.length > 0 && profilePictureIndex >= 0 ? (
            <img 
              src={imageUrls[profilePictureIndex]} 
              alt="Couverture de profil" 
              className="w-full h-full object-cover opacity-40"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart size={64} className="text-white opacity-30" />
            </div>
          )}
          <div className="absolute right-6 top-6">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="solid"
              color="primary"
              className="bg-white bg-opacity-80 hover:bg-pink-100 text-pink-600 p-3 rounded-full shadow-lg border border-pink-200"
            >
              <Edit3 size={22} />
            </Button>
          </div>
        </div>
        <div className="pt-4 px-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-4">
            {/* Avatar à gauche */}
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <Avatar size="lg" className="w-28 h-28 border-4 border-white bg-gray-100 shadow-xl -mt-16 md:mt-0">
                {imageUrls.length > 0 && profilePictureIndex >= 0 ? (
                  <img 
                    src={profile_picture || imageUrls[profilePictureIndex]} 
                    alt="Photo de profil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-pink-400 mx-auto my-auto" />
                )}
              </Avatar>
            </div>
            {/* Infos à droite */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                  {user.firstname} {user.lastname}
                </h1>
                <span className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-0.5 rounded-full shadow-md align-middle">
                  {user.age} ans
                </span>
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-gray-600 text-sm font-medium">
                <div className="flex items-center gap-1">
                  <MapPin size={16} className="text-pink-500" />
                  <span>{user.city || "Ville non définie"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User size={16} className="text-pink-500" />
                  <span>{user.gender || "Non précisé"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart size={16} className="text-pink-500" fill="currentColor" />
                  <span>Intéressé(e) par : {user.preference || "Non précisé"}</span>
                </div>
              </div>
              <p className="text-gray-400 flex items-center mt-1 text-xs">
                <User size={14} className="mr-1" /> @{user.username}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-pink-100 mx-8" />
        <div className="px-8 py-8 border-t border-pink-100 bg-white bg-opacity-80 rounded-b-3xl">
          <div className="grid grid-cols-1 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-3 text-pink-700 flex items-center gap-2">
                <User size={20} className="text-pink-500" />
                À propos de moi
              </h2>
              {isEditing ? (
                <Textarea
                  value={user.description || ''}
                  onChange={(e) => setUser({ ...user, description: e.target.value })}
                  className="w-full p-4 border border-pink-200 rounded-2xl focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white bg-opacity-90 shadow text-left"
                  rows={4}
                  placeholder="Parlez de vous, vos passions, ce que vous recherchez..."
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap text-lg text-left">
                  {user.description || "Aucune description pour le moment."}
                </p>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4 text-pink-700 flex items-center">
                <Camera size={20} className="mr-2 text-pink-500" />
                Photos ({imageUrls.length}/5)
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className={`relative rounded-2xl overflow-hidden h-36 shadow-lg border-2 border-pink-100 ${profilePictureIndex === index ? 'ring-4 ring-pink-400' : ''} group`}
                  >
                    <img
                      src={url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      onClick={() => handleDeleteImage(index + 1)}
                      variant="solid"
                      color="primary"
                      className="absolute top-2 right-2 w-8 h-8 p-0 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-pink-100 text-pink-600 border border-pink-200 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Trash size={18} />
                    </Button>
                    {/* Bouton pour définir comme photo principale, sous la photo */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[90%] flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        onClick={() => handleSetProfilePicture(index)}
                        variant={profilePictureIndex === index ? 'solid' : 'bordered'}
                        color="primary"
                        size="sm"
                        className={`w-full text-xs font-semibold rounded-full shadow-sm py-1 px-2 bg-white/80 backdrop-blur border border-pink-200 ${profilePictureIndex === index ? 'bg-pink-500 text-white' : 'text-pink-600'} transition-all duration-200`}
                        style={{ fontSize: '0.85rem' }}
                      >
                        {profilePictureIndex === index ? 'Photo principale' : 'Définir comme principale'}
                      </Button>
                    </div>
                  </div>
                ))}
                {imageUrls.length < 5 && (
                  <label className="flex items-center justify-center h-36 border-2 border-dashed border-pink-200 rounded-2xl cursor-pointer hover:bg-pink-50 transition-colors duration-300">
                    <div className="text-center">
                      <Camera size={24} className="mx-auto text-pink-400" />
                      <div className="mt-2 text-sm text-pink-600">
                        Ajouter une photo
                      </div>
                      <Input
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
                <Button
                  onClick={handleUpload}
                  color="primary"
                  className="bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 text-white px-6 py-2 rounded-full shadow-lg font-bold"
                >
                  Uploader les nouvelles images
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;