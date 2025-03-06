import { Calendar } from "lucide-react";
import { Card, CardContent, CardTitle } from "./ui/card"
import { useState } from "react";
// import { Link } from "react-router-dom";


const Signup = () => {
    
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('1');
    const [password, setPassword] = useState('');
    const [description, setDescription] = useState('');
    const [preference, setPreference] = useState('1');
    const [age, setAge] = useState('');
    
    const sendForm = async (e:any) => {
        e.preventDefault();
        
        try{
            fetch('http://localhost:5000/api/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, firstName, lastName, gender, password, description, preference })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error)
                } else {
                    console.log(data)
                }
            })
            localStorage.setItem
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
                        <option value="1">Homme</option>
                        <option value="2">Femme</option>
                        <option value="3">Non binaire</option>
                    </select>

                    <label>age :</label>
                    <Calendar></Calendar>
                    <input type='date' placeholder='Enter BirthDate' value={age} onChange={(e) => setAge(e.target.value)}  name='birthdate'/>
                    
                    <label>Password :</label>
                    <input type="password" onChange={(e) => setPassword(e.target.value)}  className="text-black w-full px-4 py-2 border rounded-lg"></input>
                    
                    <label>description :</label>
                    <input type="description" value={description} onChange={(e) => setDescription(e.target.value)} className="text-black w-full px-4 py-2 border rounded-lg"></input>
                    
                    <label>préférence :</label>
                    <select value={preference} onChange={(e) => setPreference(e.target.value)} className="text-black w-full px-4 py-2 border rounded-lg">
                        <option value="1">Homme</option>
                        <option value="2">Femme</option>
                        <option value="3">Les deux</option>
                    </select>
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