import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { ArrowLeft, Send } from "lucide-react";

const Message = () => {
    const [messages, setMessages] = useState<{ sender_id: number; message_text: string }[]>([]);
    const [messageText, setMessageText] = useState("");
    const { match_id } = useParams<{ match_id: string }>();
    const [receiverId, setReceiverId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const { id, socket, firstname } = useAuth();
    const navigate = useNavigate();
    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    const cleanMatchId = match_id ? match_id.replace(":", "") : null;

    useEffect(() => {
        const fetchMessages = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:5001/api/getMessages/${cleanMatchId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                });
    
                const data = await response.json();
                setReceiverId(data.receiverId);
                if (response.ok && Array.isArray(data.messages)) {
                    setMessages(data.messages);
                } else {
                    setMessages([]);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des messages :", error);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchMessages();

        if (!socket) return;
        
        socket.on("SERVER_MSG", (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
        
        return () => {
            socket.off("SERVER_MSG");
        };
    }, [socket, cleanMatchId]);

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]); 

    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!messageText.trim()) return;
        if (!cleanMatchId) {
            console.error("Erreur: cleanMatchId est undefined !");
            return;
        }
        
        const message = {
            receiverId: receiverId,
            sender_id: Number(id),
            message_text: messageText,
            match_id: Number(cleanMatchId),
        };

        if (socket) {
            socket.emit("CLIENT_MesSaGes", message);
        }

        const notif = {
            userId: receiverId, 
            type: "message",
            message: `📩 Nouveau message de ${firstname}`
        };

        if (socket) {
            socket.emit("SEND_NOTIFICATION", notif);
        }

        try {
            const response = await fetch("http://localhost:5001/api/sendMessage", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(message),
            });

            if (response.ok) {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { sender_id: Number(id), message_text: messageText }
                ]);
                setMessageText("");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Header */}
                <div className="bg-white rounded-t-2xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Retour</span>
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Chat</h1>
                    <div className="w-16"></div> {/* Spacer for centering */}
                </div>

                {/* Messages Container */}
                <div className="bg-white border-l border-r border-gray-200 relative">
                    <div
                        ref={messageContainerRef}
                        className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50"
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <div className="text-4xl mb-2">💬</div>
                                <p>Aucun message pour le moment</p>
                                <p className="text-sm">Envoyez le premier message !</p>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        Number(message.sender_id) === Number(id) ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                            Number(message.sender_id) === Number(id)
                                                ? "bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-br-sm"
                                                : "bg-white text-gray-800 shadow-sm border border-gray-200 rounded-bl-sm"
                                        }`}
                                    >
                                        <p className="text-sm leading-relaxed">{message.message_text}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Input */}
                <div className="bg-white rounded-b-2xl shadow-sm border border-gray-200 p-4">
                    <form onSubmit={sendMessage} className="flex gap-3">
                        <input
                            type="text"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Écrivez votre message..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!messageText.trim()}
                            className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-3 rounded-full hover:from-pink-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Message;