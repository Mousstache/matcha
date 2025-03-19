import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Déplacer ici pour éviter les re-créations

const Message = () => {
    const [messages, setMessages] = useState<{ username: string; text: string }[]>([]);

    useEffect(() => {
        socket.on('SERVER_MSG', (msg) => {
            setMessages(prevMessages => [...prevMessages, msg]);
        });

        return () => {
            socket.off('SERVER_MSG'); // Nettoie l'événement
        };
    }, []);

    function sendMessage(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;

        const msg = {
            username: (form.elements.namedItem('username') as HTMLInputElement).value,
            text: (form.elements.namedItem('text') as HTMLInputElement).value,
        };

        socket.emit('CLIENT_MSG', msg);
        setMessages(prevMessages => [...prevMessages, msg]); // Ajoute le message localement
        form.reset(); // Nettoie les inputs
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
                                    <div key={index}>{msg.username}: {msg.text}</div>
                                ))}
                            </div>
                        </div>
                        <form onSubmit={sendMessage}>
                            <div className="card-footer">
                                <input id="username" type="text" placeholder="Username" className="form-control" required />
                                <br />
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