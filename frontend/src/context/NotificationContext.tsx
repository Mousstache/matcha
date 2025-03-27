import { createContext, useContext, useEffect, useState } from "react";
// import io from "socket.io-client";
import { useAuth } from "@/context/auth";

// const socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5001");

const NotificationContext = createContext<any>(null);
export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<string[]>([]);
    const { socket }  = useAuth();


    useEffect(() => {

        if (!socket)
            return ;

        socket.on("RECEIVE_NOTIFICATION", (notification) => {
            console.log("🔔 Notification reçue dans le provider", notification);
            alert(`Nouvelle notification : ${notification.message}`);
            setNotifications((prev) => [...prev, notification]);
        });

        return () => {
            socket.off("RECEIVE_NOTIFICATION");
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
