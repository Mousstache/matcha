// filepath: /Users/mouslimaptievitch.mourdalov/matcha/frontend/src/pages/Notification.tsx
import {
  useNotifications,
  NotificationType,
} from "@/context/NotificationContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Heart, MessageCircle, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Fonction utilitaire pour l'icône
const getNotificationIcon = (type: string) => {
  switch (type) {
    case "like":
      return <Heart size={18} className="text-pink-500" />;
    case "message":
      return <MessageCircle size={18} className="text-purple-500" />;
    case "match":
      return <Heart size={18} className="text-pink-500" fill="currentColor" />;
    default:
      return <Bell size={18} className="text-blue-500" />;
  }
};

// Fonction utilitaire pour formater les timestamps
const formatNotificationTime = (
  timestamp: Date | string | undefined
): string => {
  if (!timestamp) return "À l'instant";

  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;

  // Vérifier si c'est une date valide
  if (isNaN(date.getTime())) return "À l'instant";

  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // Moins d'une minute
  if (diff < 60000) {
    return "À l'instant";
  }

  // Moins d'une heure
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `Il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
  }

  // Moins d'un jour
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `Il y a ${hours} heure${hours > 1 ? "s" : ""}`;
  }

  // Moins d'une semaine
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `Il y a ${days} jour${days > 1 ? "s" : ""}`;
  }

  // Format de date standard
  return date.toLocaleDateString("fr-FR");
};

// Composant pour une notification individuelle
interface NotificationItemProps {
  notif: NotificationType;
  onRemove: () => void;
  animateOut: boolean;
  onNavigate: () => void;
}

const NotificationItem = ({
  notif,
  onRemove,
  animateOut,
  onNavigate,
}: NotificationItemProps) => (
  <div
    className={`p-4 border-b border-pink-50 transition-all duration-300 cursor-pointer hover:bg-pink-25 ${
      animateOut ? "opacity-0 transform translate-x-full" : ""
    } ${
      notif.read
        ? "bg-white text-gray-500"
        : "bg-pink-50 border-l-4 border-l-pink-500"
    }`}
    onClick={onNavigate}
  >
    <div className="flex items-start">
      <div className="mr-3 mt-1 p-2 rounded-full bg-pink-100 flex-shrink-0">
        {getNotificationIcon(notif.type)}
      </div>
      <div className="flex-1">
        <p className={notif.read ? "" : "font-semibold text-gray-800"}>
          {notif.message}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {formatNotificationTime(notif.timestamp)}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="text-gray-400 hover:text-pink-500 p-1"
      >
        <Check size={16} />
      </button>
    </div>
  </div>
);

const Notification = () => {
  const notificationContext = useNotifications();
  // Utilisation sécurisée du contexte avec vérification de nullité
  const notifications = notificationContext?.notifications || [];
  const setNotifications = notificationContext?.setNotifications || (() => {});
  const [animateOut, setAnimateOut] = useState<number | null>(null);
  const navigate = useNavigate();
  
  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5; // Nombre de notifications par page
  
  // Calcul des index pour la pagination
  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);
  const totalPages = Math.ceil(notifications.length / notificationsPerPage);
  
  // Fonction pour changer de page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications((prev: NotificationType[]) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  // Supprimer une notification avec animation
  const removeNotification = (index: number) => {
    // Calculer l'index réel dans le tableau complet
    const realIndex = indexOfFirstNotification + index;
    setAnimateOut(realIndex);
    setTimeout(() => {
      setNotifications((prev: NotificationType[]) => {
        const updatedNotifications = prev.filter((_, i) => i !== realIndex);
        
        // Ajuster la page si nécessaire après suppression
        const newTotalPages = Math.ceil(updatedNotifications.length / notificationsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
        
        return updatedNotifications;
      });
      setAnimateOut(null);
    }, 300);
  };

  // Naviguer vers la page home
  const handleNotificationClick = () => {
    navigate("/");
  };

  const unreadCount = notifications.filter(
    (n: NotificationType) => !n.read
  ).length;

  return (
    <div className="min-h-screen flex justify-center items-start pt-16 pb-16 w-full bg-gradient-to-br from-pink-50 via-fuchsia-50 to-purple-100">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden border border-pink-100 pt-0 pb-0">
        <div className="bg-[#ec4899] px-6 py-3 flex items-center justify-between w-full">
          <div className="flex items-center">
            <Bell size={20} className="mr-2 text-white" />
            <span className="text-white text-base font-semibold">
              Notifications
            </span>
          </div>
          {notifications.length > 0 && (
            <span className="bg-white text-pink-500 font-bold text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <CardContent className="p-0 overflow-y-auto" style={{ maxHeight: notifications.length > 0 ? '450px' : 'auto' }}>
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Bell size={32} className="mx-auto mb-3 text-pink-200" />
              <p>Aucune notification pour le moment</p>
              <p className="text-sm text-gray-500 mt-1">
                Continuez à explorer des profils!
              </p>
            </div>
          ) : (
            <>
              {currentNotifications.map((notif: NotificationType, i: number) => (
                <NotificationItem
                  key={i}
                  notif={notif}
                  onRemove={() => removeNotification(i)}
                  animateOut={animateOut === (indexOfFirstNotification + i)}
                  onNavigate={handleNotificationClick}
                />
              ))}
            </>
          )}
        </CardContent>
        
        {/* Contrôles de pagination toujours visibles si plus d'une page */}
        {notifications.length > notificationsPerPage && (
          <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-t border-pink-100">
            <Button 
              onClick={prevPage}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="flex items-center text-pink-500"
            >
              <ChevronLeft size={16} className="mr-1" />
              Précédent
            </Button>
            <span className="text-sm text-gray-500">
              Page {currentPage} sur {totalPages}
            </span>
            <Button 
              onClick={nextPage}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="flex items-center text-pink-500"
            >
              Suivant
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        )}
        
        <CardFooter className="p-2 bg-gray-50 border-t border-pink-100">
          <Button
            onClick={markAllAsRead}
            size="sm"
            className="w-full bg-[#ec4899] text-white hover:shadow-md transition-shadow text-sm"
            disabled={
              notifications.length === 0 ||
              notifications.every((n: NotificationType) => n.read)
            }
          >
            Tout marquer comme lu
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Notification;
