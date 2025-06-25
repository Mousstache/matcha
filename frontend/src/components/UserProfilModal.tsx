import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/User";
import { Heart } from "lucide-react";

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
  const [relationshipStatus, setRelationshipStatus] = useState<{
    isMatch: boolean;
    currentUserLikesTarget: boolean;
    targetLikesCurrentUser: boolean;
    relationshipStatus: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchRelationshipStatus();
    }
  }, [isOpen, user]);

  const fetchRelationshipStatus = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5001/api/relationship-status/${user.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRelationshipStatus(data);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du statut de relation:",
        error
      );
    }
  };

  const getRelationshipBadge = () => {
    if (!relationshipStatus) return null;

    if (relationshipStatus.isMatch) {
      return (
        <Badge className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold flex items-center gap-2">
          <Heart size={14} />
          💕 Match !
        </Badge>
      );
    }

    if (relationshipStatus.targetLikesCurrentUser) {
      return (
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold flex items-center gap-2">
          <Heart size={14} />
          💜 Vous a liké
        </Badge>
      );
    }

    if (relationshipStatus.currentUserLikesTarget) {
      return (
        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold flex items-center gap-2">
          <Heart size={14} />
          💙 Vous avez liké
        </Badge>
      );
    }

    return null;
  };

  if (!isOpen || !user) return null;

  const getInitials = () => {
    return `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <DialogHeader className="pb-4 border-b border-pink-100">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 ring-4 ring-pink-200 ring-offset-2">
                <AvatarImage
                  src={user.profile_picture}
                  alt={`${user.firstname} ${user.lastname}`}
                />
                <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white text-lg font-semibold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              {user.isonline && (
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 border-2 border-white rounded-full shadow-lg animate-pulse"></div>
              )}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {user.firstname} {user.lastname}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-600 text-sm">
                  {user.isonline ? "🟢 En ligne" : "⚫ Hors ligne"}
                </p>
                {getRelationshipBadge()}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Section informations principales */}
          <Card className="border-pink-200 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                Informations générales
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Âge</span>
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold px-3 py-1 rounded-full text-sm shadow-md">
                      {user.age || "N/A"} {user.age ? "ans" : ""}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Ville</span>
                    <span className="font-semibold text-gray-800">
                      {user.city || "Non spécifié"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Genre</span>
                    <Badge
                      variant="outline"
                      className="bg-white border-pink-300 text-pink-700 font-semibold"
                    >
                      {typeof user.gender === "number"
                        ? user.gender === 1
                          ? "Homme"
                          : user.gender === 2
                          ? "Femme"
                          : "Autre"
                        : user.gender || "Non spécifié"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Statut</span>
                    <Badge
                      variant={user.isonline ? "default" : "outline"}
                      className={
                        user.isonline
                          ? "bg-green-500 text-white font-semibold"
                          : "border-gray-400 text-gray-600"
                      }
                    >
                      {user.isonline ? "🟢 En ligne" : "⚫ Hors ligne"}
                    </Badge>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                    <span className="text-gray-600 font-medium text-sm">
                      Dernière connexion
                    </span>
                    <p className="font-semibold text-gray-800 text-sm mt-1">
                      {user.lastconnection
                        ? new Date(user.lastconnection).toLocaleString(
                            "fr-FR",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }
                          )
                        : "Inconnue"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section centres d'intérêt */}
          {user.interests && (
            <Card className="border-pink-200 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Centres d'intérêt
                </h3>
                <div className="flex flex-wrap gap-2">
                  {typeof user.interests === "string" ? (
                    user.interests.split(",").map((interest, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-gradient-to-r from-pink-100 to-purple-100 border-pink-300 text-gray-700 font-medium px-3 py-1"
                      >
                        {interest.trim()}
                      </Badge>
                    ))
                  ) : Array.isArray(user.interests) ? (
                    user.interests.map((interest, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-gradient-to-r from-pink-100 to-purple-100 border-pink-300 text-gray-700 font-medium px-3 py-1"
                      >
                        {interest}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">
                      Aucun intérêt renseigné
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section photos */}
          <Card className="border-pink-200 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Photos
              </h3>
              {user.images && user.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {user.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group overflow-hidden rounded-xl shadow-lg"
                    >
                      <img
                        src={img}
                        alt={`Photo ${idx + 1}`}
                        className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="relative group overflow-hidden rounded-xl shadow-lg max-w-sm">
                    <img
                      src={user.profile_picture}
                      alt={`${user.firstname} ${user.lastname}`}
                      className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section biographie */}
          <Card className="border-pink-200 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Biographie
              </h3>
              <div className="bg-gradient-to-r from-gray-50 to-pink-50 p-4 rounded-lg border border-pink-100">
                <p className="text-gray-700 leading-relaxed">
                  {user.description ||
                    "Aucune biographie disponible pour le moment."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section localisation */}
          {user.latitude && user.longitude && (
            <Card className="border-pink-200 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Localisation
                </h3>
                <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-4 rounded-lg border border-purple-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Latitude:</span>
                    <span className="font-mono text-sm bg-white px-2 py-1 rounded border">
                      {user.latitude.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">
                      Longitude:
                    </span>
                    <span className="font-mono text-sm bg-white px-2 py-1 rounded border">
                      {user.longitude.toFixed(6)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="border-t border-pink-100 pt-4">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
