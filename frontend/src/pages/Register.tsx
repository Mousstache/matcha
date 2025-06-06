// import { useState } from "react";
// import { Card, CardContent, CardTitle } from "../../src/components/ui/card"
// import { useNavigate } from "react-router-dom"; 



// const register = () => {

//     const navigate = useNavigate();
    
//     const[email, setEmail] = useState("");
//     const[userName, setUserName] = useState("");
//     const[firstName, setFirstName] = useState("");
//     const[lastName, setLastName] = useState("");
//     const[password, setPassword] = useState("");

//     const sendForm = async (e:any) => {
//         e.preventDefault();
        
//         try{
//             fetch('http://localhost:5001/api/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ email, userName, firstName, lastName, password}),
//             })
//             .then(response => response.json())
//             .then(data => {
//                 localStorage.setItem("token", data.token);
//                 if (data.error) {
//                     console.error(data.error)
//                 } else {
//                     console.log(data)
//                 }
//             })
//             localStorage.setItem
//             navigate("/signup");
//             // window.location.href = "/login";
//         } catch (error) {
//             console.error(error)
//         }
//     }


//     return (
//         <Card>
//             <CardTitle><h2>Inscription</h2></CardTitle>
//             <CardContent>
//                 <form onSubmit={sendForm} className="flex flex-col space-y-4">

//                 <label>email :</label>
//                 <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-black w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="exemple@email.com"></input>
                
//                 <label className="space-between">UserName :</label>
//                 <input type="username" value={userName} onChange={(e) => setUserName(e.target.value)} className="text-black w-full px-4 py-2 border rounded-lg "></input>

//                 <label className="space-between">FirstName :</label>
//                 <input type="firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="text-black w-full px-4 py-2 border rounded-lg "></input>
                
//                 <label className="space-between">LastName :</label>
//                 <input type="lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} className="text-black w-full px-4 py-2 border rounded-lg "></input>

//                 <label>Password :</label>
//                 <input type="password" onChange={(e) => setPassword(e.target.value)}  className="text-black w-full px-4 py-2 border rounded-lg"></input>
                
//                 <button type="submit" className="text-white">S'inscrire</button>
//                 </form>
//             </CardContent>

//         </Card>
//     )
// }

// export default register;



import { useState } from "react";
import { Card, CardContent, CardTitle, CardFooter } from "../../src/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Heart, Mail, User, Key, UserCircle, Users } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !userName) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    setError("");
    setStep(2);
  };

  const sendForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch('http://localhost:5001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, userName, firstName, lastName, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error(data.message);
        setError(data.message);
        setLoading(false);
      } else {
        localStorage.setItem("token", data.token);
        // navigate("/confirm-email");
      }
    } catch (error) {
      console.error(error);
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-4">
            <Heart size={32} fill="white" className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Commencez votre nouvelle histoire</h1>
          <p className="text-gray-600 mt-2">Créez votre compte et trouvez l'amour</p>
        </div>
        
        <Card className="bg-white shadow-xl border-pink-100 overflow-hidden rounded-xl">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4">
            <CardTitle className="text-white text-center flex justify-center items-center gap-2">
              <Heart fill="white" size={20} />
              <h2>Inscription</h2>
            </CardTitle>
          </div>
          
          <CardContent className="p-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            
            {step === 1 ? (
              <form onSubmit={handleNext} className="flex flex-col space-y-5">
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2 border border-pink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50/30" 
                      placeholder="exemple@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Nom d'utilisateur</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="text" 
                      value={userName} 
                      onChange={(e) => setUserName(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2 border border-pink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50/30" 
                      placeholder="Votre pseudo"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition duration-300"
                >
                  Continuer
                </button>
                
                <div className="text-center mt-4">
                  <p className="text-gray-600 text-sm">
                    Déjà un compte ?{" "}
                    <a href="/login" className="text-pink-500 hover:underline">
                      Connectez-vous
                    </a>
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={sendForm} className="flex flex-col space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Prénom</label>
                    <div className="relative">
                      <UserCircle size={18} className="absolute left-3 top-3 text-gray-400" />
                      <input 
                        type="text" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        className="w-full pl-10 pr-4 py-2 border border-pink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50/30" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">Nom</label>
                    <div className="relative">
                      <Users size={18} className="absolute left-3 top-3 text-gray-400" />
                      <input 
                        type="text" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                        className="w-full pl-10 pr-4 py-2 border border-pink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50/30" 
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1 font-medium">Mot de passe</label>
                  <div className="relative">
                    <Key size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full pl-10 pr-4 py-2 border border-pink-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50/30" 
                      placeholder="••••••••••"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Au moins 8 caractères avec lettres et chiffres</p>
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 border border-pink-300 text-pink-500 rounded-lg font-medium hover:bg-pink-50 transition duration-300"
                  >
                    Retour
                  </button>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-2/3 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition duration-300 flex items-center justify-center"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Inscription...
                      </span>
                    ) : (
                      "S'inscrire"
                    )}
                  </button>
                </div>
              </form>
            )}
          </CardContent>
          
          <CardFooter className="p-4 text-center text-xs text-gray-500 bg-gray-50 border-t border-pink-100">
            En vous inscrivant, vous acceptez nos <a href="#" className="text-pink-500 hover:underline">Conditions d'utilisation</a> et notre <a href="#" className="text-pink-500 hover:underline">Politique de confidentialité</a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
