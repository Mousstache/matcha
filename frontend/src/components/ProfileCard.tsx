import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileCardProps {
  profile: {
    id: string;
    firstname: string;
    lastname: string;
    age: number;
    distance: string;
    description: string;
    profile_picture: string;
    city: string;
  };
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  direction: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onLike, onDislike, direction }) => {
  return (
    <Card className={`transition-all duration-300 shadow-xl transform ${
      direction === "right" ? "translate-x-full rotate-12 opacity-0" :
      direction === "left" ? "-translate-x-full -rotate-12 opacity-0" : ""
    }`}>
      <img src={profile.profile_picture} alt={profile.firstname} className="w-full h-96 object-cover rounded-t-lg" />

      <CardContent className="p-4">
        <h2 className="text-xl font-bold">{profile.firstname}, {profile.lastname}</h2>
        <p className="text-sm text-gray-500">{profile.distance} km - {profile.age} ans</p>
        <p className="mt-2">{profile.description}</p>
        <p className="text-gray-500 text-sm">{profile.city}</p>
      </CardContent>

      <CardFooter className="flex justify-between p-4 border-t">
        <Button onClick={() => onDislike(profile.id)} className="bg-white border-2 border-red-500">
          <X className="text-red-500" />
        </Button>
        <Button onClick={() => onLike(profile.id)} className="bg-white border-2 border-green-500">
          <Heart className="text-green-500" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;