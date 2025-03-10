//import { Calendar } from "lucide-react";
import { Card, CardContent, CardTitle } from "./ui/card"
import { useState } from "react";
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
    
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('Non binaire');
    const [password, setPassword] = useState('');
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
            // Retirer l'intérêt s'il est déjà sélectionné
            setInterests(interests.filter(item => item !== id));
        } else {
            // Ajouter l'intérêt s'il n'est pas déjà sélectionné et moins de 3 intérêts
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
            console.log(new Date().toISOString().split('T')[0]);
            const userAge = calculateAge(birthDate);
            console.log("Âge calculé:", userAge);
            fetch('http://localhost:5000/api/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, firstName, lastName, gender, password, description, preference, birthDate, age: userAge, interests }),
            })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem("token", data.token);
                if (data.error) {
                    console.error(data.error)
                } else {
                    console.log(data)
                }
            })
            localStorage.setItem
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
                    <label>email :</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-black w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="exemple@email.com"></input>
                    
                    <label className="space-between">FirstName :</label>
                    <input type="firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="text-black w-full px-4 py-2 border rounded-lg "></input>
                    
                    <label className="space-between">LastName :</label>
                    <input type="lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} className="text-black w-full px-4 py-2 border rounded-lg "></input>
                    
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
                    {/* <input type='date' placeholder='Enter BirthDate' value={age} onChange={(e) => setAge(e.target.value)}  name='birthdate'/> */}
                    
                    <label>Password :</label>
                    <input type="password" onChange={(e) => setPassword(e.target.value)}  className="text-black w-full px-4 py-2 border rounded-lg"></input>
                    
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

                    {/* <label>Intérêts :</label> */}
                    {/* <Link to="/profil"> */}
                        <button type="submit" className="text-white">S'inscrire</button>
                    {/* </Link> */}
                </form>
            </CardContent>
        </Card>
    )
}

export default Signup