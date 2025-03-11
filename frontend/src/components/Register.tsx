import { useState } from "react";
import { Card, CardContent, CardTitle } from "./ui/card"
import { useNavigate } from "react-router-dom"; 



const register = () => {

    const navigate = useNavigate();
    
    const[email, setEmail] = useState("");
    const[userName, setUserName] = useState("");
    const[firstName, setFirstName] = useState("");
    const[lastName, setLastName] = useState("");
    const[password, setPassword] = useState("");

    const sendForm = async (e:any) => {
        e.preventDefault();
        
        try{
            fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, userName, firstName, lastName, password}),
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
            navigate("/signup");
            // window.location.href = "/login";
        } catch (error) {
            console.error(error)
        }
    }


    return (
        <Card>
            <CardTitle><h2>Inscription</h2></CardTitle>
            <CardContent>
                <form onSubmit={sendForm} className="flex flex-col space-y-4">

                <label>email :</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-black w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="exemple@email.com"></input>
                
                <label className="space-between">UserName :</label>
                <input type="username" value={userName} onChange={(e) => setUserName(e.target.value)} className="text-black w-full px-4 py-2 border rounded-lg "></input>

                <label className="space-between">FirstName :</label>
                <input type="firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="text-black w-full px-4 py-2 border rounded-lg "></input>
                
                <label className="space-between">LastName :</label>
                <input type="lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} className="text-black w-full px-4 py-2 border rounded-lg "></input>

                <label>Password :</label>
                <input type="password" onChange={(e) => setPassword(e.target.value)}  className="text-black w-full px-4 py-2 border rounded-lg"></input>
                
                <button type="submit" className="text-white">S'inscrire</button>
                </form>
            </CardContent>

        </Card>
    )
}

export default register;