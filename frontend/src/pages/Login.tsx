import { useState } from "react";
import { useAuth } from "../context/auth";
import { useLocation } from "react-router-dom";

// import { set } from "date-fns";
// import { set } from "date-fns";
// import { Link } from "react-router-dom";

// import { button } from "./components/ui/button";
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "./components/ui/form";
// import { input } from "./components/ui/input";


const Login = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");


  const [error, setError] = useState("");
  const [online, setOnline] = useState(false);
  const [lastConnection, setLastConnection] = useState("");
  // const [firstname, setFirstname] = useState("");
  const { firstname, setFirstname } = useAuth();
  const { lastname, setLastname } = useAuth();
  const { age, setAge } = useAuth();
  const { gender, setGender } = useAuth();
  const { latitude, setLatitude } = useAuth();
  const { longitude, setLongitude } = useAuth();
  const { sexualPreference, setSexualPreference } = useAuth();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try{
      setOnline(true);
      lastConnection;
      setLastConnection(new Date().toISOString());
      const response = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password , online, lastConnection: new Date() }),
      });
      const data = await response.json();

        if (!response.ok) {
          console.error(data.message);
          setError(data.message);
        }

      if (!response.ok) {
        const data = await response.json();
        firstname;
        lastname;
        age;
        gender;
        latitude;
        longitude;
        sexualPreference;
        setFirstname(data.firstname);
        setLastname(data.lastname);
        setAge(data.age);
        setGender(data.gender);
        setLatitude(data.latitude);
        setLongitude(data.longitude);
        setSexualPreference(data.sexualPreference);
      }
      if (!email || !password) {
        setError("Tous les champs sont requis.");
        return;
      }
      localStorage.setItem("token", data.token);
      window.location.href = "/profil";
      console.log("Connexion réussie avec :", { email, password });
    } catch (error) {
      setError("Erreur lors de la connexion.");
    }
  };

  // return (
  //   <div className="flex items-center justify-center min-h-screen bg-gray-100">
  //     <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
  //       <h2 className="text-2xl font-bold text-center text-gray-800">Connexion</h2>

  //       {error && <p className="mt-2 text-sm text-red-500 text-center">{error}</p>}

  //       <form onSubmit={handleSubmit} className="mt-4">
  //         <div>
  //           <label className="block text-black font-medium">Email</label>
  //           <input
  //             type="email"
  //             className="text-black w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  //             placeholder="exemple@email.com"
  //             value={email}
  //             onChange={(e) => setEmail(e.target.value)}
  //           />
  //         </div>

  //         <div className="mt-4">
  //           <label className="block text-gray-700 font-medium">Mot de passe</label>
  //           <input
  //             type="password"
  //             className="text-black w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  //             placeholder="••••••••"
  //             value={password}
  //             onChange={(e) => setPassword(e.target.value)}
  //           />
  //         </div>
  //         <button type="submit" className="w-full px-4 py-2 mt-6 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300">
  //           Se connecter
  //         </button>
  //       </form>

  //       <p className="mt-4 text-sm text-center text-gray-600">
  //         Pas encore inscrit ? <a href="/Register" className="text-white-500 hover:underline">Créer un compte</a>
  //       </p>
  //     </div>
  //   </div>
  // );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Connexion</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                className="text-gray-800 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="exemple@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-gray-700 font-medium">Mot de passe</label>
              <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                Mot de passe oublié?
              </a>
            </div>
            <div className="relative">
              <input
                type="password"
                className="text-gray-800 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Se souvenir de moi
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition duration-200 hover:scale-105"
          >
            Se connecter
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Pas encore inscrit?{" "}
            <a href="/Register" className="font-medium text-blue-600 hover:text-blue-800 hover:underline">
              Créer un compte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;