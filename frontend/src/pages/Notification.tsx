import { useNotifications } from "@/context/NotificationContext";

const Notification = () => {
    const { notifications, setNotifications } = useNotifications();

    const markAllAsRead = () => {
        setNotifications((prev:any) => prev.map((n:any) => ({ ...n, read: true })));
    };

    return (
        <nav className="p-4 bg-gray-800 text-white flex justify-between">
            <h1>Mon App</h1>
            <div className="relative">
                <button className="relative" onClick={markAllAsRead}>
                    🔔 {notifications.some((n:any) => !n.read) && "•"}
                </button>
                <div className="absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded-lg">
                    {notifications.length === 0 ? (
                        <p className="p-2 text-gray-500">Aucune notification</p>
                    ) : (
                        notifications.map((notif:any, i:any) => (
                            <p key={i} className={`p-2 ${notif.read ? "text-gray-500" : "font-bold"}`}>
                                {notif.message}
                            </p>
                        ))
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Notification;