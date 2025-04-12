import { useState, useEffect, useRef } from "react";
// import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/auth";



const Message = () => {
    const [messages, setMessages] = useState<{ sender_id: number; message_text: string }[]>([]);
    // const [receiver, setReceiver] = useState<string>("");
    const [messageText, setMessageText] = useState("");
    const { match_id } = useParams<{ match_id: string }>();
    const [receiverId, setReceiverId] = useState<string>("");
    const { id, socket, firstname } = useAuth();

    const cleanMatchId = match_id ? match_id.replace(":", "") : null;

    console.log("match_id", cleanMatchId);



    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/getMessages/${cleanMatchId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                });
    
                const data = await response.json();
                console.log(data);
                console.log(data.receiverId);
                setReceiverId(data.receiverId);
                if (response.ok && Array.isArray(data.messages)) {
                    setMessages(data.messages);
                } else {
                    setMessages([]);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des messages :", error);
            }
        };
    
        fetchMessages();

        if (!socket)
            return ;
        
        
        socket.on("SERVER_MSG", (newMessage) => {
            console.log("📩 Nouveau message reçu sur le client :", newMessage);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
        
                
                return () => {
                    socket.off("SERVER_MSG");
                };
            }, [socket]);
            
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
    
        if (socket){
            console.log("le receiver", receiverId);
            socket.emit("CLIENT_MesSaGes", message);
        }

        const notif = {
            userId: receiverId, 
            type: "message",
            message: `📩 Nouveau message de ${firstname}`
        };

        if (socket){
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
        

            const data = await response.json();
                console.log(data);
                console.log(data.receiverId);
                setReceiverId(data.receiverId);
                
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
    
            const messageContainerRef = useRef<HTMLDivElement | null>(null);
        
            useEffect(() => {
            if (messageContainerRef.current) {
                messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
            }
            }, [messages]); 

    return (
        <div className="flex flex-col  max-w-lg mx-auto bg-gray-100 border rounded-lg shadow-lg">
      {/* Zone des messages */}
      <div
        ref={messageContainerRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 "
        style={{ maxHeight: "calc(50vh - 50px)" }}
      >
        {messages?.map((message, index) => (
          <div
            key={index}
            className={`p-2 max-w-xs rounded-lg ${
              Number(message.sender_id) === Number(id)
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-200 text-black mr-auto"
            }`}
          >
            {message.message_text}
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex p-2 bg-white border-t rounded-b-lg">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Votre message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none"
        />
        <button
          type="submit"
          className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Envoyer
        </button>
      </form>
    </div>
    );
};

export default Message;