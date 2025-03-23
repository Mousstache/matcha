import jwt from 'jsonwebtoken';
import db from '../config/db.js';

let io;

export const setSocket = (socketIo) => {
    io = socketIo;
};



export async function likeUser (req, res){
    try{
  
      const {liked_id , liker_id} = req.body;
  
      console.log("liker_id", liker_id);
      console.log("liked_id", liked_id);
  
      const user = await db.findOne('users', { id: liked_id });
  
      const fameRate = user.fame_rate + 5;
  
  
      if (!liker_id || !liked_id)
        return res.status(400).json({
          message: "ya pas de like",
        })
  
      if (liker_id === liked_id)
        return res.status(400).json({
          message : "pas de like sois meme",
      })
  
      await db.update('users', { fame_rate: fameRate}, { id: liked_id });
  
      const Otherlikes = await db.findOne('likes', {liker_id: liked_id, liked_id: liker_id});
  
      console.log(Otherlikes);
  
      if (Otherlikes){
        const user2 = await db.findOne('users', { id: liker_id });
  
        const fameRate3 = user.fame_rate + 10;
        const fameRate2 = user2.fame_rate + 10;
  
        await db.update('users', { fame_rate: fameRate3 }, { id: liked_id });
        await db.update('users', { fame_rate: fameRate2 }, { id: liker_id });
        await db.insert('matches', {user1_id: liker_id, user2_id: liked_id, created_at: new Date()});
  
        if (io) {
          const receiverSocket = connectedUsers[liked_id];
          if (receiverSocket) {
              io.to(receiverSocket).emit("receive_notification", {
                  message: `🔥 C'est un match avec ${liker_id} ! 🎉`,
              });
          }
      }
  
        return res.status(201).json({
          message: "c'est un match",
        })
      }
  
      await db.insert('likes', {liker_id, liked_id});
  
      if (io) {
        const receiverSocket = connectedUsers[liked_id];
        if (receiverSocket) {
            io.to(receiverSocket).emit("receive_notification", {
                message: `💖 Vous avez reçu un like de ${liker_id} !`,
            });
        }
    }
  
      return res.status(201).json({
        message: "like ajouter",
      })
    }catch (error){
      console.error('Error lors du like', error);
      return res.status(500).json({
        message: "Une erreur est survenue",
        error: error.message
      });
    }
  };
  
  export async function unlikeUser (req, res){
    try{
      const {liked_id, liker_id} = req.body;
  
      const user = db.findOne('users', { id: liked_id });
  
      fameRate = user.fame_rate - 1;
      
      const like = await db.findOne('likes', {liker_id, liked_id});
  
      await db.update();
  
      return res.status(201).json({
        message: "like enlever",
      })
    }catch (error){
      console.error('Error lors du dislike', error);
    }
  };
  
  export async function getLikes (req, res){
    try{
  
      const token = req.headers.authorization?.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await db.findOne('users',  { email: decoded.email });
  
      const sql = `
      SELECT u.id, u.email, u.userName, u.firstName, u.lastName 
      FROM likes l
      JOIN users u ON l.liked_id = u.id
      WHERE l.liker_id = $1;
    `;
  
      const likes = await db.query(sql, [user.id]);
  
      return res.status(200).json({
        message: "liste des likes",
        likes: likes,
      })
    }catch(error){
      console.error('Error lors de la recup des likes');
    }
  };



  export async function dislikeUser (req, res){
    try{
      const { unlike_id } = req.body;
  
      const user = db.findOne('users', { id: unlike_id });
  
      fameRate = user.fame_rate - 1;
  
      db.update('users', { fame_rate: fameRate });
      
      return res.status(201).json({
        message: "unlike pour la fame rate",
      })
  
    }catch (error){
      console.error('Error lors du unlike', error);
    }
  };
  
  export async function getOtherLikes (req, res){
    try{
  
      const token = req.headers.authorization?.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await db.findOne('users',  { email: decoded.email });
  
      const sql = `
      SELECT u.id, u.email, u.userName, u.firstName, u.lastName 
      FROM likes l
      JOIN users u ON l.liker_id = u.id
      WHERE l.liked_id = $1;
    `;
  
      const Otherlikes = await db.query(sql, [user.id]);
  
      return res.status(200).json({
        message: "liste des other likes",
        Otherlikes: Otherlikes,
      })
  
    }catch (error){
      console.log('Error lors de la recup other likes', error);
    }
  };
  
  
  export async function getMatches (req, res){
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await db.findOne('users',  { email: decoded.email });
  
      const sql = `
      SELECT m.match_id, u.id AS user_id, u.email, u.userName, u.firstName, u.lastName
      FROM matches m
      JOIN users u ON m.user2_id = u.id
      WHERE m.user1_id = $1
      UNION
      SELECT m.match_id, u.id AS user_id, u.email, u.userName, u.firstName, u.lastName
      FROM matches m
      JOIN users u ON m.user1_id = u.id
      WHERE m.user2_id = $1;
      `;
  
    const matches = await db.query(sql, [user.id]);
  
    return res.status(200).json({
      message: "liste des matches",
      matches: matches,
    });
  
  
    }catch (error){
      console.log('Error lors de la recup des matches', error);
    }
  };

export default { likeUser, unlikeUser, getLikes, getOtherLikes, getMatches, setSocket };