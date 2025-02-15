import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-red-300 p-2 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Matcha</h1>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:underline">Accueil</Link>
          </li>
          <li>
            <Link to="/login" className="hover:underline">Connexion</Link>
          </li>
          <li>
            <Link to="/about" className="hover:underline">À propos</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;