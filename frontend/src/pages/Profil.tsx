import { useState, useEffect } from 'react';
import { useAuth } from "@/context/auth";
import { Heart, MapPin, User, Edit3, Camera, Trash } from 'lucide-react';
import { Button, Avatar, Input, Textarea, Card } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { Select, SelectItem } from "@heroui/select";

// import { MultiSelect } from "@heroui/multiselect";

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
  country: string;
  latitude: number;
  longitude: number;
  age: number;
  preference: string;
  profile_picture: string | null;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const { id, profile_picture, setProfilePicture } = useAuth();
  const { refreshUser } = useAuth();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [profilePictureIndex, setProfilePictureIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await fetch('http://localhost:5001/api/user', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
        } else {
          console.error('Erreur lors de la récupération du profil', data.message);
        }
      } catch (err) {
        console.error('Erreur fetchUserProfile:', err);
      }
    };

    const fetchImageUrls = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await fetch('http://localhost:5001/api/user-images', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (response.ok && data.images) {
          const imagesWithPosition = data.images as { image_url: string, position: number }[];

          const sortedImages = [...imagesWithPosition].sort((a, b) => {
            if (profile_picture && a.image_url === profile_picture) return -1;
            if (profile_picture && b.image_url === profile_picture) return 1;
            return a.position - b.position;
          });

          setImageUrls(sortedImages.map(img => img.image_url));

          const currentProfileIndex = sortedImages.findIndex(img => profile_picture && img.image_url === profile_picture);
          setProfilePictureIndex(currentProfileIndex !== -1 ? currentProfileIndex : 0);
        } else {
          console.error('Erreur lors de la récupération des images', data.error);
          setImageUrls([]);
        }
      } catch (err) {
        console.error('Erreur fetchImageUrls:', err);
        setImageUrls([]);
      }
    };

    fetchImageUrls();
    fetchUserProfile();
    // if (!isEditing) {
    //   fetchLatLng();
    // }
    // fetchLatLng();
  }, [id, profile_picture]);

  useEffect(() => {
    const fetchLatLng = async () => {
      if (user?.city && user?.country && !isEditing) {
        const query = encodeURIComponent(`${user.city}, ${user.country}`);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
        try {
          const res = await fetch(url, { headers: { 'Accept-Language': 'fr' } });
          const data = await res.json();
          if (data && data.length > 0) {
            setUser(u => u ? ({
              ...u,
              latitude: parseFloat(data[0].lat),
              longitude: parseFloat(data[0].lon)
            }) : u);
          }
        } catch (err) {
          // Optionnel: gérer l'erreur
        }
      }
    };

    // Délai pour éviter trop d'appels API
    const timeoutId = setTimeout(() => {
      fetchLatLng();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [user?.city, user?.country, isEditing]);

  useEffect(() => {
  // Exemple statique, tu peux remplacer par une API si besoin
  setCountries([
    "France", "Belgique", "Suisse", "Canada", "Maroc", "Algérie", "Tunisie"
  ]);
}, []);

  useEffect(() => {
  if (user?.country === "France") {
    setCities(["Paris", "Lyon", "Marseille", "Toulouse", "Nice"]);
  } else if (user?.country === "Belgique") {
    setCities(["Bruxelles", "Anvers", "Liège"]);
  } else if (user?.country === "Suisse") {
    setCities(["Genève", "Zurich", "Lausanne"]);
  } else {
    setCities([]);
  }
}, [user?.country]);

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

//   const refreshUser = async () => {
//   const token = localStorage.getItem('token');
//   if (!token) return;
//   const response = await fetch('http://localhost:5001/api/user', {
//     headers: { 'Authorization': `Bearer ${token}` }
//   });
//   const data = await response.json();
//   if (response.ok) {
//     setUser(data.user);
//   }
// };


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
        body: JSON.stringify({
          description: user.description,
          gender : user.gender,
          age : user.age,
          city: user.city,
          preference: user.preference,
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          latitude: user.latitude,
          longitude: user.longitude,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addToast({
          title: 'Succès',
          description: 'Profil mis à jour avec succès !',
          color: 'success'
        });
        setIsEditing(false);
        await refreshUser();
      } else {
        console.error("Erreur API updateUser:", data.message);
        addToast({
          title: 'Erreur',
          description: data.message || 'Erreur lors de la mise à jour du profil',
          color: 'danger'
        });
      }
    } catch (error) {
      console.error("Erreur fetch updateUser:", error);
      addToast({
        title: 'Erreur',
        description: 'Erreur lors de la mise à jour du profil',
        color: 'danger'
      });
    }
  };

  const handleUpload = async (filesToUpload: File[]) => {
    if (filesToUpload.length === 0) {
      addToast({
         title: 'Information',
         description: "Aucune image à uploader.",
         color: 'default'
      });
      return;
    }

    const formData = new FormData();
    filesToUpload.forEach((image) => formData.append("images", image));

    const token = localStorage.getItem("token");
    if (!token) {
        addToast({
            title: 'Erreur',
            description: 'Authentification requise pour uploader.',
            color: 'danger'
        });
        return;
    }

    const currentProfileImgUrl = profile_picture;
    const existingProfileIndexInCurrentUrls = imageUrls.findIndex(url => url === currentProfileImgUrl);
    const profileIndexToSend = existingProfileIndexInCurrentUrls !== -1 ? existingProfileIndexInCurrentUrls : 0;
    formData.append("profilePictureIndex", profileIndexToSend.toString());
    console.log("Uploading avec profilePictureIndex:", profileIndexToSend);

    const uploadPromise = fetch("http://localhost:5001/api/upload", {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method: "POST",
      body: formData,
    }).then(response => response.json());

    uploadPromise.then(data => {
      if (data.success) {
        if (data.images) {
          const imagesWithPosition = data.images as { image_url: string, position: number }[];
          setImageUrls(imagesWithPosition.map(img => img.image_url));
        }
         if (data.profilePicture !== undefined) {
             setProfilePicture(data.profilePicture);
             setUser(prev => prev ? ({ ...prev, profile_picture: data.profilePicture }) : null);
         }
         addToast({
           title: 'Succès',
           description: 'Photos ajoutées avec succès !',
           color: 'success'
         });
      } else {
        console.error("Erreur API upload:", data.error);
      }
    }).catch(error => {
        console.error("Erreur fetch upload:", error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const fileList = Array.from(files);
    
    if (imageUrls.length + fileList.length > 5) {
      addToast({
         title: 'Erreur',
         description: `Vous ne pouvez pas avoir plus de 5 images au total (actuellement ${imageUrls.length}).`,
         color: 'danger'
      });
      return;
    }
    
    handleUpload(fileList);
  };

  const handleRemoveImage = async (index: number) => {
     const token = localStorage.getItem("token");
     if (!token) {
         addToast({
             title: 'Erreur',
             description: 'Authentification requise pour supprimer.',
             color: 'danger'
         });
         return;
     }

     try {
        const imagesResponse = await fetch('http://localhost:5001/api/user-images', {
           headers: { 'Authorization': `Bearer ${token}` }
        });
        const imagesData = await imagesResponse.json();
        if (!imagesResponse.ok || !imagesData.images) {
           throw new Error(imagesData.error || 'Erreur lors de la récupération des images pour suppression');
        }

        const imageUrlToRemove = imageUrls[index];
        const imageToDelete = imagesData.images.find((img: any) => img.image_url === imageUrlToRemove);

        if (!imageToDelete) {
           addToast({
              title: 'Erreur',
              description: "Image non trouvée.",
              color: 'danger'
           });
           return;
        }

        const positionToDelete = imageToDelete.position;
        console.log(`Suppression de l'image à la position DB: ${positionToDelete}`);

        const deletePromise = fetch(`http://localhost:5001/api/delete-image/${positionToDelete}`, {
          method: "DELETE",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(response => response.json());

        deletePromise.then(data => {
           if(data.success) {
              if (data.images) {
                 setImageUrls(data.images.map((img: any) => img.image_url));
              }
              if (data.profilePicture !== undefined) {
                 setProfilePicture(data.profilePicture);
                 setUser(prev => prev ? ({ ...prev, profile_picture: data.profilePicture }) : null);
              }
              addToast({
                title: 'Succès',
                description: 'Photo supprimée avec succès !',
                color: 'success'
              });
           } else {
              console.error("Erreur API delete-image:", data.error);
           }
        }).catch(error => {
           console.error("Erreur fetch delete-image:", error);
        });

     } catch (error: any) {
        console.error("Erreur lors de la suppression de l'image :", error);
         addToast({
            title: 'Erreur',
            description: error.message || "Erreur lors de la suppression de l'image.",
            color: 'danger'
         });
     }
  };

  const handleSetProfilePicture = async (index: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
        addToast({
            title: 'Erreur',
            description: 'Authentification requise pour changer la photo principale.',
            color: 'danger'
        });
        return;
    }

    try {
       const imagesResponse = await fetch('http://localhost:5001/api/user-images', {
          headers: { 'Authorization': `Bearer ${token}` }
       });
       const imagesData = await imagesResponse.json();
       if (!imagesResponse.ok || !imagesData.images) {
          throw new Error(imagesData.error || 'Erreur lors de la récupération des images pour définir la photo principale');
       }

       const imageUrlToSet = imageUrls[index];
       const imageToSetAsProfile = imagesData.images.find((img: any) => img.image_url === imageUrlToSet);

       if (!imageToSetAsProfile) {
          addToast({
             title: 'Erreur',
             description: "Image non trouvée pour définir comme principale.",
             color: 'danger'
          });
          return;
       }

       const positionToSet = imageToSetAsProfile.position;
       console.log(`Tente de définir la photo à la position DB ${positionToSet} comme principale`);

       const setProfilePromise = fetch("http://localhost:5001/api/set-profile-picture", {
         method: "PUT",
         headers: {
           'Authorization': `Bearer ${token}`,
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({ position: positionToSet })
       }).then(response => response.json());

       setProfilePromise.then(data => {
          if (data.success) {
            setProfilePicture(data.profilePicture);
            setUser(prev => prev ? ({ ...prev, profile_picture: data.profilePicture }) : null);
            addToast({
              title: 'Succès',
              description: 'Photo principale mise à jour avec succès !',
              color: 'success'
            });
          } else {
            console.error("Erreur API set-profile-picture:", data.error);
          }
       }).catch(error => {
          console.error("Erreur fetch set-profile-picture:", error);
       });

     } catch (error: any) {
       console.error("Erreur lors du changement de photo principale :", error);
        addToast({
           title: 'Erreur',
           description: error.message || "Erreur lors du changement de photo principale.",
           color: 'danger'
        });
     }
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 via-fuchsia-50 to-purple-100 py-9 px-2">
      <Card className="max-w-3xl mx-auto overflow-hidden shadow-2xl rounded-3xl border-0">
        <div className="relative h-52 bg-gradient-to-r from-pink-400 via-pink-300 to-fuchsia-300">
          {profile_picture ? (
            <img 
              src={profile_picture}
              alt="Couverture de profil" 
              className="w-full h-full object-cover opacity-40"
            />
          ) : imageUrls.length > 0 && profilePictureIndex >= 0 ? (
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
        </div>
        <div className="pt-4 px-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-4">
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <Avatar size="lg" className="w-28 h-28 border-4 border-white bg-gray-100 shadow-xl -mt-16 md:mt-0">
                {profile_picture ? (
                  <img 
                    src={profile_picture}
                    alt="Photo de profil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-pink-400 mx-auto my-auto" />
                )}
              </Avatar>
            </div>
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
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-pink-700 flex items-center gap-2">
                  <User size={20} className="text-pink-500" />
                  À propos de moi
                </h2>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="solid"
                  color="primary"
                  size="sm"
                  className="bg-white hover:bg-pink-50 text-pink-600 p-2 rounded-full shadow-md border border-pink-200 active:bg-pink-100 active:scale-95 transition-all duration-200"
                >
                  <Edit3 size={18} />
                </Button>
              </div>
                {isEditing && (
                <div className="bg-white rounded-2xl shadow-md p-6 border border-pink-100 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Informations personnelles */}
      <div className="space-y-4 md:col-span-2">
        <h3 className="text-lg font-semibold text-pink-700 mb-2 flex items-center">
          <User size={16} className="mr-2" /> 
          Informations personnelles
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <Input
              value={user.firstname || ''}
              onChange={(e) => setUser({ ...user, firstname: e.target.value })}
              className="w-full"
              placeholder="Votre prénom"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <Input
              value={user.lastname || ''}
              onChange={(e) => setUser({ ...user, lastname: e.target.value })}
              className="w-full"
              placeholder="Votre nom"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Pseudo</label>
            <Input
              value={user.username || ''}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="w-full"
              placeholder="Votre pseudo"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Âge</label>
            <Input
              type="number"
              value={user.age || ''}
              onChange={(e) => setUser({ ...user, age: parseInt(e.target.value) })}
              className="w-full"
              placeholder="Votre âge"
            />
          </div>
        </div>
      </div>
      
      {/* Localisation */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-pink-700 mb-2 flex items-center">
          <MapPin size={16} className="mr-2" />
          Localisation
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
            <select
              value={user.country || ""}
              onChange={e => {
                const newCountry = e.target.value;
                let newCity = user.city;
                if (!cities.includes(user.city)) {
                  newCity = "";
                }
                setUser({ ...user, country: newCountry, city: newCity });
              }}
              className="w-full px-4 py-3 border border-pink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50/30"
            >
              <option value="" disabled>Sélectionnez votre pays</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
            <select
              value={user.city || ""}
              onChange={e => setUser({ ...user, city: e.target.value })}
              className="w-full px-4 py-3 border border-pink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50/30"
              disabled={!user.country}
            >
              <option value="" disabled>Sélectionnez votre ville</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Préférences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-pink-700 mb-2 flex items-center">
          <Heart size={16} className="mr-2" />
          Préférences
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
            <select 
              value={user.gender || ""}
              onChange={(e) => setUser({ ...user, gender: e.target.value })}
              className="w-full px-4 py-3 border border-pink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50/30"
            >
              <option value="" disabled>Sélectionnez votre genre</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
              <option value="Non binaire">Non binaire</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Intéressé(e) par</label>
            <select 
              value={user.preference || ""} 
              onChange={(e) => setUser({ ...user, preference: e.target.value })}
              className="w-full px-4 py-3 border border-pink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50/30"
            >
              <option value="" disabled>Qui vous intéresse ?</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
              <option value="Les deux">Les deux</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <div className="space-y-3 md:col-span-2">
        <h3 className="text-lg font-semibold text-pink-700 mb-2">À propos de moi</h3>
        <Textarea
          value={user.description || ''}
          onChange={(e) => setUser({ ...user, description: e.target.value })}
          className="w-full p-4 border border-pink-200 rounded-2xl min-h-[120px]"
          placeholder="Parlez de vous, de vos passions, de ce qui vous rend unique..."
        />
      </div>
    </div>
    
    {/* Boutons d'actions */}
    <div className="flex justify-end gap-2 pt-4 border-t border-pink-100">
      <Button 
        onClick={() => setIsEditing(false)} 
        variant="bordered" 
        className="border-pink-300 text-pink-600 hover:bg-pink-50"
      >
        Annuler
      </Button>
      <Button 
        onClick={handleUpdate} 
        variant="solid" 
        className="bg-pink-500 hover:bg-pink-600 text-white"
      >
        Enregistrer les modifications
      </Button>
    </div>
  </div>
)}

{!isEditing && (
  <div className="bg-white/90 rounded-xl p-5 shadow-sm border border-pink-100">
    <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
      {user.description || "Aucune description pour le moment."}
    </p>
  </div>
)}
                 {/* : (
                 <p className="text-gray-700 whitespace-pre-wrap text-lg text-left">
                   {user.description || "Aucune description pour le moment."}
                 </p>
                 ) */}
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
                    className={`relative rounded-2xl overflow-hidden h-36 shadow-lg border-2 border-pink-100 ${profile_picture === url ? 'ring-4 ring-pink-400' : ''} group`}
                  >
                    <img
                      src={url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      onClick={() => handleRemoveImage(index)}
                      variant="solid"
                      color="primary"
                      className="absolute top-2 right-2 w-8 h-8 p-0 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-pink-50 text-pink-600 border border-pink-200 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 active:bg-pink-100 active:scale-95"
                    >
                      <Trash size={18} />
                    </Button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[90%] flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        onClick={() => profile_picture !== url && handleSetProfilePicture(index)}
                        variant={profile_picture === url ? 'solid' : 'bordered'}
                        color="primary"
                        size="sm"
                        className={`w-full text-xs font-semibold rounded-full shadow-sm py-1 px-2 bg-white/80 backdrop-blur border border-pink-200 transition-all duration-200
                          ${profile_picture === url 
                            ? 'bg-pink-500 text-white cursor-not-allowed' 
                            : 'text-pink-600 hover:bg-pink-50 active:bg-pink-100 active:scale-95'}`}
                        style={{ fontSize: '0.85rem' }}
                        disabled={profile_picture === url}
                      >
                        {profile_picture === url ? 'Photo principale' : 'Définir comme principale'}
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
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;