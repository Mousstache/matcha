import { Link } from "react-router-dom";
import { Heart, User } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-pink-900 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center space-x-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="../img/logo.webp" alt="Logo" className="w-10 h-10 rounded-full" />
          <span className="text-white text-2xl font-serif">Matcha</span>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-6 text-white font-medium">
          <li className="hover">
            <Link to="/explore" className="flex items-center space-x-1">
              <Heart /> <span>Explorer</span>
            </Link>
          </li>
          <li className="hover">
            <Link to="/profil" className="flex items-center space-x-1">
              <User /> <span>Mon Profil</span>
            </Link>
          </li>
        </ul>

        {/* Boutons */}
        <div className="space-x-4">
          <Link to="/login" className="px-4 py-2 bg-white text-pink-500 rounded-lg font-bold hover:bg-gray-200 transition">
            Connexion
          </Link>
          <Link to="/signup" className="px-4 py-2 bg-yellow-400 text-white rounded-lg font-bold hover:bg-yellow-500 transition">
            Inscription
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
