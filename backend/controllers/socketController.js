import db from '../config/db.js';
import { io } from '../server.js';
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

      const receiverId = match.user2_id;

      console.log("receiver == ", receiverId);

      const io = req.app.get("io");
      const connectedUsers = req.app.get("connectedUsers");


      const receiverSocketId = connectedUsers[receiverId];
      const senderSocketId = connectedUsers[sender_id];

      console.log("receiver SOcket >>>>", receiverSocketId);
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

      console.log("📌 Utilisateurs connectés :", connectedUsers);
      console.log(`👀 Receiver ID : ${receiverId}`);
      console.log(`🎯 Socket du receiver : ${receiverSocketId}`);
      console.log(`🎯 Socket du receiver : ${sender_id}`);
      console.log("le socket sender :", senderSocketId);


      io.to(receiverSocketId).emit("SEND_NOTIFICATION", { 
        userId: receiverId, 
        type: "message",
        message: `📩 Nouveau message de ${sender_id}`
    });

    //   if (receiverSocketId) {
    //     console.log(`Envoi de notification à ${receiverId} via socket ${receiverSocketId}`);
    //     // io.to(receiverSocketId).emit("SEND_NOTIFICATION", {senderSocketId, type:'message',message: `📩 Nouveau message de ${sender_id}`});
    //     io.to(receiverId).emit("SEND_NOTIFICATION", { 
    //       userId: receiverId, 
    //       type: "message",
    //       message: `📩 Nouveau message de ${sender_id}`
    //   });
      
        
    //     // Émettre directement à l'utilisateur destinataire
    //     io.to(receiverSocketId).emit("RECEIVE_NOTIFICATION", notification);
    // } else {
    //     console.log(`Utilisateur ${receiverId} non connecté`);
    // }
      

      // io.emit("RECEIVE_NOTIFICATION", notification);
      // console.log("📤 Envoi de notification à :", receiverSocketId);
      // console.log("📨 Contenu de la notification :", notification);

      return res.status(200).json({
        message: "listes des messages",
        messages: messages,
        receiver: receiverId,
      })
  
    }catch (error){
      console.log("Error lors de l'envoi de message", error);
    }
  };
  
export async function getMessages (req, res) {
    try {
      const { match_id } = req.params;
  
      console.log("le matchid == ", match_id);
  
      const messages = await db.query(
        "SELECT * FROM messages WHERE match_id = $1 ORDER BY current_timestamp ASC",
        [match_id]
    );

  
      return res.status(200).json({
        message: "listes des messages",
        messages: messages ,
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
  