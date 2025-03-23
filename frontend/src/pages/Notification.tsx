import { useNotifications } from "@/context/NotificationContext.tsx";

interface Notification {
    message: string;
    notif: string;
    index: number;
}

const Notification = () => {
    const { notifications } = useNotifications();

    return (
        <div className="fixed bg-white shadow-lg p-4 rounded-lg">
            <h3 className="text-lg font-bold">🔔 Notifications</h3>
            {notifications.length === 0 ? (
                <p>Aucune notification</p>
            ) : (
                notifications.map((notif:string, index:number) => (
                    <div key={index} className="p-2 bg-gray-100 my-1 rounded">
                        {notif}
                    </div>
                ))
            )}
        </div>
    );
};

export default Notification;