import { useState, useEffect } from 'react';
import io from 'socket.io-client';
// import { json } from 'stream/consumers';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/auth';


const socket = io('http://localhost:5001'); // Déplacer ici pour éviter les re-créations

const Message = () => {
    const [messages, setMessages] = useState<{ text: string }[]>([]);
    const { match_id } = useParams<{ match_id: string }>();
    const { id } = useAuth();

    useEffect(() => {
        socket.on('SERVER_MSG', (msg) => {
            setMessages(prevMessages => [...prevMessages, msg]);
        });

        return () => {
            socket.off('SERVER_MSG'); // Nettoie l'événement
        };
    }, []);

    const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try{
            const form = e.currentTarget;
    
            const msg = {
                // username: (form.elements.namedItem('username') as HTMLInputElement).value,
                text: (form.elements.namedItem('text') as HTMLInputElement).value,
            };
    
            socket.emit('CLIENT_MSG', msg);
            // setMessages(prevMessages => [...prevMessages, msg]); // Ajoute le message localement

            console.log("message_text", msg);
            console.log("sender_id", id);
            console.log("match_id", match_id);
    
            const response = await fetch('http://localhost:5001/getMessage', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({sender_id: id, message_text: msg, match_id}),
            });
    
            const data = await response.json();
            if (!data)
                return ;
            form.reset(); // Nettoie les inputs

        }catch (error){
            console.log(error);
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-4">
                    <div className="card">
                        <div className="card-body">
                            <div className="card-title">My first chat</div>
                            <hr />
                            <div className="messages">
                                {messages.map((msg, index) => (
                                    <div key={index}> {msg.text}</div>
                                ))}
                            </div>
                        </div>
                        <form onSubmit={sendMessage}>
                            <div className="card-footer">
                                <input id="text" type="text" placeholder="Your message" className="form-control" required />
                                <br />
                                <button type="submit" className="btn btn-primary form-control">
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;