import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, User, Bell, HeartIcon, Menu, X, LogOut } from "lucide-react";

type LucideIcon = React.ComponentType<{ size?: number; className?: string }>;
type CustomIcon = (props: { isActive: boolean }) => React.ReactElement;
type IconComponent = LucideIcon | CustomIcon;
const isLucideIcon = (icon: IconComponent): icon is LucideIcon => {
  return icon === LayoutDashboard || icon === User;
};

// Configuration de la navigation
const navItems: { name: string; to: string; icon: IconComponent }[] = [
  { 
    name: "Dashboard", 
    to: "/", 
    icon: LayoutDashboard 
  },
  { 
    name: "Explorer", 
    to: "/explore", 
    icon: ({ isActive }: { isActive: boolean }) => (
      <span className="relative flex items-center">
        <HeartIcon 
          fill={isActive ? "white" : "#ec4899"} 
          stroke={isActive ? "white" : "#ec4899"} 
          className="mr-2 w-5 h-5 animate-pulse" 
        />
        <span className="absolute inline-flex h-2/3 w-2/3 animate-ping rounded-full bg-pink-400 opacity-30" />
      </span>
    ) 
  },
  { 
    name: "Mon Profil", 
    to: "/profil", 
    icon: User 
  },
];

// Composant Navbar
const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fonction de déconnexion
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    await fetch("http://localhost:5001/api/logout", {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ online: false })
    });
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const renderIcon = (Icon: IconComponent, isActive: boolean) => {
    if (isLucideIcon(Icon)) {
      return <Icon size={18} className="mr-2" />;
    }
    return <Icon isActive={isActive} />;
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-pink-500 tracking-wide font-poppins select-none">
              Matcha
            </span>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex space-x-4 -ml-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`
                    flex items-center px-4 py-2 rounded-lg font-medium text-base shadow 
                    transition-all duration-200 font-poppins focus:outline-none focus:ring-2 
                    focus:ring-pink-300
                    ${isActive 
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg" 
                      : "bg-white text-gray-600 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white hover:shadow-lg"
                    }
                  `}
                >
                  {renderIcon(item.icon, isActive)}
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Bouton Notification */}
            <Link
              to="/notification"
              title="Notifications"
              className="rounded-full hover:bg-gray-100 transition text-pink-500 border border-pink-100 shadow flex items-center justify-center w-8 h-8"
            >
              <Bell className="h-5 w-5" />
            </Link>
            <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center font-bold text-pink-500 font-poppins shadow">
              M
            </div>
            <button
              onClick={handleLogout}
              title="Se déconnecter"
              className="rounded-full hover:bg-gray-100 transition text-pink-500 border border-pink-100 shadow"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
            {/* Bouton Menu Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-pink-500 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center px-4 py-3 rounded-lg font-medium text-base
                      transition-all duration-200 font-poppins
                      ${isActive 
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white" 
                        : "text-gray-600 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white"
                      }
                    `}
                  >
                    {renderIcon(item.icon, isActive)}
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;