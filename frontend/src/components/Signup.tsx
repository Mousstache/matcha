//import { Calendar } from "lucide-react";
import { Card, CardContent, CardTitle } from "./ui/card"
import { useState } from "react";
import useGeolocation from "../components/useGeolocation";
import useReverseGeolocation from "../components/useReverseGeolocation";

// import { useNavigate } from "react-router-dom";
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

    // const navigate = useNavigate();
    
    // const [email, setEmail] = useState('');
    // const [firstName, setFirstName] = useState('');
    // const [lastName, setLastName] = useState('');
    // const [password, setPassword] = useState('');
    const [gender, setGender] = useState('Non binaire');
    const [description, setDescription] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [preference, setPreference] = useState('Les deux');
    const [interests, setInterests] = useState<string[]>([]);
    const [interestError, setInterestError] = useState('');
    const [online, setOnline] = useState(false);
    const [lastConnection, setLastConnection] = useState("");

    const interestsList: Interest[] = [
        { id: "sports", label: "Sports" },
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
                    console.log(data)
                }
                // navigate(`/confirm-email?token=${data.confirmationToken}`);
            })
            // navigate("/confirm-email");
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
    
    return(
        <Card>
            <CardTitle> <h1>Inscription</h1> </CardTitle>
            <CardContent>
                <form onSubmit={sendForm} className="flex flex-col space-y-4">
                    <label>Gender :</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="text-black w-full px-4 py-2 border rounded-lg">
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                        <option value="Non binaire">Non binaire</option>
                    </select>

                    <label>Birth date :</label>
                    <input 
                        type='date' 
                        value={birthDate} 
                        onChange={(e) => setBirthDate(e.target.value)}
                        name='birthDate'
                        className="text-black w-full px-4 py-2 border rounded-lg"
                    />
                    
                    <label>description :</label>
                    <input type="description" value={description} onChange={(e) => setDescription(e.target.value)} className="text-black w-full px-4 py-2 border rounded-lg"></input>
                    
                    <label>préférence :</label>
                    <select value={preference} onChange={(e) => setPreference(e.target.value)} className="text-black w-full px-4 py-2 border rounded-lg">
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                        <option value="Les deux">Les deux</option>
                    </select>
                    
                    <label>Intérêts (maximum 3) :</label>
                    {interestError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                            {interestError}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                        {interestsList.map((interest) => (
                            <div key={interest.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={interest.id}
                                    checked={interests.includes(interest.id)}
                                    onChange={() => handleInterestChange(interest.id)}
                                    className="rounded"
                                />
                                <label
                                    htmlFor={interest.id}
                                    className="text-sm cursor-pointer"
                                >
                                    {interest.label}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="text-sm text-gray-500">
                        {interests.length}/3 intérêts sélectionnés
                    </div>

                    <div className="p-4 text-center">
                    <h1 className="text-2xl font-bold">🌍 Ma Localisation</h1>

                    {error ? (
                        <p className="text-red-500">❌ {error}</p>
                    ) : (
                        <>
                        <p>📍 Latitude: {latitude}</p>
                        <p>📍 Longitude: {longitude}</p>
                        </>
                    )}

                    {locationError ? (
                        <p className="text-red-500">❌ {locationError}</p>
                    ) : (
                        city && country && (
                        <p className="mt-2 text-lg font-semibold">
                            🏙️ {city}, {country}
                        </p>
                        )
                    )}
                    </div>

                                {/* <div className="location-section">
                    <h3>Localisation</h3>
                    
                    <div className="form-group">
                        <label>
                        <input
                            type="checkbox"
                            name="useAutomaticLocation"
                            checked={formData.useAutomaticLocation}
                            onChange={handleChange}
                        />
                        Utiliser ma position actuelle
                        </label>
                        
                        {formData.useAutomaticLocation && locationLoading && (
                        <p>Détection de votre position en cours...</p>
                        )}
                        
                        {formData.useAutomaticLocation && locationError && (
                        <p className="error">Erreur: {locationError}</p>
                        )}
                        
                        {formData.useAutomaticLocation && formData.latitude && (
                        <div className="detected-location">
                            <p>Position détectée:</p>
                            {formData.city && formData.country ? (
                            <p>{formData.city}, {formData.country}</p>
                            ) : (
                            <p>Lat: {formData.latitude.toFixed(6)}, Long: {formData.longitude.toFixed(6)}</p>
                            )}
                            <button type="button" className="button-secondary" onClick={getGeolocation}>
                            Actualiser ma position
                            </button>
                        </div>
                        )}
                    </div>
                    
                    {!formData.useAutomaticLocation && (
                        <>
                        <div className="form-group">
                            <label htmlFor="city">Ville</label>
                            <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="country">Pays</label>
                            <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            />
                        </div>
                        </>
                    )}
                    </div> */}

                    <button type="submit" className="text-white">S'inscrire</button>
                </form>
            </CardContent>
        </Card>
    )
}

export default Signup