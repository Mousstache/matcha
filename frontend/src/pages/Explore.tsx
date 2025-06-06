// import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import { Heart, X, UserCheck } from 'lucide-react';
// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Slider } from "@/components/ui/slider"
// import { useAuth } from "../context/auth";
// // import { socket } from  "../context/NotificationContext";
// // import { stringify } from "querystring";
// // import { Badge } from '@/components/ui/badge';


// interface Profile {
//   id: string;
//   firstname: string;
//   lastname: string;
//   age: number;
//   distance: string;
//   description: string;
//   preference: string;
//   // interests: string[];
// }

// const Explore = () => {
  
//   // const authContext = useAuth();
  
//   const { id, firstname, lastname, sexualPreference, gender, loading, longitude, latitude, socket} = useAuth();
//   // const [minage, setMinage] = useState<number>(0);
//   // const [maxage, setMaxage] = useState<number>(0);
//   // // const [distance, setDistance] = useState<number>(0);
//   // const [preferences, setPreferences] = useState<string>('');
  
  
//   // setMinage(18);
//   // setMaxage(99);
//   // // setDistance(100);
//   // setPreferences(Profile.preference);
//   longitude;
//   latitude;
//   const [minAge, setMinAge] = useState<number>(0);
//   const [maxAge, setMaxAge] = useState<number>(40);
//   const [distance, setDistance] = useState<number>(25);
  
//   // États pour les sliders
//   const [ageRange, setAgeRange] = useState<number[]>([0, 40]);
//   const [distanceValue, setDistanceValue] = useState<number[]>([25]);
  
//   // Synchroniser les états initiaux
//   useEffect(() => {
//     setAgeRange([minAge, maxAge]);
//     setDistanceValue([distance]);
//   }, []);

  
//   // Gestionnaires d'événements
//   const handleAgeChange = (values: number[]) => {
//     setAgeRange(values);
//     setMinAge(values[0]);
//     setMaxAge(values[1]);
//   };
  
//   const handleDistanceChange = (values: number[]) => {
//     setDistanceValue(values);
//     setDistance(values[0]);
//   };


//   const getUsers = async () => {
//     try {

//       if (sexualPreference === "Les deux"){
//         const res = await fetch('http://localhost:5001/api/allUsers', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json'
//         },
//         // body: JSON.stringify({minAge, maxAge, sexualPreference:gender, gender:sexualPreference, longitude, latitude, distance}),
//       });
//         const data = await res.json();
//         if (!res.ok) {
//           throw new Error(data.message);
//         }
//         setProfiles(data.users);
//       }
//       else {
//         console.log("mes donees de l'auth :", id,  firstname , lastname, sexualPreference, gender);
//         const response = await fetch('http://localhost:5001/api/allUsers', {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           },
//           // body: JSON.stringify({minAge, maxAge, sexualPreference:gender, gender:sexualPreference, longitude, latitude, distance}),
//         });
//           const data = await response.json();
//           if (!response.ok) {
//             throw new Error(data.message);
//           }
//           setProfiles(data.users);
//       }
    
//     } catch (error) {
//       console.error(error);
//     }
//   };
  
  
//   const [profiles, setProfiles] = useState<Profile[]>([]);
//   useEffect(() => {
//     console.log("useEffect déclenché avec:", {
//       loading,
//       id,
//       sexualPreference,
//       gender,
//       conditionRemplie: !loading && id && sexualPreference && gender
//     });
    
//     if (!loading && id && sexualPreference && gender) {
//       console.log("Conditions remplies, appel de getUsers()");
//       getUsers();
//     } else {
//       console.log("Conditions non remplies, getUsers() n'est pas appelé");
//     }
//   }, [loading, id, firstname, lastname, sexualPreference, gender]);
  
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [direction, setDirection] = useState('');
//   const [isAnimating, setIsAnimating] = useState(false);
  
//   const markViewed = async (viewed_id:string) => {
//     try{
//       const viewedId = viewed_id;
//       const viewerId = id;
//       console.log("l'id du mec que je regarde", viewedId);
//       const res = await fetch('http://localhost:5001/api/record-profile-view',{
//         method: "POST",
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({viewedId, viewerId}),
//       });
//       if (!res)
//         return ;
//     }catch (error){
//       console.error(error);
//     }
//   };

//     const handleLike = async (likedId:string) => {
//       try{
//         const liked_id = likedId;
//         const liker_id = id;
//         const res = await fetch('http://localhost:5001/api/likeUser',{
//           method: "POST",
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({liked_id, liker_id}),
//         });
//         if (!res)
//           return ;
//         const notif_like = { 
//           userId: likedId,
//           type: "like",
//           message: `📩 Nouveau like de ${firstname}`
//       };
//         if (socket){
//             socket.emit("SEND_NOTIFICATION",  notif_like);
//         }
//         markViewed(likedId);
//       }catch (error){
//         console.error(error);
//       }

//       if (isAnimating) return;
//       setDirection('right');
//       setIsAnimating(true);
//       setTimeout(() => {
//         setCurrentIndex(prev => prev + 1);
//         setIsAnimating(false);
//         setDirection('');
//       }, 300);
//     };

    
//     const handleDislike = async(likedId:string) => {
//       try{
//         const liked_id = likedId;
//         const liker_id = id;
//         const res = await fetch('http://localhost:5001/api/dislikeUser',{
//           method: "PUT",
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({liked_id, liker_id}),
//         });
//         if (!res)
//           return ;
//         markViewed(likedId);
//       }catch (error){
//         console.error(error);
//       }

//       if (isAnimating) return;
//       setDirection('left');
//       setIsAnimating(true);
//       setTimeout(() => {
//         setCurrentIndex(prev => prev + 1);
//         setIsAnimating(false);
//         setDirection('');
//       }, 300);
//     };
    
//     if (currentIndex >= profiles.length) {
//       console.log(profiles.length);
//       return (
//         <div className="flex flex-col items-center justify-center h-96 p-8 text-center">
//           <UserCheck size={64} className="text-gray-300 mb-4" />
//           <h2 className="text-2xl font-bold mb-2">Vous avez vu tous les profils</h2>
//           <p className="text-gray-500 mb-6">Revenez plus tard pour découvrir de nouveaux profils</p>
//           <Button onClick={() => setCurrentIndex(0)}>Recommencer</Button>
//         </div>
//       );
//     }
    
//     const currentProfile = profiles[currentIndex];
//     console.log(currentProfile);
//     if (setProfiles.length > 0) {
//     }

        
    
//     return (
//       <div>
//         <Slider onValueChange={handleAgeChange} value={ageRange} max={100} min={18} step={5} />

//         <Slider onValueChange={handleDistanceChange} value={distanceValue} max={100} min={1} step={10} />


//       <div className="w-full max-w-md mx-auto py-8">
//         <div className="relative h-full">
//           <Card 
//             className={`transform transition-all duration-300 shadow-xl ${
//               direction === 'right' ? 'translate-x-full rotate-12 opacity-0' :
//               direction === 'left' ? '-translate-x-full -rotate-12 opacity-0' : ''
//             }`}
//             >
//             <div className="relative">
//               <img 
//                 // src={currentProfile.image}
//                 alt={currentProfile.firstname} 
//                 className="w-full h-96 object-cover rounded-t-lg"
//                 />
//               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
//                 <h2 className="text-white text-2xl font-bold">
//                   {currentProfile.firstname}, {currentProfile.lastname}
//                 </h2>
//                 <p className="text-white opacity-80 text-sm">
//                   {currentProfile.distance}
//                 </p>
//               </div>
//             </div>
            
//             <CardContent className="p-4 flex ">
//               <p>age : {currentProfile.age } ans</p>
//               {/* <p className="text-gray-700 mb-4">{currentProfile.bio}</p> */}
//               <div className="flex flex-wrap gap-2">
//                 {/* {currentProfile.interests.map((interest, i) => (
//                   <Badge key={i} variant="secondary" className="bg-gray-100">
//                   {interest}
//                   </Badge>
//                   ))} */}
//                 <p>description :</p>
//                 <p>{currentProfile.description}</p>
//               </div>
//             </CardContent>
            
//             <CardFooter className="flex justify-between p-4 border-t">
//               <Button 
//                 variant="outline" 
//                 size="icon" 
//                 className="rounded-full h-12 w-12 bg-white border-2 border-red-500 hover:bg-red-50"
//                 onClick={() => handleDislike(currentProfile.id)}
//                 >
//                 <X className="h-6 w-6 text-red-500" />
//               </Button>
          
//               <Button 
//                 variant="outline" 
//                 size="icon" 
//                 className="rounded-full h-12 w-12 bg-white border-2 border-green-500 hover:bg-green-50"
//                 onClick={() => handleLike(currentProfile.id)}
//                 >
//                 <Heart className="h-6 w-6 text-green-500" />
//               </Button>
//             </CardFooter>
//           </Card>
//         </div>
//       </div>
//       </div>
//     );
//   };
  
//   export default Explore;




import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel } from "@/components/ui/form";
import {Sheet,SheetContent,SheetDescription,SheetHeader,SheetTitle,SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Heart, X, SlidersHorizontal, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import UserProfilModal from "@/components/UserProfilModal";


// import { socket } from  "../context/NotificationContext";
// import { socket } from  "../context/NotificationContext";


interface Profile {
  id: string;
  firstname: string;
  lastname: string;
  age: number;
  distance: string;
  description: string;
  preference: string;
  profile_picture: string;
  city: string;
  interests: string[];
  profile_image: string;
  gender: string;
  fame_rate: number;
  lastConnection: string;
  isonline: boolean;
}

interface Interest {
  id: string;
  label: string;
}

interface FilterFormValues {
  ageRange: number[];
  distance: number[];
  fame_rate: number[];
  interests: string[];
}


const Explore = () => {
  const { id, sexualPreference, gender, longitude, latitude } = useAuth();
  
  // States for profiles and current profile view
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [direction, setDirection] = useState('');

  // const [profilesAllViewed, setProfilesAllViewed] = useState(false);
  
  // Default filter values
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(40);
  const [distance, setDistance] = useState(25);
  const [fame, setFame] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);

  const interestsList: Interest[] = [
    { id: "sport", label: "sport" },
    { id: "music", label: "music" },
    { id: "cinema", label: "cinema" },
    { id: "technology", label: "technology" },
    { id: "travel", label: "travel" },
    { id: "cooking", label: "cooking" },
    { id: "art", label: "art" },
    { id: "literature", label: "literature" }
];

  const {socket, firstname} = useAuth();

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Create form with react-hook-form
  const form = useForm<FilterFormValues>({
    defaultValues: {
      ageRange: [minAge, maxAge],
      distance: [distance],
      fame_rate: [fame],
      interests: [],
    },
  });

  const currentProfile: Profile | null = profiles[currentProfileIndex] ?? null;

  useEffect(() => {
    form.reset({
      ageRange: [minAge, maxAge],
      distance: [distance],
      fame_rate: [fame],
      interests: [],
    });
  }, [minAge, maxAge, distance, fame]);

  const handleAgeChange = (values:number[]) => {
    setMinAge(values[0]);
    setMaxAge(values[1]);
  };

  const handleDistanceChange = (values:number[]) => {
    setDistance(values[0]);
  };

  const handleFameChange = (values:number[]) => {
    setFame(values[0]);
  };

  const handleInterestChange = (values:string[]) => {
    setInterests(values);
    console.log("Valeurs des intérêts sélectionnés>> :", values);
    // Vous pouvez mettre à jour l'état ou effectuer d'autres actions ici
  };



  const markViewed = async (viewed_id:string) => {
    try{
      const viewedId = viewed_id;
      const viewerId = id;
      console.log("l'id du mec que je regarde", viewedId);
      const res = await fetch('http://localhost:5001/api/record-profile-view',{
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({viewedId, viewerId}),
      });
      if (!res)
        return ;
    }catch (error){
      console.error(error);
    }
  };


  const handleLike = async (profileId:string) => {
    try{
      const liked_id = profileId;
      const liker_id = id;
      const res = await fetch('http://localhost:5001/api/likeUser',{
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({liked_id, liker_id}),
      });
      if (!res)
        return ;
      const notif_like = { 
        userId: liked_id,
        type: "like",
        message: `📩 Nouveau like de ${firstname}`
    };
      if (socket){
          socket.emit("SEND_NOTIFICATION",  notif_like);
      }
      markViewed(profileId);
    }catch (error){
      console.error(error);
    }
    setDirection('right');
    setTimeout(() => {
      setCurrentProfileIndex((prev) => (prev + 1) % profiles.length);
      setDirection('');
    }, 300);
  };

  const handleDislike = async (profileId:string) => {
    try{
      const liked_id = profileId;
      const liker_id = id;
      const res = await fetch('http://localhost:5001/api/dislikeUser',{
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({liked_id, liker_id}),
      });
      if (!res)
        return ;
      markViewed(profileId);
    }catch (error){
      console.error(error);
    }
    setDirection('left');
    setTimeout(() => {
      setCurrentProfileIndex((prev) => (prev + 1) % profiles.length);
      setDirection('');
    }, 300);
  };

  // function parsePostgresArray(str: string | null): string[] {
  //   if (!str) return [];
  //   return str
  //     ?.replace(/[{}"]/g, "") // Enlève { } et " autour
  //     .split(",")             // Sépare par virgule
  //     .map((item) => item.trim()); // Enlève les espaces
  // }

  // const interestsArray = parsePostgresArray(user.interests);

  // const handleConsult = async (profileId:string) => {
  //   try{
  //     const liked_id = profileId;
  //     const liker_id = id;
  //     const res = await fetch('http://localhost:5001/api/ConsultProfile',{
  //       method: "POST",
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({liked_id, liker_id}),
  //     });
  //     if (!res)
  //       return ;
  //     if (socket)
  //       // socket.emit("send_like", { liker_id: id, liked_id: profileId });
  //     markViewed(profileId);
  //   }catch (error){
  //     console.error(error);
  //   }
  // };

  const getUsers = async () => {
    try {
      
      const response = await fetch('http://localhost:5001/api/allUsers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          minAge,
          maxAge,
          maxDistance: distance,
          sexualPreference: gender,
          gender: sexualPreference,
          longitude,
          latitude,
          fame_rate: fame,
          interests,
          id
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }
      
      setProfiles(data.users);
      setCurrentProfileIndex(0);
      setDirection('');
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const applyFilters = (data: { ageRange: number[]; distance: number[] }) => {
    setMinAge(data.ageRange[0]);
    setMaxAge(data.ageRange[1]);
    setDistance(data.distance[0]);
    getUsers();
  };

  const handleUserClick = (user:any) => {
    console.log("User clicked:", user);
    setSelectedUser(user);
    setIsModalOpen(true);
    handleConsult(user.id);
  };

  const handleConsult = async (viewed_id:string) => {
    try{
      const viewedId = viewed_id;
      const viewerId = id;
      console.log("l'id du mec que je regarde", viewedId);
      const res = await fetch('http://localhost:5001/api/ConsultProfile',{
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({viewedId, viewerId}),
      });


      const notif_seen = { 
        userId: viewed_id,
        type: "like",
        message: `📩 ${firstname} a consulter votre profil`
    };
      if (socket){
          socket.emit("SEND_NOTIFICATION",  notif_seen);
      }
      if (!res)
        return ;
    }catch (error){
      console.error(error);
    }
  };

  // const currentProfile = profiles[currentProfileIndex];

  // const interestsArray =
  //   typeof currentProfile?.interests === "string"
  //     ? currentProfile.interests.split(",").map((i: string) => i.trim())
  //     : Array.isArray(currentProfile?.interests)
  //     ? currentProfile.interests
  //     : [];

  const interestsArray =
  typeof currentProfile?.interests === "string"
    ? (currentProfile.interests as string).split(",").map((i: string) => i.trim())
    : Array.isArray(currentProfile?.interests)
    ? currentProfile.interests
    : [];
  

//   return (
//     <div className="w-full max-w-md mx-auto py-8">
//       {/* Filter button and sheet */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Explore</h1>
//         <Sheet>
//           <SheetTrigger asChild>
//             <button className='text-gray-500'>
//               <SlidersHorizontal className="h-5 w-5" />
//             </button>
//           </SheetTrigger>
//           <SheetContent>
//             <SheetHeader>
//               <SheetTitle>Filtres de recherche</SheetTitle>
//               <SheetDescription>
//                 Configurez vos préférences avant de rechercher des utilisateurs
//               </SheetDescription>
//             </SheetHeader>
            
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(applyFilters)} className="space-y-6 mt-6">
//                 <FormField
//                   control={form.control}
//                   name="ageRange"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Âge: {minAge} - {maxAge} ans</FormLabel>
//                       <FormControl>
//                         <Slider
//                           onValueChange={(values) => {
//                             field.onChange(values);
//                             handleAgeChange(values);
//                           }}
//                           value={field.value}
//                           max={100}
//                           min={18}
//                           step={1}
//                           className="mt-2"
//                         />
//                       </FormControl>
//                       <FormDescription>
//                         Définissez la tranche d'âge qui vous intéresse
//                       </FormDescription>
//                     </FormItem>
//                   )}
//                 />
                
//                 <FormField
//                   control={form.control}
//                   name="distance"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Distance: {distance} km</FormLabel>
//                       <FormControl>
//                         <Slider
//                           onValueChange={(values) => {
//                             field.onChange(values);
//                             handleDistanceChange(values);
//                           }}
//                           value={field.value}
//                           max={10000}
//                           min={1}
//                           step={50}
//                           className="mt-2"
//                         />
//                       </FormControl>
//                       <FormDescription>
//                         Rayon de recherche autour de votre position
//                       </FormDescription>
//                     </FormItem>
//                   )}
//                 />


//                 {/* <FormField
//                   control={form.control}
//                   name="interests"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Interets commun </FormLabel>
//                       <FormControl>
//                         <select
//                           multiple
//                           value={field.value}
//                           onChange={(e) => {
//                             const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
//                             field.onChange(selectedOptions);
//                             handleInterestChange(selectedOptions);
//                           }}
//                           className="mt-2"
//                         >
//                           {interestsList.map((interest) => (
//                             <option key={interest.id} value={interest.label}>
//                               {interest.label}
//                             </option>
//                           ))}
//                         </select>
//                       </FormControl>
//                       <FormDescription>
//                         Interets
//                       </FormDescription>
//                     </FormItem>
//                   )}
//                 /> */}


// <FormField
//   control={form.control}
//   name="interests"
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel>Intérêts communs</FormLabel>
//       <FormControl>
//         <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-2">
//           {interestsList.map((interest) => (
//             <div key={interest.id} className="flex items-center">
//               <input
//                 type="checkbox"
//                 id={`interest-${interest.id}`}
//                 value={interest.label}
//                 checked={field.value?.includes(interest.label)}
//                 onChange={(e) => {
//                   const currentValues = field.value || [];
//                   let newValues;
                  
//                   if (e.target.checked) {
//                     // Ajouter à la sélection
//                     newValues = [...currentValues, interest.label];
//                   } else {
//                     // Retirer de la sélection
//                     newValues = currentValues.filter(val => val !== interest.label);
//                   }
                  
//                   field.onChange(newValues);
//                   console.log("Valeurs des intérêts sélectionnés :", newValues);
//                   handleInterestChange(newValues);
//                 }}
//                 className="mr-2"
//               />
//               <label htmlFor={`interest-${interest.id}`} className="cursor-pointer">
//                 {interest.label}
//               </label>
//             </div>
//           ))}
//         </div>
//       </FormControl>
//       <FormDescription>
//         Sélectionnez vos centres d'intérêt
//       </FormDescription>
//     </FormItem>
//   )}
// />

//                   <FormField
//                   control={form.control}
//                   name="fame_rate"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Fame_Rate: {fame} </FormLabel>
//                       <FormControl>
//                         <Slider
//                           onValueChange={(values) => {
//                             field.onChange(values);
//                             handleFameChange(values);
//                           }}
//                           value={field.value}
//                           max={100}
//                           min={1}
//                           step={1}
//                           className="mt-2"
//                         />
//                       </FormControl>
//                       <FormDescription>
//                         Interets
//                       </FormDescription>
//                     </FormItem>
//                   )}
//                 />
                
//                 <Button type="submit" className="w-full">Appliquer les filtres</Button>
//               </form>
//             </Form>
//           </SheetContent>
//         </Sheet>
//       </div>

//       {/* Display profiles or empty state */}
//       {profiles.length === 0 ? (
//         <div className="text-center p-8 bg-gray-50 rounded-lg">
//           <p className="text-gray-500 mb-4">Aucun profil à afficher pour le moment</p>
//           <Button onClick={getUsers}>Rechercher des utilisateurs</Button>
//         </div>
//       ) : (
//         <div className="relative h-full">
//           <Card
//             className={`transform transition-all duration-300 shadow-xl ${
//               direction === 'right' ? 'translate-x-full rotate-12 opacity-0' :
//               direction === 'left' ? '-translate-x-full -rotate-12 opacity-0' : ''
//             }`}
//           >
//             <div className="relative">
//               <img
//                 src={currentProfile.profile_picture || '/placeholder-profile.jpg'}
//                 alt={currentProfile.firstname}
//                 className="w-full h-96 object-cover rounded-t-lg"
//               />
//               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
//                 <h2 className="text-white text-2xl font-bold">
//                   {currentProfile.firstname}, {currentProfile.age}
//                 </h2>
//                 <p className="text-white opacity-80 text-sm">
//                   {currentProfile.city} - {currentProfile.distance} km
//                 </p>
//               </div>
//             </div>
//                     <div className="flex items-center justify-between">
//             <span className="text-gray-500">Genre</span>
//             {/* <Badge variant="outline" className="font-normal">
//               { currentProfile.interests}
//             </Badge> */}
//           </div>
//             <CardContent className="p-4 space-y-2">
//               <div className="flex items-center gap-2">
//                 <Badge variant="secondary">{currentProfile.gender}</Badge>
//                 {currentProfile.interests && interestsArray.map((interests, i) => (
//                   <Badge key={i} variant="outline">{interests}</Badge>
//                 ))}
//               </div>
//               <p className="text-gray-700">{currentProfile.description}</p>
//             </CardContent>
//             <CardFooter className="flex justify-between p-4 border-t">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="text-white rounded-full h-12 w-12 bg-white border-2 border-red-500 hover:bg-red-50"
//                 onClick={() => handleDislike(currentProfile.id)}
//               >
//                 <X className="h-6 w-6 text-red-500" />
//               </Button>
//               <Button
//                   variant="outline"
//                   size="icon"
//                   className="text-white rounded-full h-12 w-12 bg-white border-2 border-green-500 hover:bg-green-50"
//                   onClick={() => handleUserClick(currentProfile)}
//                 >
//                   <Search className="h-6 w-6 text-blue-500" />
//                 </Button>

//                 <UserProfilModal
//                   isOpen={isModalOpen}
//                   onClose={() => setIsModalOpen(false)}
//                   user={selectedUser}
//                 />
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="text-white rounded-full h-12 w-12 bg-white border-2 border-green-500 hover:bg-green-50"
//                 onClick={() => handleLike(currentProfile.id)}
//               >
//                 <Heart className="h-6 w-6 text-green-500" />
//               </Button>
//             </CardFooter>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// import { useState } from 'react';
// import { 
//   SlidersHorizontal, 
//   X, 
//   Heart, 
//   Search,
//   MapPin
// } from 'lucide-react';
// import { 
//   Sheet, 
//   SheetTrigger, 
//   SheetContent, 
//   SheetHeader, 
//   SheetTitle, 
//   SheetDescription 
// } from "../components/ui/sheet";
// import { 
//   Form, 
//   FormField, 
//   FormItem, 
//   FormLabel, 
//   FormControl, 
//   FormDescription 
// } from "../components/ui/form";
// import { Slider } from "../components/ui/slider";
// import { Card, CardContent, CardFooter } from "../components/ui/card";


  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-purple-100 py-8 px-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header with filter button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
              Explorer
            </span>
          </h1>
          <Sheet>
            <SheetTrigger asChild>
              <button className="bg-white hover:bg-pink-50 text-pink-600 p-2 rounded-full shadow-md transition-all duration-300">
                <SlidersHorizontal className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent className="border-l-pink-200">
              <SheetHeader>
                <SheetTitle className="text-pink-600">Filtres de recherche</SheetTitle>
                <SheetDescription>
                  Configurez vos préférences pour trouver votre match idéal
                </SheetDescription>
              </SheetHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(applyFilters)} className="space-y-6 mt-8">
                  <FormField
                    control={form.control}
                    name="ageRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Âge: <span className="text-pink-600 font-bold">{minAge} - {maxAge}</span> ans
                        </FormLabel>
                        <FormControl>
                          <Slider
                            onValueChange={(values) => {
                              field.onChange(values);
                              handleAgeChange(values);
                            }}
                            value={field.value}
                            max={100}
                            min={18}
                            step={1}
                            className="mt-2"
                          />
                        </FormControl>
                        <FormDescription>
                          Définissez la tranche d'âge qui vous intéresse
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="distance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Distance: <span className="text-pink-600 font-bold">{distance}</span> km
                        </FormLabel>
                        <FormControl>
                          <Slider
                            onValueChange={(values) => {
                              field.onChange(values);
                              handleDistanceChange(values);
                            }}
                            value={field.value}
                            max={10000}
                            min={1}
                            step={50}
                            className="mt-2"
                          />
                        </FormControl>
                        <FormDescription>
                          Rayon de recherche autour de votre position
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Intérêts communs</FormLabel>
                        <FormControl>
                          <div className="max-h-60 overflow-y-auto border border-pink-200 rounded-md p-2 space-y-2 bg-white">
                            {interestsList.map((interest) => (
                              <div key={interest.id} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`interest-${interest.id}`}
                                  value={interest.label}
                                  checked={field.value?.includes(interest.label)}
                                  onChange={(e) => {
                                    const currentValues = field.value || [];
                                    let newValues;
                                    
                                    if (e.target.checked) {
                                      newValues = [...currentValues, interest.id];
                                    } else {
                                      newValues = currentValues.filter(val => val !== interest.label);
                                    }
                                    
                                    field.onChange(newValues);
                                    handleInterestChange(newValues);
                                  }}
                                  className="mr-2 accent-pink-500"
                                />
                                <label htmlFor={`interest-${interest.id}`} className="cursor-pointer text-gray-700 hover:text-pink-600">
                                  {interest.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Sélectionnez vos centres d'intérêt
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fame_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Popularité: <span className="text-pink-600 font-bold">{fame}</span>
                        </FormLabel>
                        <FormControl>
                          <Slider
                            onValueChange={(values) => {
                              field.onChange(values);
                              handleFameChange(values);
                            }}
                            value={field.value}
                            max={100}
                            min={1}
                            step={1}
                            className="mt-2"
                          />
                        </FormControl>
                        <FormDescription>
                          Niveau de popularité recherché
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-300"
                  >
                    Appliquer les filtres
                  </Button>
                </form>
              </Form>
            </SheetContent>
          </Sheet>
        </div>

        {/* Display profiles or empty state */}
        {profiles.length === 0 ? (
          <div className="text-center p-12 bg-white shadow-lg rounded-xl border border-pink-100">
            <div className="mb-6">
              <Heart className="mx-auto h-16 w-16 text-pink-200" />
              <p className="mt-4 text-gray-500 text-lg">
                Aucun profil à afficher pour le moment
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Ajustez vos filtres ou commencez une nouvelle recherche
              </p>
            </div>
            <Button 
              onClick={getUsers}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition-all duration-300"
            >
              Rechercher des utilisateurs
            </Button>
          </div>
        ) : (
          <div className="relative">
            <Card
              className={`transform transition-all duration-500 shadow-2xl rounded-xl overflow-hidden ${
                direction === 'right' ? 'translate-x-full rotate-12 opacity-0' :
                direction === 'left' ? '-translate-x-full -rotate-12 opacity-0' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={currentProfile.profile_picture || '/placeholder-profile.jpg'}
                  alt={currentProfile.firstname}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-white text-3xl font-bold">
                    {currentProfile.firstname}, {currentProfile.age}
                  </h2>
                  <div className="flex items-center mt-2 text-white opacity-90">
                    <MapPin className="h-4 w-4 mr-1" />
                    <p className="text-sm">
                      {currentProfile.city} · <span className="font-medium">{currentProfile.distance} km</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6 bg-white">
                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-pink-100 text-pink-700 hover:bg-pink-200">
                    {currentProfile.gender}
                  </Badge>
                  {currentProfile.interests && interestsArray.map((interest, i) => (
                    <Badge key={i} variant="outline" className="border-pink-200 text-gray-700 hover:bg-pink-50">
                      {interest}
                    </Badge>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed">{currentProfile.description}</p>
              </CardContent>
              
              <CardFooter className="flex justify-between p-4 bg-white border-t border-gray-100">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-14 w-14 bg-white border-2 border-red-500 hover:bg-red-50 shadow-lg transition-all duration-300"
                  onClick={() => handleDislike(currentProfile.id)}
                >
                  <X className="h-6 w-6 text-red-500" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-14 w-14 bg-white border-2 border-blue-500 hover:bg-blue-50 shadow-lg transition-all duration-300"
                  onClick={() => handleUserClick(currentProfile)}
                >
                  <Search className="h-6 w-6 text-blue-500" />
                </Button>

                <UserProfilModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  user={selectedUser}
                />
                
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-14 w-14 bg-white border-2 border-pink-500 hover:bg-pink-50 shadow-lg transition-all duration-300"
                  onClick={() => handleLike(currentProfile.id)}
                >
                  <Heart className="h-6 w-6 text-pink-500" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;