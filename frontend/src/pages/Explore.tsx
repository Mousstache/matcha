import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Heart, X, SlidersHorizontal, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import UserProfilModal from "@/components/UserProfilModal";

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

interface FilterSectionProps {
  form: any;
  minAge: number;
  maxAge: number;
  distance: number;
  fame_rate: number;
  interestsList: Interest[];
  onAgeChange: (values: number[]) => void;
  onDistanceChange: (values: number[]) => void;
  onFameChange: (values: number[]) => void;
  onInterestChange: (values: string[]) => void;
  onApplyFilters: (data: FilterFormValues) => void;
  className?: string;
}

// Composant FilterSection factorisé
const FilterSection: React.FC<FilterSectionProps> = ({
  form,
  minAge,
  maxAge,
  distance,
  fame_rate,
  interestsList,
  onAgeChange,
  onDistanceChange,
  onFameChange,
  onInterestChange,
  onApplyFilters,
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg border border-pink-100 p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="h-5 w-5 text-[#ec4899]" />
        <h3 className="text-[#ec4899] text-xl font-bold">Filtres de recherche</h3>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onApplyFilters)} className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="ageRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-semibold text-base">
                  Âge : <span className="text-[#ec4899] font-bold">{minAge} - {maxAge}</span> ans
                </FormLabel>
                <FormControl>
                  <Slider
                    onValueChange={(values) => {
                      field.onChange(values);
                      onAgeChange(values);
                    }}
                    value={field.value}
                    max={100}
                    min={18}
                    step={1}
                    className="mt-4"
                    style={{
                      height: 6,
                      background: "#fce7f3",
                      borderRadius: 6,
                      boxShadow: "none",
                    }}
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
                <FormLabel className="text-gray-700 font-semibold text-base">
                  Distance : <span className="text-[#ec4899] font-bold">{distance}</span> km
                </FormLabel>
                <FormControl>
                  <Slider
                    onValueChange={(values) => {
                      field.onChange(values);
                      onDistanceChange(values);
                    }}
                    value={field.value}
                    max={5000}
                    min={1}
                    step={10}
                    className="mt-4"
                    style={{
                      height: 6,
                      background: "#fce7f3",
                      borderRadius: 6,
                      boxShadow: "none",
                    }}
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
                <FormLabel className="text-gray-700 font-semibold text-base">Intérêts communs</FormLabel>
                <FormControl>
                  <div
                    className="max-h-40 overflow-y-auto border border-pink-200 rounded-md p-2 space-y-2 bg-white custom-scrollbar"
                    style={{ scrollbarWidth: "thin" }}
                  >
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
                            onInterestChange(newValues);
                          }}
                          className="mr-2 w-4 h-4 rounded border-2 border-[#ec4899] checked:bg-[#ec4899] checked:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899] transition-all duration-200"
                          style={{
                            accentColor: "#ec4899",
                          }}
                        />
                        <label htmlFor={`interest-${interest.id}`} className="cursor-pointer text-gray-700 hover:text-[#ec4899] select-none">
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
                <FormLabel className="text-gray-700 font-semibold text-base">
                  Fame_rate Rate : <span className="text-[#ec4899] font-bold">{fame_rate}</span>
                </FormLabel>
                <FormControl>
                  <Slider
                    onValueChange={(values) => {
                      field.onChange(values);
                      onFameChange(values);
                    }}
                    value={field.value}
                    max={5000}
                    min={1}
                    step={1}
                    className="mt-4"
                    style={{
                      height: 6,
                      background: "#fce7f3",
                      borderRadius: 6,
                      boxShadow: "none",
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Rayon de recherche autour de votre position
                </FormDescription>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-[#ec4899] hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all duration-300 mt-2"
          >
            Appliquer les filtres
          </Button>
        </form>
      </Form>
    </div>
  );
};

const Explore = () => {
  const { id, sexualPreference, gender, longitude, latitude, socket, firstname } = useAuth();
  
  // States for profiles and current profile view
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [direction, setDirection] = useState('');
  
  // Default filter values
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(40);
  const [distance, setDistance] = useState(50);
  const [fame_rate, setFame] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

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

  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Create form with react-hook-form
  const form = useForm<FilterFormValues>({
    defaultValues: {
      ageRange: [minAge, maxAge],
      distance: [distance],
      fame_rate: [fame_rate],
      interests: [],
    },
  });

  const currentProfile: Profile | null = profiles[currentProfileIndex] ?? null;

  useEffect(() => {
    form.reset({
      ageRange: [minAge, maxAge],
      distance: [distance],
      fame_rate: [fame_rate],
      interests: [],
    });
  }, [minAge, maxAge, distance, fame_rate]);

  const handleAgeChange = (values: number[]) => {
    setMinAge(values[0]);
    setMaxAge(values[1]);
  };

  const handleDistanceChange = (values: number[]) => {
    setDistance(values[0]);
  };

  const handleFameChange = (values: number[]) => {
    setFame(values[0]);
  };

  const handleInterestChange = (values: string[]) => {
    setInterests(values);
    console.log("Valeurs des intérêts sélectionnés>> :", values);
  };

  const markViewed = async (viewed_id: string) => {
    try {
      const viewedId = viewed_id;
      const viewerId = id;
      console.log("l'id du mec que je regarde", viewedId);
      const res = await fetch('http://localhost:5001/api/record-profile-view', {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ viewedId, viewerId }),
      });
      if (!res) return;
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async (profileId: string) => {
    try {
      const liked_id = profileId;
      const liker_id = id;
      const res = await fetch('http://localhost:5001/api/likeUser', {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ liked_id, liker_id }),
      });
      if (!res) return;
      
      const notif_like = {
        userId: liked_id,
        type: "like",
        message: `📩 Nouveau like de ${firstname}`
      };
      if (socket) {
        socket.emit("SEND_NOTIFICATION", notif_like);
      }
      markViewed(profileId);
    } catch (error) {
      console.error(error);
    }
    setDirection('right');
    setTimeout(() => {
      setCurrentProfileIndex((prev) => (prev + 1) % profiles.length);
      setDirection('');
    }, 300);
  };

  const handleDislike = async (profileId: string) => {
    try {
      const liked_id = profileId;
      const liker_id = id;
      const res = await fetch('http://localhost:5001/api/dislikeUser', {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ liked_id, liker_id }),
      });
      if (!res) return;
      markViewed(profileId);
    } catch (error) {
      console.error(error);
    }
    setDirection('left');
    setTimeout(() => {
      setCurrentProfileIndex((prev) => (prev + 1) % profiles.length);
      setDirection('');
    }, 300);
  };

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
          fame_rate: fame_rate,
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
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const applyFilters = (data: FilterFormValues) => {
    setMinAge(data.ageRange[0]);
    setMaxAge(data.ageRange[1]);
    setDistance(data.distance[0]);
    getUsers();
  };

  const handleUserClick = (user: any) => {
    console.log("User clicked:", user);
    setSelectedUser(user);
    setIsModalOpen(true);
    handleConsult(user.id);
  };

  const handleConsult = async (viewed_id: string) => {
    try {
      const viewedId = viewed_id;
      const viewerId = id;
      console.log("l'id du mec que je regarde", viewedId);
      const res = await fetch('http://localhost:5001/api/ConsultProfile', {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ viewedId, viewerId }),
      });

      const notif_seen = {
        userId: viewed_id,
        type: "like",
        message: `📩 ${firstname} a consulter votre profil`
      };
      if (socket) {
        socket.emit("SEND_NOTIFICATION", notif_seen);
      }
      if (!res) return;
    } catch (error) {
      console.error(error);
    }
  };

  const interestsArray =
    typeof currentProfile?.interests === "string"
      ? (currentProfile.interests as string).split(",").map((i: string) => i.trim())
      : Array.isArray(currentProfile?.interests)
      ? currentProfile.interests
      : [];

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-purple-100 py-8 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            <span className="text-[#ec4899]">
              Explorer
            </span>
          </h1>
          
          {/* Bouton filtres pour mobile */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button className="bg-white hover:bg-pink-50 text-pink-600 p-2 rounded-full shadow-md transition-all duration-300">
                  <SlidersHorizontal className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="max-w-md w-full p-8 rounded-l-2xl shadow-2xl bg-white flex flex-col gap-6 border-l-4 border-[#ec4899]"
              >
                <SheetHeader>
                  <SheetTitle className="text-[#ec4899] text-2xl font-bold text-center mb-2">Filtres de recherche</SheetTitle>
                  <SheetDescription className="text-gray-500 text-center mb-4">
                    Configurez vos préférences pour trouver votre match idéal
                  </SheetDescription>
                </SheetHeader>
                <FilterSection
                  form={form}
                  minAge={minAge}
                  maxAge={maxAge}
                  distance={distance}
                  fame_rate={fame_rate}
                  interestsList={interestsList}
                  onAgeChange={handleAgeChange}
                  onDistanceChange={handleDistanceChange}
                  onFameChange={handleFameChange}
                  onInterestChange={handleInterestChange}
                  onApplyFilters={applyFilters}
                  className="border-0 shadow-none p-0"
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section des filtres - visible sur desktop seulement */}
          <div className="hidden lg:block lg:col-span-1">
            <FilterSection
              form={form}
              minAge={minAge}
              maxAge={maxAge}
              distance={distance}
              fame_rate={fame_rate}
              interestsList={interestsList}
              onAgeChange={handleAgeChange}
              onDistanceChange={handleDistanceChange}
              onFameChange={handleFameChange}
              onInterestChange={handleInterestChange}
              onApplyFilters={applyFilters}
              className="sticky top-4"
            />
          </div>

          {/* Section des profils */}
          <div className="lg:col-span-2">
            {!hasSearched ? (
              <div className="text-center p-12 bg-white shadow-lg rounded-xl border border-pink-100">
                <div className="mb-6">
                  <Heart className="mx-auto h-16 w-16 text-pink-200" />
                  <p className="mt-4 text-gray-500 text-lg">
                    Commencez votre recherche !
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Configurez vos filtres et cliquez sur "Appliquer les filtres" pour découvrir des profils
                  </p>
                </div>
              </div>
            ) : profiles.length === 0 ? (
              <div className="text-center p-12 bg-white shadow-lg rounded-xl border border-pink-100">
                <div className="mb-6">
                  <Heart className="mx-auto h-16 w-16 text-pink-200" />
                  <p className="mt-4 text-gray-500 text-lg">
                    Aucun profil à afficher pour le moment
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Ajustez vos filtres pour élargir votre recherche
                  </p>
                </div>
              </div>
            ) : (
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
                      {currentProfile.firstname}, {currentProfile.age} ans
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
            )}
          </div>
        </div>

        <UserProfilModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={selectedUser}
        />
      </div>
    </div>
  );
};

export default Explore;