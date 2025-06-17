import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/User";



interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

// const interestsArray = Array.isArray(user.interests)
//   ? user.interests
//   : typeof user.interests === "string"
//   ? user.interests.split(",").map((i) => i.trim())
//   : [];



const UserProfileModal: React.FC<Props> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

const getInitials = () => {
  return `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`;
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            {/* Remplacer par une vraie image si disponible */}
            <AvatarImage src={`/avatars/${user.id}.jpg`} alt={`${user.firstname} ${user.lastname}`} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <DialogTitle className="text-xl font-semibold">
            {user.firstname} {user.lastname}
          </DialogTitle>
        </div>
      </DialogHeader>

      <Card className="border-none shadow-none mt-2">
        <CardContent className="p-0 space-y-4">

          <div className="flex items-center justify-between">
            <span className="text-gray-500">Fame Rate</span>
            <span className="font-medium">{user.fame_rate}</span>
          </div>
{/* 
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Fame Rate</span>
            <span className="font-medium">{user.isOnline}</span>
          </div> */}

          <div className="flex items-center justify-between">
            <span className="text-gray-500">Dernière connexion</span>
            <span className="font-medium">
              {user.lastconnection ? new Date(user.lastconnection).toLocaleString("fr-FR", {
                dateStyle: "medium",
                timeStyle: "short",
              }) : "Inconnue"}
              {/* {user.lastconnection} */}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500">Âge</span>
            <div className="bg-gradient-to-r from-pink-500 via-pink-400 to-purple-500 text-white font-semibold px-4 py-1.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
              {user.age || "N/A"} {user.age ? "ans" : ""}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-500">City</span>
            <span className="font-medium">{user.city || "Non spécifié"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500">Genre</span>
            <Badge variant="outline" className="font-normal">
              {typeof user.gender === 'number' 
                ? user.gender === 1 ? 'Homme' : user.gender === 2 ? 'Femme' : 'Autre' 
                : user.gender || "Non spécifié"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500">Statut</span>
            <Badge variant={user.isonline ? "default" : "outline"} className="font-normal">
              {user.isonline ? "En ligne" : "Hors ligne"}
            </Badge>
          </div>


          <div className="flex items-center justify-between">
            <span className="text-gray-500">Centres d'intérêt</span>
            <div className="flex flex-wrap gap-2">
              {user.interests && (
                <Badge variant="outline" className="font-normal">
                  {typeof user.interests === "string" 
                    ? user.interests 
                    : Array.isArray(user.interests)
                      ? user.interests.join(", ")
                      : "Aucun intérêt"}
                </Badge>
              )}
            </div>
          </div>

{/* {interestsArray.length > 0 && (
  <div className="space-y-1">
    <span className="text-gray-500">Centres d'intérêt</span>
    <div className="flex flex-wrap gap-2 mt-1">
      {interestsArray.map((tag, idx) => (
        <Badge key={idx} variant="outline" className="font-normal">
          {tag}
        </Badge>
      ))}
    </div>
  </div>
)} */}
          
          <div className="space-y-2">
            <span className="text-gray-500">Biographie</span>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
              {user.description || "Aucune biographie disponible."}
            </p>
          </div>

          {(user.latitude && user.longitude) && (
            <div className="space-y-2">
              <span className="text-gray-500">Localisation</span>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-700">Lat: {user.latitude.toFixed(6)}</p>
                <p className="text-gray-700">Long: {user.longitude.toFixed(6)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <DialogFooter>
        <button onClick={onClose} className="w-full">
          Fermer
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
};

export default UserProfileModal;