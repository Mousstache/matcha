import { useNotifications } from "@/context/NotificationContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Heart, MessageCircle, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Typage de la notification
interface NotificationType {
  type: "like" | "message" | "match" | string;
  message: string;
  time?: string;
  read: boolean;
}

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

// Composant pour une notification individuelle
interface NotificationItemProps {
  notif: NotificationType;
  onRemove: () => void;
  animateOut: boolean;
  onNavigate: () => void;
}

const NotificationItem = ({ notif, onRemove, animateOut, onNavigate }: NotificationItemProps) => (
  <div
    className={`p-4 border-b border-pink-50 transition-all duration-300 cursor-pointer hover:bg-pink-25 ${
      animateOut ? "opacity-0 transform translate-x-full" : ""
    } ${notif.read ? "bg-white text-gray-500" : "bg-pink-50 border-l-4 border-l-pink-500"}`}
    onClick={onNavigate}
  >
    <div className="flex items-start">
      <div className="mr-3 mt-1 p-2 rounded-full bg-pink-100 flex-shrink-0">
        {getNotificationIcon(notif.type)}
      </div>
      <div className="flex-1">
        <p className={notif.read ? "" : "font-semibold text-gray-800"}>{notif.message}</p>
        <p className="text-xs text-gray-400 mt-1">{notif.time || "À l'instant"}</p>
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
  const { notifications, setNotifications } = useNotifications();
  const [animateOut, setAnimateOut] = useState<number | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    async function fetchNotifications() {
      // Remplace par l'ID utilisateur réel
      const userId = localStorage.getItem("user_id");
      if (!userId) return;
      const res = await fetch(`/api/notifications/${userId}`);
      const data = await res.json();
      // Limite à 10 notifications côté front aussi, par sécurité
      setNotifications(data.notifications.slice(0, 10));
    }
    fetchNotifications();
  }, [setNotifications]);


  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications((prev: NotificationType[]) => prev.map((n) => ({ ...n, read: true })));
  };

  // Supprimer une notification avec animation
  const removeNotification = (index: number) => {
    setAnimateOut(index);
    setTimeout(() => {
      setNotifications((prev: NotificationType[]) => prev.filter((_, i) => i !== index));
      setAnimateOut(null);
    }, 300);
  };

  // Naviguer vers la page home
  const handleNotificationClick = () => {
    navigate("/");
  };

  const unreadCount = notifications.filter((n: NotificationType) => !n.read).length;

  return (
    <div className="min-h-screen flex justify-center items-center w-full bg-gradient-to-br from-pink-50 via-fuchsia-50 to-purple-100">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden border border-pink-100 pt-0 pb-0 mt-[-360px]">
        <div className="bg-[#ec4899] px-6 py-5 flex items-center justify-between w-full">
          <div className="flex items-center">
            <Bell size={22} className="mr-2 text-white" />
            <span className="text-white text-lg font-semibold">Notifications</span>
          </div>
          {notifications.length > 0 && (
            <span className="bg-white text-pink-500 font-bold text-sm px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <CardContent className="p-0 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell size={32} className="mx-auto mb-3 text-pink-200" />
              <p>Aucune notification pour le moment</p>
              <p className="text-sm text-gray-500 mt-1">Continuez à explorer des profils!</p>
            </div>
          ) : (
            notifications.map((notif: NotificationType, i: number) => (
              <NotificationItem
                key={i}
                notif={notif}
                onRemove={() => removeNotification(i)}
                animateOut={animateOut === i}
                onNavigate={handleNotificationClick}
              />
            ))
          )}
        </CardContent>
        <CardFooter className="p-3 bg-gray-50 border-t border-pink-100">
          <Button
            onClick={markAllAsRead}
            className="w-full bg-[#ec4899] text-white hover:shadow-md transition-shadow"
            disabled={notifications.length === 0 || notifications.every((n: NotificationType) => n.read)}
          >
            Tout marquer comme lu
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Notification;
