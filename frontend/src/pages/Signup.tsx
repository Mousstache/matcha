//import { Calendar } from "lucide-react";
import { Card, CardContent, CardTitle, CardFooter } from "../components/ui/card"
import { useState, useEffect } from "react";
import useGeolocation from "../hooks/useGeolocation";
import useReverseGeolocation from "../hooks/useReverseGeolocation";
import { useNavigate } from "react-router-dom";
import { XIcon, Camera, Info, MapPin, Heart, Check, X, Upload } from 'lucide-react';
import { addToast } from "@heroui/toast";
import { useAuth } from "@/context/auth";
import { Button, Input } from "@heroui/react";
import { User, Trash } from 'lucide-react';






//import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import { format } from "date-fns";
// import { fr } from "date-fns/locale";
// import { CalendarIcon } from "lucide-react";
//import { Checkbox } from "@/components/ui/checkbox";
//import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Link } from "react-router-dom";

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

interface Interest {
    id: string;
    label: string;
  }

  const Signup = () => {
    
    const { latitude, longitude, error } = useGeolocation();
    const { city, country, error: locationError } = useReverseGeolocation(latitude, longitude);

    const navigate = useNavigate();
    
    // const [email, setEmail] = useState('');
    // const [firstName, setFirstName] = useState('');
    // const [lastName, setLastName] = useState('');
    // const [password, setPassword] = useState('');
    
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [profilePictureIndex, setProfilePictureIndex] = useState(0);
    const [images, setImages] = useState<File[]>([]);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    
    const [gender, setGender] = useState('Non binaire');
    const [description, setDescription] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [preference, setPreference] = useState('Les deux');
    const [interests, setInterests] = useState<string[]>([]);
    const [interestError, setInterestError] = useState('');
    const [online, setOnline] = useState(false);
    const [lastConnection, setLastConnection] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorr, setError] = useState("");
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    
    const [user, setUser] = useState<User | null>(null);
    const { id, profile_picture, setProfilePicture } = useAuth();
    
    // const { id, profile_picture, setProfilePicture } = useAuth();
    // const [imageUrls, setImageUrls] = useState<string[]>([]);
    // const [profilePictureIndex, setProfilePictureIndex] = useState(0);
    
    const interestsList: Interest[] = [
      { id: "sport", label: "Sport" },
      { id: "music", label: "Musique" },
      { id: "cinema", label: "Cinéma" },
      { id: "technology", label: "Technologie" },
      { id: "travel", label: "Voyages" },
      { id: "cooking", label: "Cuisine" },
      { id: "art", label: "Art" },
      { id: "literature", label: "Littérature" }
    ];

    useEffect(() => {
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
    }, [id, profile_picture]);
    
    const calculateAge = (birthDate: string) => {
      const today = new Date();
      const birth = new Date(birthDate);
      
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      console.log(age);
      return age;
    };
    
    const handleInterestChange = (id: string): void => {
      setInterestError('');
      
      if (interests.includes(id)) {
        setInterests(interests.filter(item => item !== id));
      } else {
            if (interests.length < 3) {
                setInterests([...interests, id]);
            } else {
                setInterestError("Vous ne pouvez sélectionner que 3 intérêts maximum.");
            }
        }
    };
    
    const sendForm = async (e:any) => {
        e.preventDefault();
        
        try{
            online;
            lastConnection;
            setOnline(false);
            setLastConnection(new Date().toISOString());
            const userAge = calculateAge(birthDate);
            const token = localStorage.getItem("token");
            console.log("dans le front", token);
            fetch('http://localhost:5001/api/fillInfo', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ gender, description, preference, birthDate, age: userAge, interests, lastConnection : new Date(), city, country, latitude, longitude, online }),
            })
            .then(response => response.json())
           .then(data => {
                // localStorage.setItem("token", data.token);
                if (data.error) {
                    console.error(data.error)
                } else {
                    // navigate("/confirm-email");
                    navigate("/login", { state: { email: data.email, password: data.password || "" } });
                    console.log(data)
                }
                // navigate(`/confirm-email?token=${data.confirmationToken}`);
            })
            // localStorage.setItem
            // window.location.href = "/login";
            // .then(response => {
            //     if (response.redirected) {
            //             window.location.href = response.url;
            //         }
            //     })
        } catch (error) {
            console.error(error)
        }
      }


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




      const nextStep = () => {
        if (step === 1) {
          if (!gender || !birthDate) {
            setError("Veuillez remplir tous les champs obligatoires");
            return;
          }
        } else if (step === 2) {
          if (!description || interests.length === 0) {
            setError("Veuillez ajouter une description et sélectionner au moins un intérêt");
            return;
          }
        }
        setError("");
        setStep(step + 1);
      };
    
      const prevStep = () => {
        setStep(step - 1);
      };

      const renderStepIndicator = () => (
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === item 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                      : step > item 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > item ? <Check size={16} /> : item}
                </div>
                {item < 3 && (
                  <div className={`w-10 h-1 ${step > item ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    
//     return(
//         <Card>
//             <CardTitle> <h1>Inscription</h1> </CardTitle>
//             <CardContent>
//                 <form onSubmit={sendForm} className="flex flex-col space-y-4">
//                     <label>Gender :</label>
//                     <select value={gender} onChange={(e) => setGender(e.target.value)} className="text-black w-full px-4 py-2 border rounded-lg">
//                         <option value="Homme">Homme</option>
//                         <option value="Femme">Femme</option>
//                         <option value="Non binaire">Non binaire</option>
//                     </select>

//                     <label>Birth date :</label>
//                     <input 
//                         type='date' 
//                         value={birthDate} 
//                         onChange={(e) => setBirthDate(e.target.value)}
//                         name='birthDate'
//                         className="text-black w-full px-4 py-2 border rounded-lg"
//                     />
                    
//                     <label>description :</label>
//                     <input type="description" value={description} onChange={(e) => setDescription(e.target.value)} className="text-black w-full px-4 py-2 border rounded-lg"></input>
                    
//                     <label>préférence :</label>
//                     <select value={preference} onChange={(e) => setPreference(e.target.value)} className="text-black w-full px-4 py-2 border rounded-lg">
//                         <option value="Homme">Homme</option>
//                         <option value="Femme">Femme</option>
//                         <option value="Les deux">Les deux</option>
//                     </select>
                    
//                     <label>Intérêts (maximum 3) :</label>
//                     {interestError && (
//                         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
//                             {interestError}
//                         </div>
//                     )}
                    
//                     <div className="grid grid-cols-2 gap-2">
//                         {interestsList.map((interest) => (
//                             <div key={interest.id} className="flex items-center space-x-2">
//                                 <input
//                                     type="checkbox"
//                                     id={interest.id}
//                                     checked={interests.includes(interest.id)}
//                                     onChange={() => handleInterestChange(interest.id)}
//                                     className="rounded"
//                                 />
//                                 <label
//                                     htmlFor={interest.id}
//                                     className="text-sm cursor-pointer"
//                                 >
//                                     {interest.label}
//                                 </label>
//                             </div>
//                         ))}
//                     </div>
//                     <div className="text-sm text-gray-500">
//                         {interests.length}/3 intérêts sélectionnés
//                     </div>

//                     {/* <div className="md:col-span-3"> */}
//               <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
//                 <Camera size={20} className="mr-2 text-pink-600" /> Photos ({imageUrls.length}/5)
//               </h2>
              
//               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
//                 {imageUrls.map((url, index) => (
//                   <div 
//                     key={index} 
//                     className={`relative rounded-lg overflow-hidden h-36 ${profilePictureIndex === index ? 'ring-2 ring-pink-500' : ''}`}
//                   >
//                     <img 
//                       src={url} 
//                       alt={`Photo ${index + 1}`} 
//                       className="w-full h-full object-cover" 
//                     />
//                     <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
//                       <button 
//                         onClick={() => handleRemoveImage(index)} 
//                         className="self-end bg-red-500 text-white p-1 rounded-full"
//                       >
//                         <XIcon size={16} />
//                       </button>
//                       <button 
//                         onClick={() => handleSetProfilePicture(index)}
//                         className={`mt-auto w-full py-1 text-xs font-medium rounded ${
//                           profilePictureIndex === index 
//                             ? 'bg-pink-600 text-white' 
//                             : 'bg-white text-pink-600'
//                         }`}
//                       >
//                         {profilePictureIndex === index ? 'Photo principale' : 'Définir comme principale'}
//                       </button>
//                     </div>
//                   </div>
//                 ))}
                
//                 {imageUrls.length < 5 && (
//                   <label className="flex items-center justify-center h-36 border-2 border-dashed border-pink-200 rounded-lg cursor-pointer hover:bg-pink-50 transition-colors duration-300">
//                     <div className="text-center">
//                       <Camera size={24} className="mx-auto text-pink-400" />
//                       <div className="mt-2 text-sm text-pink-600">
//                         Ajouter une photo
//                       </div>
//                       <input 
//                         type="file" 
//                         className="hidden" 
//                         accept="image/*" 
//                         onChange={handleFileChange} 
//                       />
//                     </div>
//                   </label>
//                 )}
//               </div>
              
//               {images.length > 0 && (
//                 <button
//                   onClick={handleUpload}
//                   className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg shadow transition-colors duration-300"
//                 >
//                   Uploader les nouvelles images
//                 </button>
//               )}

//                     {/* <div className="p-4 text-center">
//                     <h1 className="text-2xl font-bold">🌍 Ma Localisation</h1>

//                     {error ? (
//                         <p className="text-red-500">❌ {error}</p>
//                     ) : (
//                         <>
//                         <p>📍 Latitude: {latitude}</p>
//                         <p>📍 Longitude: {longitude}</p>
//                         </>
//                     )}

//                     {locationError ? (
//                         <p className="text-red-500">❌ {locationError}</p>
//                     ) : (
//                         city && country && (
//                         <p className="mt-2 text-lg font-semibold">
//                             🏙️ {city}, {country}
//                         </p>
//                         )
//                     )}
//                     </div> */}
                    

//                     <button type="submit" className="text-white">S'inscrire</button>
//                 </form>
//             </CardContent>
//         </Card>
//     )
// }

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 p-4">
    <div className="w-full max-w-2xl">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-3">
          <Heart size={28} fill="white" className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Créez votre profil</h1>
        <p className="text-gray-600">Partagez quelques détails pour trouver des personnes compatibles</p>
      </div>
      
      <Card className="bg-white shadow-xl border-pink-100 overflow-hidden rounded-xl mb-6">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4">
          <CardTitle className="text-white text-center">
            <h1 className="text-xl font-bold">Créez votre profil</h1>
          </CardTitle>
        </div>
        
        <CardContent className="p-6">
          {renderStepIndicator()}
          
          {errorr && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700 text-sm rounded-md">
              <div className="flex items-center">
                <Info size={16} className="mr-2" />
                {errorr}
              </div>
            </div>
          )}
          
          <form className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Vous êtes :</label>
                  <select 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)} 
                    className="w-full px-4 py-3 border border-pink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50/30"
                  >
                    <option value="" disabled selected>Sélectionnez votre genre</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                    <option value="Non binaire">Non binaire</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Date de naissance :</label>
                  <input 
                    type="date" 
                    value={birthDate} 
                    onChange={(e) => setBirthDate(e.target.value)}
                    name="birthDate"
                    className="w-full px-4 py-3 border border-pink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50/30"
                  />
                  <p className="text-xs text-gray-500 mt-1">Vous devez avoir au moins 18 ans pour vous inscrire</p>
                </div>
                
                <div className="bg-pink-50 rounded-lg p-4 border border-pink-100">
                  <div className="flex items-center">
                    <MapPin size={20} className="text-pink-500 mr-2" />
                    <h3 className="font-medium text-gray-700">Votre localisation</h3>
                  </div>
                  
                  {locationError ? (
                    <div className="mt-2 text-red-500 text-sm">{locationError}</div>
                  ) : (
                    city && country && (
                      <div className="mt-2">
                        <p className="text-gray-600">{city}, {country}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Nous utilisons votre localisation pour vous proposer des profils à proximité
                        </p>
                      </div>
                    )
                  )}
                </div>
              </>
            )}
            
            {step === 2 && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">À propos de vous :</label>
                  <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    className="w-full px-4 py-3 border border-pink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50/30 h-32"
                    placeholder="Partagez quelques mots sur vous, vos passions, ce que vous recherchez..."
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    {description.length}/500 caractères
                  </p>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Vous recherchez :</label>
                  <select 
                    value={preference} 
                    onChange={(e) => setPreference(e.target.value)} 
                    className="w-full px-4 py-3 border border-pink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50/30"
                  >
                    <option value="" disabled selected>Sélectionnez votre préférence</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                    <option value="Les deux">Les deux</option>
                  </select>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-700 font-medium">Vos centres d'intérêt :</label>
                    <span className="text-sm text-gray-500">
                      {interests.length}/3 sélectionnés
                    </span>
                  </div>
                  
                  {interestError && (
                    <div className="bg-red-50 text-red-600 px-3 py-2 rounded-md text-sm mb-2">
                      {interestError}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {interestsList.map((interest) => (
                      <div 
                        key={interest.id} 
                        onClick={() => handleInterestChange(interest.id)}
                        className={`px-4 py-2 rounded-full border cursor-pointer transition-all ${
                          interests.includes(interest.id)
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-transparent'
                            : 'border-pink-300 hover:bg-pink-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{interest.label}</span>
                          {interests.includes(interest.id) && (
                            <Check size={16} className="ml-1" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            
            {step === 3 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-800 flex items-center">
                    <Camera size={20} className="mr-2 text-pink-500" /> 
                    Vos photos
                  </h2>
                  <span className="text-sm bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                    {imageUrls.length}/5 photos
                  </span>
                </div>
                
                {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
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
                          type="button"
                          onClick={() => handleRemoveImage(index)} 
                          className="self-end bg-red-500 text-white p-1 rounded-full"
                        >
                          <X size={16} />
                        </button>
                        <button 
                          type="button"
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
                          onChange={handleFileChange} 
                        />
                      </div>
                    </label>
                  )}
                </div> */}

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
                
                {images.length > 0 && (
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg shadow transition-colors duration-300 w-full"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Chargement...
                      </>
                    ) : (
                      <>
                        <Upload size={18} /> Uploader les nouvelles images
                      </>
                    )}
                  </button>
                )}
                
                <p className="text-sm text-gray-500 mt-4">
                  <Info size={14} className="inline mr-1" />
                  Utilisez des photos récentes et de bonne qualité. Votre photo principale apparaîtra en premier sur votre profil.
                </p>
              </div>
            )}
          </form>
        </CardContent>
        
        <CardFooter className="p-4 bg-gray-50 border-t border-pink-100 flex justify-between">
          {step > 1 ? (
            <button 
              onClick={prevStep}
              className="px-6 py-2 border border-pink-300 text-pink-600 rounded-full hover:bg-pink-50 transition-colors"
            >
              Retour
            </button>
          ) : (
            <div></div>
          )}
          
          {step < 3 ? (
            <button 
              onClick={nextStep}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:shadow-md transition-all"
            >
              Continuer
            </button>
          ) : (
            <button 
              onClick={sendForm}
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:shadow-md transition-all flex items-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Finalisation...
                </>
              ) : (
                "Terminer l'inscription"
              )}
            </button>
          )}
        </CardFooter>
      </Card>
      
      <p className="text-center text-sm text-gray-500 mt-4">
        En poursuivant, vous acceptez nos <a href="#" className="text-pink-500 hover:underline">Conditions d'utilisation</a> et notre <a href="#" className="text-pink-500 hover:underline">Politique de confidentialité</a>
      </p>
    </div>
  </div>
);
};

export default Signup