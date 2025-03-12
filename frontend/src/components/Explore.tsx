import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart, X, UserCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { set } from "date-fns";
// import { set } from "date-fns";
// import { set } from "date-fns";


interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  distance: string;
  description: string;
  interests: string[];
}

const Explore = () => {
  const getUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/allUsers', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      setProfiles(data.users);
    } catch (error) {
      console.error(error);
    }
  };


  const [profiles, setProfiles] = useState<Profile[]>([]);
  useEffect(() => {
    getUsers();
  }
  , []);
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    
    const handleLike = () => {
      if (isAnimating) return;
      setDirection('right');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setIsAnimating(false);
        setDirection('');
      }, 300);
    };
    
    const handleDislike = () => {
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
                alt={currentProfile.firstName} 
                className="w-full h-96 object-cover rounded-t-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <h2 className="text-white text-2xl font-bold">
                  {currentProfile.firstName}, {currentProfile.lastName}
                </h2>
                <p className="text-white opacity-80 text-sm">
                  {currentProfile.distance}
                </p>
              </div>
            </div>
            
            <CardContent className="p-4">
              <p>age : {currentProfile.age } ans</p>
              {/* <p className="text-gray-700 mb-4">{currentProfile.bio}</p> */}
              <div className="flex flex-wrap gap-2">
                {currentProfile.interests.map((interest, i) => (
                  <Badge key={i} variant="secondary" className="bg-gray-100">
                    {interest}
                  </Badge>
                ))}
                <p>description :</p>
                <p>{currentProfile.description}</p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between p-4 border-t">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-12 w-12 bg-white border-2 border-red-500 hover:bg-red-50"
                onClick={handleDislike}
              >
                <X className="h-6 w-6 text-red-500" />
              </Button>
          
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-12 w-12 bg-white border-2 border-green-500 hover:bg-green-50"
                onClick={handleLike}
              >
                <Heart className="h-6 w-6 text-green-500" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  };
  
  export default Explore;