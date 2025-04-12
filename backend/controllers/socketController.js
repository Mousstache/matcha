import db from '../config/db.js';
import { io } from '../server.js';
import jwt from 'jsonwebtoken';

// import { getSocket } from './matchController.js';

// let socket = io("http://localhost:5001");

let ioInstance = null;

export const setSocket = (socketIo) => {
    ioInstance = socketIo;
};

export const getSocket = () => ioInstance;



export async function sendMessage (req, res) {
  try {

      const { sender_id, match_id, message_text } = req.body;

      const match = await db.findOne('matches', {match_id})

      let receiverId;

      if (match.user1_id === sender_id) {
        receiverId = match.user2_id;
      }else {
        receiverId = match.user1_id;
      }


      const io = req.app.get("io");
      const connectedUsers = req.app.get("connectedUsers");


      const receiverSocketId = connectedUsers[receiverId];
      const senderSocketId = connectedUsers[sender_id];

      if (!receiverSocketId) {
          console.log("⚠️ Le destinataire n'est pas connecté !");
          return res.status(400).json({ message: "Le destinataire n'est pas en ligne" });
      }

      const messages = await db.insert('messages', {sender_id, match_id, message_text, created_at: new Date()});
      
      
      const notification = {
        userId: receiverId, 
        type: "message",
        message: `📩 Nouveau message de ${sender_id}`,
        is_read: false,
        created_at: new Date()
      };

      return res.status(200).json({
        message: "listes des messages",
        messages: messages,
        receiverId: receiverId,
        receiverSocketId: receiverSocketId,
        senderSocketId: senderSocketId,
        sender_id: sender_id,
      })
  
    }catch (error){
      console.log("Error lors de l'envoi de message", error);
    }
  };
  
export async function getMessages (req, res) {
    try {

      const token = req.headers.authorization?.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await db.findOne('users',  { email: decoded.email });

      const { match_id } = req.params;

      const match = await db.findOne('matches', {match_id})

      // const receiverId = match.user1_id;

      let receiverId;

      if (match.user1_id === user.id) {
        receiverId = match.user2_id;
      }else {
        receiverId = match.user1_id;
      }


  
      console.log("le matchid == ", receiverId);

      const messages = await db.query(
        "SELECT * FROM messages WHERE match_id = $1 ORDER BY current_timestamp ASC",
        [match_id]
    );

  
      return res.status(200).json({
        message: "listes des messages",
        messages: messages ,
        receiverId: receiverId,
      })
  
    }catch (error){
      console.log('Error lors de la recup des matches', error);
    }
  };

export async function sendNotification (req, res) {
    try {
  
      const { user_id, notification_text } = req.body;
  
      const notifications = await db.insert('notification', {user_id, notification_text, created_at: new Date()});
  
      return res.status(200).json({
        message: "listes des notifications",
        notifications: notifications,
      })
  
    }catch (error){
      console.log('Error lors de la recup des matches', error);
    }
  }; 
  
export async function getNotifications(req, res) {
    try {
      const { user_id } = req.params;
  
      const notifications = await db.query(
        "SELECT * FROM notification WHERE user_id = $1",
        [user_id]
    );
  
      return res.status(200).json({
        message: "listes des notifications",
        notifications: notifications.rows ,
      })
  
    }catch (error){
      console.log('Error lors de la recup des matches', error);
    }
  };

export default { getMessages , getSocket, getNotifications, sendNotification, sendMessage };
  