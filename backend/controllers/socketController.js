import db from '../config/db.js';
import { io } from '../server.js';




export async function sendMessage (req, res) {
  try {

      const { sender_id, match_id, message_text } = req.body;

      const receiverId = await db.findOne('matches', {match_id})
  
      const messages = await db.insert('messages', {sender_id, match_id, message_text, created_at: new Date()});
  
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

    console.log("messages <<<< ", messages);
    console.log("roww messages <<<< ", messages.rows);

  
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

export default { getMessages , getNotifications, sendNotification, sendMessage };
  