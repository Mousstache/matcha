import { Link } from "react-router-dom";
import { Heart, User, Mail } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

const Navbar = () => {
  
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter((n:any) => !n.read).length;
  const handleLogout = async () => {

    const token = localStorage.getItem("token");
  
    await fetch("http://localhost:5001/api/logout", {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}` },
      body : JSON.stringify({ online: false })
    });
  
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-pink-900 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center space-x-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="logo.webp" alt="Logo" className="w-10 h-10 rounded-full" />
          <span className="text-white text-2xl font-serif">Matcha</span>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-6 text-white font-medium">
          <li className="hover">
            <Link to="/explore" className="flex items-center space-x-1">
              <button className="flex items-center space-x-1">
              <Heart /> <span>Explorer</span>
              </button>
            </Link>
          </li>
          <li className="hover">
            <Link to="/profil" className="flex items-center space-x-1">
              <button className="flex items-center space-x-1">
                <User /> <span>Mon Profil</span>
              </button>
            </Link>
          </li>
          <li className="hover">
                <div className="relative">
                    <button className="flex items-center space-x-1">
                        {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    <Link to="/notification" className="flex items-center space-x-1">
                      <Mail /> <span>Mes notif</span>
                    </Link>
                    </button>
                </div>
          </li>
        </ul>

        {/* Boutons */}
        <div className="space-x-4">
          <button  onClick={handleLogout} className="px-4 py-2 bg-white text-pink-500 rounded-lg font-bold hover:bg-gray-200 transition">
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
