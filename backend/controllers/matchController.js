import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { io } from '../server.js';


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

      const io = req.app.get("io");
      const connectedUsers = req.app.get("connectedUsers");

      const likedSocketId = connectedUsers[liked_id];
      const likerSocketId = connectedUsers[liker_id];
        
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

      return res.status(201).json({
        message: "c'est un match",
      })
    }
    
    await db.insert('likes', {liker_id, liked_id});


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
      const {liked_id, liker_id, match_id} = req.body;
  
      const match = await db.findOne('matches', { match_id });

      let likedId;

      if (match.user1_id === liker_id) {
        likedId = match.user2_id;
      }else {
        likedId = match.user1_id;
      }

      const user = await db.findOne('users', { id: likedId });

  
      const fameRate = user.fame_rate - 1;

      await db.delete('likes', {liked_id :likedId, liker_id});

      await db.delete('likes', {liker_id, liked_id :likedId});

      await db.delete('matches', {match_id});
      
      const like = await db.findOne('likes', {liker_id, liked_id: likedId});
  
      await db.update('users', {fame_rate: fameRate}, { id: likedId });
  
      return res.status(201).json({
        message: "like enlever",
      })
    }catch (error){
      console.error('Error lors du dislike', error);
    }
  };

  export async function ConsultProfile (req, res){
    try {
      const { viewedId , viewerId } = req.body;
      
      const user = await db.findOne('users',  { id: viewedId });
  
      await db.update('users', { fame_rate: user.fame_rate + 1 }, { id: viewedId });

      console.log('viewerId:', viewerId);
      console.log('viewedId:', viewedId);
      
      if (!viewedId) {
        return res.status(400).json({
          success: false,
          message: "ID du profil consulté manquant"
        });
      }
    
      const existingView = await db.findOne('consult_profile', {
        viewer_id: viewerId,
        viewed_id: viewedId
      });
      
      if (!existingView) {
        await db.insert('consult_profile', {
          viewer_id: viewerId,
          viewed_id: viewedId,
          viewed_at: new Date()
        });
      } else {
        await db.update('consult_profile', 
          { id: existingView.id },
          { viewed_at: new Date() }
        );
      }
      
      return res.status(200).json({
        success: true,
        message: "Vue de profil enregistrée"
      });
    }catch (error){
      console.error('Error lors de la recup des matches', error);
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
      AND u.id NOT IN (
        SELECT blocked_id FROM blocks WHERE blocker_id = $1
        UNION
        SELECT blocker_id FROM blocks WHERE blocked_id = $1
      )
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

      db.update('users', { fame_rate: user.fame_rate },{id: user.id});    
      
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
      AND u.id NOT IN (
        SELECT blocked_id FROM blocks WHERE blocker_id = $1
        UNION
        SELECT blocker_id FROM blocks WHERE blocked_id = $1
      )
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
  
  export async function getMatches(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.findOne('users', { email: decoded.email });
    
    const sql = `
      SELECT m.match_id, u.id AS user_id, u.email, u.userName, u.firstName, u.lastName
      FROM matches m
      JOIN users u ON m.user2_id = u.id
      WHERE m.user1_id = $1
      AND u.id NOT IN (
        SELECT blocked_id FROM blocks WHERE blocker_id = $1
        UNION
        SELECT blocker_id FROM blocks WHERE blocked_id = $1
      )
      
      UNION
      
      SELECT m.match_id, u.id AS user_id, u.email, u.userName, u.firstName, u.lastName
      FROM matches m
      JOIN users u ON m.user1_id = u.id
      WHERE m.user2_id = $1
      AND u.id NOT IN (
        SELECT blocked_id FROM blocks WHERE blocker_id = $1
        UNION
        SELECT blocker_id FROM blocks WHERE blocked_id = $1
      )
    `;
    
    const matches = await db.query(sql, [user.id]);
    
    return res.status(200).json({
      message: "liste des matches",
      matches: matches.rows || matches,
    });
  } catch (error) {
    console.log('Error lors de la recup des matches', error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des matches",
      error: error.message
    });
  }
}

export default { ConsultProfile, likeUser, unlikeUser, getLikes, getOtherLikes, getMatches, dislikeUser };