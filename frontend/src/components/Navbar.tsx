import { Link } from "react-router-dom";
import { Heart, User, Bell, LogOut } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { Button, Badge, Avatar, Navbar as HeroNavbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@heroui/react";
import { useState } from "react";

const Navbar = () => {
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter((n: any) => !n.read).length;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <HeroNavbar 
      isBlurred
      className="bg-gradient-to-r from-pink-500 via-pink-400 to-purple-400"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          className="sm:hidden text-white"
        />
        <NavbarBrand>
          <Link to="/" className="flex items-center gap-2">
            <Avatar size="lg">
              <img src="/logo.webp" alt="Logo" className="w-12 h-12 rounded-full shadow-lg border-2 border-white" />
            </Avatar>
            <span className="text-white text-3xl font-serif tracking-wide drop-shadow">Matcha</span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link to="/explore">
            <Button 
              variant="ghost" 
              size="md" 
              className="flex items-center gap-2 text-white hover:bg-white/20 active:bg-white/30"
            >
              <Heart size={20} />
              Explorer
            </Button>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/profil">
            <Button 
              variant="ghost" 
              size="md" 
              className="flex items-center gap-2 text-white hover:bg-white/20 active:bg-white/30"
            >
              <User size={20} />
              Mon Profil
            </Button>
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link to="/notification" className="relative">
            <Button 
              variant="ghost" 
              size="md" 
              className="flex items-center gap-2 text-white hover:bg-white/20 active:bg-white/30"
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
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            size="md" 
            className="flex items-center gap-2 text-white hover:bg-white/20 active:bg-white/30"
            title="Se déconnecter"
          >
            <LogOut size={20} />
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-gradient-to-b from-pink-500/90 to-purple-400/90">
        <NavbarMenuItem>
          <Link to="/explore" className="w-full text-white">
            <div className="flex items-center gap-2">
              <Heart size={20} />
              Explorer
            </div>
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link to="/profil" className="w-full text-white">
            <div className="flex items-center gap-2">
              <User size={20} />
              Mon Profil
            </div>
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link to="/notification" className="w-full text-white">
            <div className="flex items-center gap-2">
              <Bell size={20} />
              Notification
              {unreadCount > 0 && (
                <Badge color="danger" className="animate-bounce">
                  {unreadCount}
                </Badge>
              )}
            </div>
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </HeroNavbar>
  );
};

export default Navbar;