import { useNotifications } from "@/context/NotificationContext";
import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Heart, MessageCircle, Check } from "lucide-react";
// import { Link } from "react-router-dom";
import { useState } from "react";


const Notification = () => {
    const { notifications, setNotifications } = useNotifications(); 
    const [animateOut, setAnimateOut] = useState<number | null>(null);


    const markAllAsRead = () => {
        setNotifications((prev:any) => prev.map((n:any) => ({ ...n, read: true })));
    };


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


  const removeNotification = (index: number) => {
    setAnimateOut(index);
    setTimeout(() => {
      setNotifications((prev: any) => prev.filter((_: any, i: number) => i !== index));
      setAnimateOut(null);
    }, 300);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden border border-pink-100">
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4 flex items-center justify-between">
        <CardTitle className="text-white flex items-center">
          <Bell size={20} className="mr-2" />
          Notifications
        </CardTitle>
        {notifications.length > 0 && (
          <span className="bg-white text-pink-500 font-bold text-sm px-2 py-1 rounded-full">
            {notifications.filter((n: any) => !n.read).length}
          </span>
        )}
      </div>
      
      <CardContent className="p-0 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell size={32} className="mx-auto mb-3 text-pink-200" />
            <p>Aucune notification pour le moment</p>
            <p className="text-sm text-pink-300 mt-2">Continuez à explorer des profils!</p>
          </div>
        ) : (
          notifications.map((notif: any, i: number) => (
            <div 
              key={i} 
              className={`p-4 border-b border-pink-50 transition-all duration-300 ${
                animateOut === i ? 'opacity-0 transform translate-x-full' : ''
              } ${notif.read ? "bg-white text-gray-500" : "bg-pink-50 border-l-4 border-l-pink-500"}`}
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
                    {notif.time || "À l'instant"}
                  </p>
                </div>
                <button 
                  onClick={() => removeNotification(i)} 
                  className="text-gray-400 hover:text-pink-500 p-1"
                >
                  <Check size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </CardContent>
      
      <CardFooter className="p-3 bg-gray-50 border-t border-pink-100">
        <Button 
          onClick={markAllAsRead} 
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-md transition-shadow"
          disabled={notifications.length === 0 || notifications.every((n: any) => n.read)}
        >
          Tout marquer comme lu
        </Button>
      </CardFooter>
    </Card>
  );
};


    // return (
    //     <Card>
    //         <CardTitle>Notifications</CardTitle>
    //         <CardContent className="p-0">
    //             {notifications.length === 0 ? (
    //                 <p className="p-4 text-gray-500">Aucune notification</p>
    //             ) : (
    //                 notifications.map((notif:any, i:any) => (
    //                     <Link to="/" className="flex items-center space-x-1">
    //                     <div key={i} className={`p-4 ${notif.read ? "text-gray-500" : "font-bold"}`}>
    //                         {notif.message}

    //                     </div>
    //                     </Link>
    //                 ))
    //             )}
    //         </CardContent>
    //         <CardFooter>
    //             <Button onClick={markAllAsRead} className="w-full">
    //                 Marquer toutes comme lues
    //             </Button>
    //         </CardFooter>
    //     </Card>
    // );
// };

export default Notification;
