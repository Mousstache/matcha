import { Link } from "react-router-dom";
import { Heart, User, Bell, LogOut } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { Button, Badge, Avatar } from "@heroui/react";

const Navbar = () => {
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    await fetch("http://localhost:5001/api/logout", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ online: false }),
    });
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-gradient-to-r from-pink-500 via-pink-400 to-purple-400 p-4 shadow-lg w-full">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Avatar size="lg">
            <img src="/logo.webp" alt="Logo" className="w-12 h-12 rounded-full shadow-lg border-2 border-white" />
          </Avatar>
          <span className="text-white text-3xl font-serif tracking-wide drop-shadow">Matcha</span>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex gap-3 text-white font-semibold items-center">
          <li>
            <Link to="/explore">
              <Button 
                variant="ghost" 
                size="md" 
                className="flex items-center gap-2 text-white hover:bg-white/20 active:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 px-4"
              >
                <Heart size={20} />
                Explorer
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/profil">
              <Button 
                variant="ghost" 
                size="md" 
                className="flex items-center gap-2 text-white hover:bg-white/20 active:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 px-4"
              >
                <User size={20} />
                Mon Profil
              </Button>
            </Link>
          </li>
          <li>
            <Link to="/notification" className="relative">
              <Button 
                variant="ghost" 
                size="md" 
                className="flex items-center gap-2 text-white hover:bg-white/20 active:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 px-4"
              >
                <Bell size={20} />
                <span className="text-white">Notification</span>
                {unreadCount > 0 && (
                  <Badge color="danger" className="absolute -top-2 -right-2 animate-bounce">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </li>
        </ul>

        {/* Bouton logout */}
        <div className="ml-4">
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            size="md" 
            className="flex items-center gap-2 text-white hover:bg-white/20 active:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 px-4"
            title="Se déconnecter"
          >
            <LogOut size={20} />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;