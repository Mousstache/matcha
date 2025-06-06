//import { Calendar } from "lucide-react";
import { Card, CardContent, CardTitle, CardFooter } from "../components/ui/card"
import { useState } from "react";
import useGeolocation from "../hooks/useGeolocation";
import useReverseGeolocation from "../hooks/useReverseGeolocation";
import { useNavigate } from "react-router-dom";
import { XIcon, Camera, Info, MapPin, Heart, Check, X, Upload } from 'lucide-react';



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
    
      const handleSetProfilePicture = (index: number) => {
        setProfilePictureIndex(index);
      };
    
      const handleUpload = async () => {
        const formData = new FormData();
        
        images.forEach((image) => formData.append("images", image));
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
          
          const data = await response.json();
          
          if (data.success) {
            setUploadStatus("Images uploadées avec succès !");
            setTimeout(() => setUploadStatus(null), 3000);
            
            if (data.imageUrls) {
              setImageUrls(data.imageUrls);
            }
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