import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart, X, UserCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from "@/components/ui/slider"
import { useAuth } from "../context/auth";
// import { stringify } from "querystring";
// import { Badge } from '@/components/ui/badge';


interface Profile {
  id: string;
  firstname: string;
  lastname: string;
  age: number;
  distance: string;
  description: string;
  preference: string;
  // interests: string[];
}

const Explore = () => {
  
  const authContext = useAuth();
  console.log("AuthContext dans Explore:", authContext);
  
  const { id, firstname, lastname, sexualPreference, gender, loading, longitude, latitude} = useAuth();
  // const [minage, setMinage] = useState<number>(0);
  // const [maxage, setMaxage] = useState<number>(0);
  // // const [distance, setDistance] = useState<number>(0);
  // const [preferences, setPreferences] = useState<string>('');
  
  
  // setMinage(18);
  // setMaxage(99);
  // // setDistance(100);
  // setPreferences(Profile.preference);
  longitude;
  latitude;
  const [minAge, setMinAge] = useState<number>(0);
  const [maxAge, setMaxAge] = useState<number>(40);
  const [distance, setDistance] = useState<number>(25);
  
  // États pour les sliders
  const [ageRange, setAgeRange] = useState<number[]>([0, 40]);
  const [distanceValue, setDistanceValue] = useState<number[]>([25]);
  
  // Synchroniser les états initiaux
  useEffect(() => {
    setAgeRange([minAge, maxAge]);
    setDistanceValue([distance]);
  }, []);
  
  // Gestionnaires d'événements
  const handleAgeChange = (values: number[]) => {
    setAgeRange(values);
    setMinAge(values[0]);
    setMaxAge(values[1]);
  };
  
  const handleDistanceChange = (values: number[]) => {
    setDistanceValue(values);
    setDistance(values[0]);
  };
  
  const getUsers = async () => {
    try {

      if (sexualPreference === "Les deux"){
        const res = await fetch('http://localhost:5001/api/allUsers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        // body: JSON.stringify({minAge, maxAge, sexualPreference:gender, gender:sexualPreference, longitude, latitude, distance}),
      });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }
        setProfiles(data.users);
      }
      else {
        console.log("mes donees de l'auth :", id,  firstname , lastname, sexualPreference, gender);
        const response = await fetch('http://localhost:5001/api/allUsers', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          // body: JSON.stringify({minAge, maxAge, sexualPreference:gender, gender:sexualPreference, longitude, latitude, distance}),
        });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message);
          }
          setProfiles(data.users);
      }
    
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  useEffect(() => {
    console.log("useEffect déclenché avec:", {
      loading,
      id,
      sexualPreference,
      gender,
      conditionRemplie: !loading && id && sexualPreference && gender
    });
    
    if (!loading && id && sexualPreference && gender) {
      console.log("Conditions remplies, appel de getUsers()");
      getUsers();
    } else {
      console.log("Conditions non remplies, getUsers() n'est pas appelé");
    }
  }, [loading, id, firstname, lastname, sexualPreference, gender]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  
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

    const handleLike = async (likedId:string) => {
      try{
        const liked_id = likedId;
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
        markViewed(likedId);
      }catch (error){
        console.error(error);
      }

      if (isAnimating) return;
      setDirection('right');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setIsAnimating(false);
        setDirection('');
      }, 300);
    };

    
    const handleDislike = async(likedId:string) => {
      try{
        const liked_id = likedId;
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
        markViewed(likedId);
      }catch (error){
        console.error(error);
      }

      if (isAnimating) return;
      setDirection('left');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setIsAnimating(false);
        setDirection('');
      }, 300);
    };
    
    if (currentIndex >= profiles.length) {
      console.log(profiles.length);
      return (
        <div className="flex flex-col items-center justify-center h-96 p-8 text-center">
          <UserCheck size={64} className="text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Vous avez vu tous les profils</h2>
          <p className="text-gray-500 mb-6">Revenez plus tard pour découvrir de nouveaux profils</p>
          <Button onClick={() => setCurrentIndex(0)}>Recommencer</Button>
        </div>
      );
    }
    
    const currentProfile = profiles[currentIndex];
    console.log(currentProfile);
    if (setProfiles.length > 0) {
    }

        
    
    return (
      <div>
        <Slider onValueChange={handleAgeChange} value={ageRange} max={100} min={18} step={5} />

        <Slider onValueChange={handleDistanceChange} value={distanceValue} max={100} min={1} step={10} />


      <div className="w-full max-w-md mx-auto py-8">
        <div className="relative h-full">
          <Card 
            className={`transform transition-all duration-300 shadow-xl ${
              direction === 'right' ? 'translate-x-full rotate-12 opacity-0' :
              direction === 'left' ? '-translate-x-full -rotate-12 opacity-0' : ''
            }`}
            >
            <div className="relative">
              <img 
                // src={currentProfile.image}
                alt={currentProfile.firstname} 
                className="w-full h-96 object-cover rounded-t-lg"
                />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h2 className="text-white text-2xl font-bold">
                  {currentProfile.firstname}, {currentProfile.lastname}
                </h2>
                <p className="text-white opacity-80 text-sm">
                  {currentProfile.distance}
                </p>
              </div>
            </div>
            
            <CardContent className="p-4 flex ">
              <p>age : {currentProfile.age } ans</p>
              {/* <p className="text-gray-700 mb-4">{currentProfile.bio}</p> */}
              <div className="flex flex-wrap gap-2">
                {/* {currentProfile.interests.map((interest, i) => (
                  <Badge key={i} variant="secondary" className="bg-gray-100">
                  {interest}
                  </Badge>
                  ))} */}
                <p>description :</p>
                <p>{currentProfile.description}</p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between p-4 border-t">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-12 w-12 bg-white border-2 border-red-500 hover:bg-red-50"
                onClick={() => handleDislike(currentProfile.id)}
                >
                <X className="h-6 w-6 text-red-500" />
              </Button>
          
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-12 w-12 bg-white border-2 border-green-500 hover:bg-green-50"
                onClick={() => handleLike(currentProfile.id)}
                >
                <Heart className="h-6 w-6 text-green-500" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      </div>
    );
  };
  
  export default Explore;