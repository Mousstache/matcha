import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { addToast } from "@/utils/toast";

// Définir une interface pour les notifications
export interface NotificationType {
  type: "like" | "message" | "match" | string;
  message: string;
  time?: string;
  read: boolean;
  id: number;
  timestamp: Date;
}

interface NotificationContextType {
  notifications: NotificationType[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationType[]>>;
}

// Nombre maximum de notifications à conserver
const MAX_NOTIFICATIONS = 20;

const NotificationContext = createContext<NotificationContextType | null>(null);
export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Récupérer les notifications depuis le localStorage au démarrage
  const getInitialNotifications = (): NotificationType[] => {
    try {
      const storedNotifications = localStorage.getItem("userNotifications");
      if (storedNotifications) {
        return JSON.parse(storedNotifications);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
    }
    return [];
  };

  const [notifications, setNotifications] = useState<NotificationType[]>(
    getInitialNotifications()
  );
  const { socket } = useAuth();
  const location = useLocation();

  // Effet pour sauvegarder les notifications dans localStorage quand elles changent
  useEffect(() => {
    try {
      // Limiter le nombre de notifications à MAX_NOTIFICATIONS
      const limitedNotifications = notifications.slice(0, MAX_NOTIFICATIONS);
      localStorage.setItem(
        "userNotifications",
        JSON.stringify(limitedNotifications)
      );
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des notifications:", error);
    }
  }, [notifications]);

  useEffect(() => {
    if (!socket) return;

    socket.on("RECEIVE_NOTIFICATION", (notification) => {
      setNotifications((prev) => {
        const newNotif = {
          ...notification,
          id: Date.now(),
          timestamp: new Date(),
          read: false,
        };
        // Ajouter au début pour afficher les plus récentes en premier
        const updatedNotifs = [newNotif, ...prev];
        // Limiter le nombre de notifications
        return updatedNotifs.slice(0, MAX_NOTIFICATIONS);
      });
    });

    // Nouvelle notification pour les matches
    socket.on("match", (matchData) => {
      setNotifications((prev) => {
        const newNotif = {
          ...matchData,
          id: Date.now(),
          timestamp: new Date(),
          read: false,
        };
        // Ajouter au début pour afficher les plus récentes en premier
        const updatedNotifs = [newNotif, ...prev];
        // Limiter le nombre de notifications
        return updatedNotifs.slice(0, MAX_NOTIFICATIONS);
      });

      // Afficher un toast spécial pour les matches
      addToast({
        title: "🎉 Nouveau match !",
        description: matchData.message,
        color: "success",
      });
    });

    // Nouvelle notification pour les likes
    socket.on("like", (likeData) => {
      setNotifications((prev) => {
        const newNotif = {
          ...likeData,
          id: Date.now(),
          timestamp: new Date(),
          read: false,
        };
        // Ajouter au début pour afficher les plus récentes en premier
        const updatedNotifs = [newNotif, ...prev];
        // Limiter le nombre de notifications
        return updatedNotifs.slice(0, MAX_NOTIFICATIONS);
      });

      // Afficher un toast pour les likes
      addToast({
        title: "💖 Nouveau like !",
        description: likeData.message,
        color: "secondary",
      });
    });

    // Nouvelle notification pour les messages de chat
    socket.on("message", (messageData) => {
      setNotifications((prev) => {
        const newNotif = {
          ...messageData,
          id: Date.now(),
          timestamp: new Date(),
          read: false,
        };
        // Ajouter au début pour afficher les plus récentes en premier
        const updatedNotifs = [newNotif, ...prev];
        // Limiter le nombre de notifications
        return updatedNotifs.slice(0, MAX_NOTIFICATIONS);
      });

      // Afficher un toast pour les nouveaux messages seulement si l'utilisateur n'est pas dans la page de chat
      // ou si ce n'est pas la conversation actuellement active
      const isInChatPage = location.pathname.startsWith("/chat/");

      if (!isInChatPage) {
        addToast({
          title: "💬 Nouveau message !",
          description: messageData.message,
          color: "primary",
        });
      }
    });

    return () => {
      socket.off("RECEIVE_NOTIFICATION");
      socket.off("match");
      socket.off("like");
      socket.off("message");
    };
  }, [socket, location.pathname]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);