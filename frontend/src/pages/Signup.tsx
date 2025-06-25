import React from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import { useState, useEffect } from "react";
import useGeolocation from "../hooks/useGeolocation";
import useReverseGeolocation from "../hooks/useReverseGeolocation";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Info,
  MapPin,
  Heart,
  Check,
  User,
  Calendar,
  MessageCircle,
  Star,
  Upload,
} from "lucide-react";
import { addToast } from "@/utils/toast";
import { useAuth } from "@/context/auth";
import { validateJWTToken } from "@/utils/tokenValidator";

interface Interest {
  id: string;
  label: string;
}

const Signup = () => {
  const { latitude, longitude } = useGeolocation();
  const {
    city,
    country,
    error: locationError,
  } = useReverseGeolocation(latitude, longitude);

  const navigate = useNavigate();

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [gender, setGender] = useState("Non binaire");
  const [description, setDescription] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [preference, setPreference] = useState("Les deux");
  const [interests, setInterests] = useState<string[]>([]);
  const [interestError, setInterestError] = useState("");
  const [online, setOnline] = useState(false);
  const [step, setStep] = useState(1);
  const [errorr, setError] = useState("");

  const { profile_picture, setProfilePicture, emailConfirmed, emailVerified } = useAuth();

  const interestsList: Interest[] = [
    { id: "sport", label: "Sport" },
    { id: "music", label: "Musique" },
    { id: "cinema", label: "Cinéma" },
    { id: "technology", label: "Technologie" },
    { id: "travel", label: "Voyages" },
    { id: "cooking", label: "Cuisine" },
    { id: "art", label: "Art" },
    { id: "literature", label: "Littérature" },
  ];
  useEffect(() => {
    const fetchImageUrls = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const tokenValidation = validateJWTToken(token);
      if (!tokenValidation.isValid) {
        localStorage.removeItem("token");
        addToast({
          title: "Erreur d'authentification",
          description: `Token invalide détecté: ${tokenValidation.error}. Veuillez vous reconnecter.`,
          color: "danger",
        });
        return;
      }

      try {
        const response = await fetch("http://localhost:5001/api/user-images", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok && data.images) {
          const imagesWithPosition = data.images as {
            image_url: string;
            position: number;
          }[];

          const sortedImages = [...imagesWithPosition].sort((a, b) => {
            if (profile_picture && a.image_url === profile_picture) return -1;
            if (profile_picture && b.image_url === profile_picture) return 1;
            return a.position - b.position;
          });

          const newImageUrls = sortedImages.map((img) => img.image_url);
          setImageUrls(newImageUrls);
        } else {
          setImageUrls([]);
        }
      } catch (err) {
        setImageUrls([]);
      }
    };

    fetchImageUrls();
  }, []); // Déclenché une seule fois au montage du composant

  const refreshImages = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/user-images", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.images) {
        const imagesWithPosition = data.images as {
          image_url: string;
          position: number;
        }[];

        const sortedImages = [...imagesWithPosition].sort(
          (a, b) => a.position - b.position
        );

        const newImageUrls = sortedImages.map((img) => img.image_url);
        setImageUrls(newImageUrls);
      } else {
        setImageUrls([]);
      }
    } catch (err) {
      setImageUrls([]);
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleInterestChange = (id: string): void => {
    setInterestError("");

    if (interests.includes(id)) {
      setInterests(interests.filter((item) => item !== id));
    } else {
      if (interests.length < 3) {
        setInterests([...interests, id]);
      } else {
        setInterestError("Vous ne pouvez sélectionner que 3 intérêts maximum.");
      }
    }
  };

  const sendForm = async (e: any) => {
    e.preventDefault();
    setError("");

    if (imageUrls.length === 0) {
      setError(
        "Veuillez ajouter au moins une photo avant de terminer l'inscription"
      );
      return;
    }

    try {
      setOnline(false);
      const userAge = calculateAge(birthDate);
      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          "Aucun token d'authentification trouvé. Veuillez vous reconnecter."
        );
        return;
      }

      const parts = token.split(".");
      if (parts.length !== 3) {
        setError(
          "Token d'authentification invalide. Veuillez vous reconnecter."
        );
        localStorage.removeItem("token");
        return;
      }

      const response = await fetch("http://localhost:5001/api/fillInfo", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gender,
          description,
          preference,
          birthDate,
          age: userAge,
          interests,
          lastConnection: new Date(),
          city,
          country,
          latitude,
          longitude,
          online,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error || data.message || "Erreur inconnue.");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      navigate("/login", {
        state: { email: data.userName, password: data.password || "" },
      });
    } catch (error: any) {
      setError(error.message || "Erreur réseau.");
    }
  };

  const handleUpload = async (filesToUpload: File[]) => {
    if (filesToUpload.length === 0) {
      addToast({
        title: "Information",
        description: "Aucune image à uploader.",
        color: "default",
      });
      return;
    }

    const formData = new FormData();
    filesToUpload.forEach((image) => formData.append("images", image));

    const token = localStorage.getItem("token");

    const tokenValidation = validateJWTToken(token);
    if (!tokenValidation.isValid) {
      addToast({
        title: "Erreur",
        description: `Authentification invalide: ${tokenValidation.error}. Veuillez vous reconnecter.`,
        color: "danger",
      });
      localStorage.removeItem("token");
      return;
    }

    const currentProfileImgUrl = profile_picture;
    const existingProfileIndexInCurrentUrls = imageUrls.findIndex(
      (url) => url === currentProfileImgUrl
    );
    const profileIndexToSend =
      existingProfileIndexInCurrentUrls !== -1
        ? existingProfileIndexInCurrentUrls
        : 0;
    formData.append("profilePictureIndex", profileIndexToSend.toString());

    const uploadPromise = fetch("http://localhost:5001/api/upload", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: formData,
    }).then((response) => response.json());

    uploadPromise
      .then(async (data) => {
        if (data.success) {
          await new Promise((resolve) => setTimeout(resolve, 100));

          await refreshImages();

          if (data.profilePicture !== undefined) {
            setProfilePicture(data.profilePicture);
          }
          addToast({
            title: "Succès",
            description: "Photos ajoutées avec succès !",
            color: "success",
          });
        } else {
          addToast({
            title: "Erreur",
            description: data.error || "Erreur lors de l'upload",
            color: "danger",
          });
        }
      })
      .catch(() => {
        addToast({
          title: "Erreur",
          description: "Erreur de connexion lors de l'upload",
          color: "danger",
        });
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileList = Array.from(files);

    if (imageUrls.length + fileList.length > 5) {
      addToast({
        title: "Erreur",
        description: `Vous ne pouvez pas avoir plus de 5 images au total (actuellement ${imageUrls.length}).`,
        color: "danger",
      });
      return;
    }

    handleUpload(fileList);
  };

  const handleRemoveImage = async (index: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      addToast({
        title: "Erreur",
        description: "Authentification requise pour supprimer.",
        color: "danger",
      });
      return;
    }

    try {
      const imagesResponse = await fetch(
        "http://localhost:5001/api/user-images",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const imagesData = await imagesResponse.json();
      if (!imagesResponse.ok || !imagesData.images) {
        throw new Error(
          imagesData.error ||
            "Erreur lors de la récupération des images pour suppression"
        );
      }

      const imageUrlToRemove = imageUrls[index];
      const imageToDelete = imagesData.images.find(
        (img: any) => img.image_url === imageUrlToRemove
      );

      if (!imageToDelete) {
        addToast({
          title: "Erreur",
          description: "Image non trouvée.",
          color: "danger",
        });
        return;
      }

      const positionToDelete = imageToDelete.position;

      const deletePromise = fetch(
        `http://localhost:5001/api/delete-image/${positionToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((response) => response.json());

      deletePromise
        .then(async (data) => {
          if (data.success) {
            await refreshImages();

            if (data.profilePicture !== undefined) {
              setProfilePicture(data.profilePicture);
            }
            addToast({
              title: "Succès",
              description: "Photo supprimée avec succès !",
              color: "success",
            });
          } else {
            addToast({
              title: "Erreur",
              description: data.error || "Erreur lors de la suppression",
              color: "danger",
            });
          }
        })
        .catch(() => {
          addToast({
            title: "Erreur",
            description: "Erreur de connexion lors de la suppression",
            color: "danger",
          });
        });
    } catch (error: any) {
      addToast({
        title: "Erreur",
        description:
          error.message || "Erreur lors de la suppression de l'image.",
        color: "danger",
      });
    }
  };

  const handleSetProfilePicture = async (index: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      addToast({
        title: "Erreur",
        description:
          "Authentification requise pour changer la photo principale.",
        color: "danger",
      });
      return;
    }

    try {
      await refreshImages();

      const imageUrlToSet = imageUrls[index];

      if (!imageUrlToSet) {
        addToast({
          title: "Erreur",
          description: "Image non trouvée à cet index.",
          color: "danger",
        });
        return;
      }

      const imagesResponse = await fetch(
        "http://localhost:5001/api/user-images",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const imagesData = await imagesResponse.json();
      if (!imagesResponse.ok || !imagesData.images) {
        throw new Error(
          imagesData.error ||
            "Erreur lors de la récupération des images pour définir la photo principale"
        );
      }

      const imageToSetAsProfile = imagesData.images.find(
        (img: any) => img.image_url === imageUrlToSet
      );

      if (!imageToSetAsProfile) {
        addToast({
          title: "Erreur",
          description: "Image non trouvée pour définir comme principale.",
          color: "danger",
        });
        return;
      }

      const positionToSet = imageToSetAsProfile.position;
      await setProfilePictureRequest(positionToSet, token);
    } catch (error: any) {
      addToast({
        title: "Erreur",
        description:
          error.message || "Erreur lors du changement de photo principale.",
        color: "danger",
      });
    }
  };

  const setProfilePictureRequest = async (
    positionToSet: number,
    token: string
  ) => {
    const setProfilePromise = fetch(
      "http://localhost:5001/api/set-profile-picture",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ position: positionToSet }),
      }
    ).then((response) => response.json());

    setProfilePromise
      .then(async (data) => {
        if (data.success) {
          setProfilePicture(data.profilePicture);

          await refreshImages();

          addToast({
            title: "Succès",
            description: "Photo principale mise à jour avec succès !",
            color: "success",
          });
        } else {
          addToast({
            title: "Erreur",
            description:
              data.error ||
              "Erreur lors de la définition de la photo principale.",
            color: "danger",
          });
        }
      })
      .catch(() => {
        addToast({
          title: "Erreur",
          description:
            "Erreur de connexion lors de la définition de la photo principale.",
          color: "danger",
        });
      });
  };

  const nextStep = () => {
    if (step === 1) {
      if (!gender || !birthDate) {
        setError("Veuillez remplir tous les champs obligatoires");
        return;
      }

      const age = calculateAge(birthDate);
      if (age < 18) {
        setError(
          "Vous devez avoir au moins 18 ans pour vous inscrire sur Matcha"
        );
        return;
      }
    } else if (step === 2) {
      if (!description || interests.length === 0) {
        setError(
          "Veuillez ajouter une description et sélectionner au moins un intérêt"
        );
        return;
      }
    } else if (step === 3) {
      if (imageUrls.length === 0) {
        setError("Veuillez ajouter au moins une photo");
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
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-3">
        {[
          { num: 1, label: "Informations de base" },
          { num: 2, label: "À propos de vous" },
          { num: 3, label: "Photos" },
        ].map((item, index) => (
          <div key={item.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  step === item.num
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg transform scale-110"
                    : step > item.num
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > item.num ? <Check size={18} /> : item.num}
              </div>
              <span
                className={`text-xs mt-2 font-medium transition-colors ${
                  step >= item.num ? "text-pink-600" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </div>
            {index < 2 && (
              <div
                className={`w-16 h-1 mx-4 rounded-full transition-all duration-300 ${
                  step > item.num
                    ? "bg-green-500"
                    : step === item.num
                    ? "bg-gradient-to-r from-pink-500 to-purple-500"
                    : "bg-gray-200"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 p-4">
      {/* Particules décoratives */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-pink-300 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-purple-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-fuchsia-300 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-pink-300 rounded-full animate-pulse delay-700"></div>
        <Heart
          className="absolute bottom-32 right-1/4 text-purple-200 animate-bounce delay-1000"
          size={12}
        />
        <Star
          className="absolute top-1/4 left-1/3 text-pink-200 animate-pulse delay-500"
          size={10}
        />
      </div>

      <div className="w-full max-w-2xl relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-4 shadow-xl transform hover:scale-105 transition-all duration-300">
            <Heart
              size={32}
              fill="white"
              className="text-white animate-pulse"
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Matcha
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Créez votre profil parfait
          </h2>
          <p className="text-gray-600">
            Partagez quelques détails pour trouver des personnes compatibles
          </p>
        </div>

        {/* Message d'information pour les utilisateurs non confirmés */}
        {!emailConfirmed && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-lg shadow-sm animate-in slide-in-from-top-2">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Info size={20} className="text-blue-500 mt-0.5" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-blue-800 mb-1">
                  Finalisez votre inscription
                </h3>
                <p className="text-sm text-blue-700 mb-2">
                  {!emailVerified 
                    ? "Pour accéder à l'application, vous devez d'abord confirmer votre adresse email, puis compléter votre profil ci-dessous."
                    : "Votre email est vérifié ! Complétez maintenant votre profil pour accéder à toutes les fonctionnalités de l'application."
                  }
                </p>
                {!emailVerified && (
                  <div className="flex items-center gap-2 text-xs text-blue-600">
                    <Check size={14} />
                    <span>Vérifiez votre boîte mail et cliquez sur le lien de confirmation</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl shadow-black/20 border-0 overflow-hidden rounded-2xl mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100/20 to-gray-200/20 pointer-events-none"></div>

          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4 relative">
            <CardTitle className="text-white text-center">
              <h1 className="text-lg font-semibold">Créez votre profil</h1>
              <p className="text-pink-100 text-sm mt-1">Étape {step} sur 3</p>
            </CardTitle>
          </div>

          <CardContent className="p-8 relative">
            {renderStepIndicator()}

            {errorr && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-lg shadow-sm animate-in slide-in-from-top-1">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Info size={18} className="text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800 font-medium">{errorr}</p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-8">
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <User size={16} className="text-pink-500" />
                      Vous êtes
                    </label>
                    <div className="relative group">
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-4 py-3 pl-10 bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 appearance-none group-hover:border-gray-300"
                      >
                        <option value="" disabled>
                          Sélectionnez votre genre
                        </option>
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                        <option value="Non binaire">Non binaire</option>
                      </select>
                      <User
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Calendar size={16} className="text-pink-500" />
                      Date de naissance
                    </label>
                    <div className="relative group">
                      <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        name="birthDate"
                        className="w-full px-4 py-3 pl-10 bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 group-hover:border-gray-300"
                      />
                      <Calendar
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors"
                      />
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Check size={12} className="text-green-500" />
                      Vous devez avoir au moins 18 ans pour vous inscrire
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-100 shadow-sm">
                    <div className="flex items-center mb-3">
                      <MapPin size={20} className="text-pink-500 mr-2" />
                      <h3 className="font-semibold text-gray-700">
                        Votre localisation
                      </h3>
                    </div>

                    {locationError ? (
                      <div className="mt-2 text-red-500 text-sm">
                        {locationError}
                      </div>
                    ) : (
                      city &&
                      country && (
                        <div className="mt-2">
                          <p className="text-gray-600">
                            {city}, {country}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Nous utilisons votre localisation pour vous proposer
                            des profils à proximité
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <MessageCircle size={16} className="text-pink-500" />À
                      propos de vous
                    </label>
                    <div className="relative group">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={500}
                        className="w-full px-4 py-3 pl-10 bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 placeholder-gray-400 group-hover:border-gray-300 h-32 resize-none"
                        placeholder="Partagez quelques mots sur vous, vos passions, ce que vous recherchez..."
                      />
                      <MessageCircle
                        size={18}
                        className="absolute left-3 top-3 text-gray-400 group-focus-within:text-pink-500 transition-colors"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Info size={12} className="text-blue-500" />
                        Décrivez-vous de manière authentique et positive
                      </p>
                      <span
                        className={`text-xs font-medium ${
                          description.length > 450
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {description.length}/500
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Heart size={16} className="text-pink-500" />
                      Vous recherchez
                    </label>
                    <div className="relative group">
                      <select
                        value={preference}
                        onChange={(e) => setPreference(e.target.value)}
                        className="w-full px-4 py-3 pl-10 bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-gray-800 appearance-none group-hover:border-gray-300"
                      >
                        <option value="" disabled>
                          Sélectionnez votre préférence
                        </option>
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                        <option value="Les deux">Les deux</option>
                      </select>
                      <Heart
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Star size={16} className="text-pink-500" />
                        Vos centres d'intérêt
                      </label>
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-full ${
                          interests.length === 0
                            ? "bg-gray-100 text-gray-500"
                            : interests.length <= 2
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {interests.length}/3 sélectionnés
                      </span>
                    </div>

                    {interestError && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                        <Info size={16} className="text-red-500" />
                        {interestError}
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {interestsList.map((interest) => (
                        <div
                          key={interest.id}
                          onClick={() => handleInterestChange(interest.id)}
                          className={`px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                            interests.includes(interest.id)
                              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white border-transparent shadow-lg"
                              : "border-pink-200 hover:bg-pink-50 hover:border-pink-300 text-gray-700 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2 text-center">
                            <span className="font-medium text-sm">
                              {interest.label}
                            </span>
                            {interests.includes(interest.id) && (
                              <Check size={16} className="text-white" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                      <Info size={12} className="text-blue-500" />
                      Sélectionnez jusqu'à 3 centres d'intérêt qui vous
                      définissent le mieux
                    </p>
                  </div>
                </>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  {/* Header section plus compact */}
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
                      <Camera size={20} className="text-pink-500" />
                      Ajoutez vos plus belles photos
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Montrez votre personnalité avec des photos authentiques et
                      récentes
                    </p>
                  </div>

                  {/* Section photos avec header aligné */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                        <Camera size={16} className="text-pink-500" />
                        Vos photos
                      </h3>
                      <span
                        className={`text-sm font-medium px-3 py-1 rounded-full ${
                          imageUrls.length === 0
                            ? "bg-gray-100 text-gray-500"
                            : imageUrls.length <= 2
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {imageUrls.length}/5 photos
                      </span>
                    </div>

                    {/* Grille de photos améliorée */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {imageUrls.map((url, index) => (
                        <div
                          key={index}
                          className={`relative rounded-xl overflow-hidden h-32 shadow-md transition-all duration-300 hover:shadow-lg ${
                            profile_picture === url
                              ? "ring-3 ring-pink-400 ring-offset-1 transform scale-105"
                              : "border-2 border-gray-200 hover:border-pink-300"
                          } group`}
                        >
                          <img
                            src={url}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Badge photo principale */}
                          {profile_picture === url && (
                            <div className="absolute top-1 left-1 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                              <Star size={10} fill="white" />
                              Principale
                            </div>
                          )}

                          {/* Bouton de suppression */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemoveImage(index);
                            }}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 transform hover:scale-110"
                            title="Supprimer cette photo"
                          >
                            <span className="font-bold text-white">X</span>
                          </button>

                          {/* Bouton pour définir comme photo principale */}
                          <div className="absolute bottom-1 left-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (profile_picture !== url) {
                                  handleSetProfilePicture(index);
                                }
                              }}
                              disabled={profile_picture === url}
                              className={`w-full text-xs font-medium rounded-lg py-1.5 px-2 transition-all duration-200 ${
                                profile_picture === url
                                  ? "bg-pink-500 text-white cursor-not-allowed"
                                  : "bg-white/95 backdrop-blur text-pink-600 hover:bg-pink-50 border border-pink-200"
                              }`}
                            >
                              {profile_picture === url ? (
                                <div className="flex items-center justify-center gap-1">
                                  <Star size={10} fill="white" />
                                  Principale
                                </div>
                              ) : (
                                "Définir principale"
                              )}
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Zone d'ajout de photos compacte */}
                      {imageUrls.length < 5 && (
                        <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-pink-300 rounded-xl cursor-pointer hover:bg-pink-50 hover:border-pink-400 transition-all duration-300 group">
                          <div className="text-center">
                            <div className="bg-pink-100 p-2 rounded-full mb-2 group-hover:bg-pink-200 transition-colors mx-auto w-fit">
                              <Upload size={20} className="text-pink-500" />
                            </div>
                            <div className="text-sm font-medium text-pink-600 mb-1">
                              Ajouter une photo
                            </div>
                            <div className="text-xs text-gray-500">
                              JPG, PNG
                            </div>
                            <input
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
              )}
            </form>
          </CardContent>

          <CardFooter className="p-4 bg-gray-50 border-t border-pink-100 flex justify-between">
            {step > 1 ? (
              <button
                type="button"
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
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:shadow-md transition-all"
              >
                Continuer
              </button>
            ) : (
              <button
                type="button"
                onClick={sendForm}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:shadow-md transition-all flex items-center"
              >
                Terminer l'inscription
              </button>
            )}
          </CardFooter>
        </Card>

        {/* Footer stylé */}
        <div className="text-center mt-6 text-gray-400 text-xs">
          <p className="flex items-center justify-center gap-1">
            Fait avec{" "}
            <Heart size={12} className="text-pink-400" fill="currentColor" />{" "}
            pour vous
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
