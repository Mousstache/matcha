import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const socket = io("http://localhost:5001");

const NotificationContext = createContext<any>(null);

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<string[]>([]);

    useEffect(() => {
        socket.on("receive_notification", (data) => {
            setNotifications((prev) => [...prev, data.message]);
        });

        return () => {
            socket.off("receive_notification");
        };
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications, socket }}>
            {children}
        </NotificationContext.Provider>
    );
};
