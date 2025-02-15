import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Tous les champs sont requis.");
      return;
    }

    // Simuler une connexion réussie
    console.log("Connexion réussie avec :", { email, password });
    setError("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Connexion</h2>

        {error && <p className="mt-2 text-sm text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-4">
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="exemple@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 font-medium">Mot de passe</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 mt-6 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Se connecter
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Pas encore inscrit ? <a href="/Signup" className="text-blue-500 hover:underline">Créer un compte</a>
        </p>
      </div>
    </div>
  );
};

export default Login;