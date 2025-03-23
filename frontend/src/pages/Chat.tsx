import { useState, useEffect } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/auth";

const socket = io("http://localhost:5001");

const Message = () => {
    const [messages, setMessages] = useState<{ sender_id: number; message_text: string }[]>([]);
    const [messageText, setMessageText] = useState("");
    const { match_id } = useParams<{ match_id: string }>();
    const { id } = useAuth(); // ID de l'utilisateur connecté

    const cleanMatchId = match_id ? match_id.replace(":", "") : null;

    console.log("match_id", cleanMatchId);



    useEffect(() => {
        // Récupérer les messages existants
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
                if (response.ok && Array.isArray(data.messages)) {
                    setMessages(data.messages);
                } else {
                    setMessages([]); // Évite d'avoir `undefined`
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des messages :", error);
            }
        };
    
        fetchMessages();
    
        // ✅ **Écoute les nouveaux messages en temps réel**
        socket.on("SERVER_MSG", (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
    
        return () => {
            socket.off("SERVER_MSG");
        };
    }, [cleanMatchId]);


    // useEffect(() => {
    //     // Récupérer les messages existants

    //     console.log("HHOPOOOOOOHHOOOOOO");
    //     const fetchMessages = async () => {
    //         try {
    //             const response = await fetch(`http://localhost:5001/api/getMessages/${cleanMatchId}`, {
    //                 method: "GET",
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //                     "Content-Type": "application/json",
    //                 },
    //             });

    //             const data = await response.json();
    //             // if (response.ok) {
    //             //     setMessages(data.messages);
    //             //     console.log("los messares", data);
    //             // }
    //             if (response.ok && Array.isArray(data.messages)) {
    //                 setMessages(data.messages);
    //             } else {
    //                 setMessages([]); // Évite d'avoir `undefined`
    //             }
    //         } catch (error) {
    //             console.error("Erreur lors de la récupération des messages :", error);
    //         }
    //     };

    //     fetchMessages();

    //     // Écouter les messages en temps réel
    //     socket.on("SERVER_MSG", (messages) => {
    //         setMessages((prevMessages) => [...prevMessages, messages]);
    //     });

    //     return () => {
    //         socket.off("SERVER_MSG");
    //     };
    // }, [cleanMatchId]);

    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!messageText.trim()) return;
        if (!cleanMatchId) {
            console.error("Erreur: cleanMatchId est undefined !");
            return;
        }
    
        const message = {
            sender_id: Number(id),  // ✅ Conversion en nombre
            message_text: messageText,
            match_id: Number(cleanMatchId),
        };
    
        // Envoyer via WebSocket
        socket.emit("CLIENT_MesSaGes", message);
    
        // Sauvegarde dans la base de données
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
                    { sender_id: Number(id), message_text: messageText }  // ✅ Format correct
                ]);
                setMessageText("");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        }
    };

    // const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();

    //     if (!messageText.trim()) return;

    //     const message = {
    //         sender_id: id,
    //         message_text: messageText,
    //         match_id,
    //     };

    //     // Envoyer via WebSocket
    //     socket.emit("CLIENT_MesSaGes", message);

    //     // Sauvegarder dans la BDD
    //     try {
    //         const response = await fetch("http://localhost:5001/api/sendMessage", {
    //             method: "POST",
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem("token")}`,
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(message),
    //         });

    //         if (response.ok) {
    //             setMessages((prevMessages) => [...prevMessages, message]);
    //             setMessageText(""); // Reset input
    //         }
    //     } catch (error) {
    //         console.error("Erreur lors de l'envoi du message :", error);
    //     }
    // };

    return (
        <div className="flex flex-col h-screen max-w-lg mx-auto bg-gray-100 border rounded-lg shadow-lg">
            {/* Titre */}
            <div className="bg-blue-600 text-white text-xl font-bold p-4 rounded-t-lg">
                Chat Room
            </div>

            {/* Liste des messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
                {messages?.map((messages, index) => (
                    <div
                        key={index}
                        className={`p-2 max-w-xs rounded-lg ${
                            Number(messages.sender_id) === Number(id) ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-black mr-auto"
                        }`}
                    >
                        {messages.message_text}
                    </div>
                ))}
            </div>

            {/* Formulaire d'envoi */}
            <form onSubmit={sendMessage} className="flex p-2 bg-white border-t rounded-b-lg">
                <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Votre message..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none"
                />
                <button type="submit" className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
                    Envoyer
                </button>
            </form>
        </div>
    );
};

export default Message;