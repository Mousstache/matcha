import { useNotifications } from "@/context/NotificationContext";
import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Notification = () => {
    const { notifications, setNotifications } = useNotifications();

    const markAllAsRead = () => {
        setNotifications((prev:any) => prev.map((n:any) => ({ ...n, read: true })));
    };

    return (
        <Card>
            <CardTitle>Notifications</CardTitle>
            <CardContent className="p-0">
                {notifications.length === 0 ? (
                    <p className="p-4 text-gray-500">Aucune notification</p>
                ) : (
                    notifications.map((notif:any, i:any) => (
                        <div key={i} className={`p-4 ${notif.read ? "text-gray-500" : "font-bold"}`}>
                            {notif.message}
                        </div>
                    ))
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={markAllAsRead} className="w-full">
                    Marquer toutes comme lues
                </Button>
            </CardFooter>
        </Card>
    );
};

export default Notification;


{/* <nav className="p-4 bg-gray-800 text-white flex justify-between">
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
</nav> */}