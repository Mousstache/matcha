import { createContext, useContext, useEffect, useState } from "react";
// import io from "socket.io-client";
import { useAuth } from "@/context/auth";
import { addToast } from "@/utils/toast";

// const socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5001");

const NotificationContext = createContext<any>(null);
export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const { socket } = useAuth();

  useEffect(() => {
    if (!socket) return;

    socket.on("RECEIVE_NOTIFICATION", (notification) => {
      console.log("🔔 Notification reçue dans le provider", notification);
      setNotifications((prev) => [...prev, notification]);
    });

    // Nouvelle notification pour les matches
    socket.on("match", (matchData) => {
      console.log("💕 Match reçu dans le provider", matchData);
      setNotifications((prev) => [
        ...prev,
        {
          ...matchData,
          id: Date.now(),
          timestamp: new Date(),
        },
      ]);
      // Afficher un toast spécial pour les matches
      addToast({
        title: "🎉 Nouveau match !",
        description: matchData.message,
        color: "success",
      });
    });

    // Nouvelle notification pour les likes
    socket.on("like", (likeData) => {
      console.log("👍 Like reçu dans le provider", likeData);
      setNotifications((prev) => [
        ...prev,
        {
          ...likeData,
          id: Date.now(),
          timestamp: new Date(),
        },
      ]);
      // Afficher un toast pour les likes
      addToast({
        title: "💖 Nouveau like !",
        description: likeData.message,
        color: "secondary",
      });
    });

    return () => {
      socket.off("RECEIVE_NOTIFICATION");
      socket.off("match");
      socket.off("like");
    };
  }, [socket]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

// export {socket};
