import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { io } from '../server.js';

export async function recordProfileView (req, res){
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
      
      // if (viewerId === parseInt(viewedId)) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Impossible d'enregistrer une vue sur son propre profil"
      //   });
      // }
      
      const existingView = await db.findOne('profile_views', {
        viewer_id: viewerId,
        viewed_id: viewedId
      });
      
      if (!existingView) {
        await db.insert('profile_views', {
          viewer_id: viewerId,
          viewed_id: viewedId,
          viewed_at: new Date()
        });
      } else {
        await db.update('profile_views', 
          { id: existingView.id },
          { viewed_at: new Date() }
        );
      }

      if (io) {
        io.to(`user_${viewedId}`).emit("SEND_NOTIFICATION", {
          userId: viewerId,
          type: "view",
          message: `${viewerId} a visité votre profil`,
      });
    }
      
      return res.status(200).json({
        success: true,
        message: "Vue de profil enregistrée"
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la vue de profil:', error);
      return res.status(500).json({
        success: false,
        message: "Une erreur est survenue",
        error: error.message
      });
    }
  };
  
  
  
export async function getAllUsers (req, res){
    try {
      const {
        minAge,
        maxAge,
        sexualPreference,
        gender,
        latitude,
        longitude,
        maxDistance,
        ordered,
        interests,
        id,
      } = req.body;

      console.log('minAge:', minAge);
      console.log('maxAge:', maxAge);
      console.log('sexualPreference:', sexualPreference);
      console.log('gender:', gender);
      console.log('latitude:', latitude);
      console.log('longitude:', longitude);
      console.log('maxDistance:', maxDistance);

      const currentUserId = req.user.id;

      const blocked_id = req.user.getBlockUsers;

      console.log('blocked_id:', blocked_id);
      console.log('id :', currentUserId);

      const params = [];
      
      let query = `SELECT id, email, firstname, lastname, description, interests, age, city, profile_picture`;
      
      if (latitude && longitude) {
        query += `,
        ROUND( 6371 * acos( cos( radians($1) ) * 
        cos( radians( latitude ) ) * 
        cos( radians( longitude ) - radians($2) ) + 
        sin( radians($1) ) * 
        sin( radians( latitude ) ) 
        )) AS distance`;
        params.push(parseFloat(latitude), parseFloat(longitude));
      }
      
      query += ` FROM users u
      WHERE u.id != $${params.length + 1}
      AND u.id NOT IN (
        SELECT blocked_id FROM blocks WHERE blocker_id = $${params.length + 1}
        UNION
        SELECT blocker_id FROM blocks WHERE blocked_id = $${params.length + 1}
        )`;
        params.push(currentUserId);
      // AND u.id NOT IN (
      //   SELECT user_id FROM blocked_users WHERE blocked_user_id = $${blocked_id}
      // )`;
  
  
      // if (latitude && longitude) {
      //   params.push(parseFloat(latitude), parseFloat(longitude));
      // }
      
      if (minAge) {
        query += ` AND age >= $${params.length + 1}`;
        params.push(parseInt(minAge));
      }
      
      if (maxAge) {
        query += ` AND age <= $${params.length + 1}`;
        params.push(parseInt(maxAge));
      }
      
      if (sexualPreference) {
        query += ` AND preference = $${params.length + 1}`;
        params.push(sexualPreference);
      }
  
      if (gender){
        query += ` AND gender = $${params.length + 1}`;
        params.push(gender);
      }
  
      // if (latitude && longitude && maxDistance) {
      //   query += ` HAVING distance <= $${paramIndex}`;
      //   params.push(parseFloat(maxDistance));
      //   paramIndex++;
      // }
  
      // if (ordered){
      //   if (ordered === "age"){
          // if (age){
          //   query += ` ORDER BY age`;
          // }
      //   }
      //   if (ordered === "distance"){
      //     if (latitude && longitude) {
      //       query += ` ORDER BY distance`;
      //     }
      //   }
      //   if (ordered === "interests"){
      //     if (interests){
      //       query += ` ORDER BY interests`;
      //     }
      //   }
      // }
  
      const users = await db.query(query, params);
      
      res.status(200).json({
        message: 'Liste des utilisateurs récupérée avec succès',
        users: users
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({
        message: 'Erreur serveur lors de la récupération des utilisateurs'
      });
    }
  };
  
  export async function getUser (req, res){
    try{
      const token = req.headers.authorization?.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const user = await db.findOne('users', {email: decoded.email}, {
        attributes: { exclude: ['password'] }
      });
  
      res.status(200).json({
        user: user
      });
      
  
  }catch(error){
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération de l\'utilisateur'
    });
  } 
  };

export async function blockUser(req, res) {
  try {
    const { blocker_id, match_id} = req.body;
  
    const match = await db.findOne('matches', {match_id});
  
    let blocked_id;
  
    if (match.user1_id === blocker_id) {
      blocked_id = match.user2_id;
    }else {
      blocked_id = match.user1_id;
    }
    
    await db.insert('blocks', { blocker_id: blocker_id , blocked_id: blocked_id})
  
    res.status(200).json({
      message: 'utilisateur bloquer avec succès',
    });
  }catch (error){
    console.error('Erreur lors du block de l\'utilisateur:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors du block de l\'utilisateur'
    });
  } 
};

export async function getBlockUser(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await db.findOne('users',  { email: decoded.email });
  
      const sql = `
      SELECT b.block_id, u.id AS user_id, u.email, u.userName, u.firstName, u.lastName
      FROM blocks b
      JOIN users u ON b.blocked_id = u.id
      WHERE b.blocker_id = $1
      UNION
      SELECT b.block_id, u.id AS user_id, u.email, u.userName, u.firstName, u.lastName
      FROM blocks b
      JOIN users u ON b.blocker_id = u.id
      WHERE b.blocked_id = $1;
      `;
  
    const block = await db.query(sql, [user.id]);

    console.log('block:', block);
  

    res.status(200).json({
      list: block,
    });
    
  } catch(error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors de la récupération de l\'utilisateur'
    });
  }
};

export async function unblockUser(req, res) {
  try{
    const {block_id, id} = req.body;

    const user = db.findOne('users', { id: id });

    await db.delete('blocks', {block_id});

    return res.status(201).json({
      message: "utilisateur debloquer",
    })
  }catch (error){
    console.error('Error lors du dislike', error);
  }
};

export async function signalUser(req, res) {
  try {
    const { reporter_id, match_id, reason} = req.body;
  
    const match = await db.findOne('matches', {match_id});
  
    let reported_id;
  
    if (match.user1_id === reporter_id) {
      reported_id = match.user2_id;
    }else {
      reported_id = match.user1_id;
    }

    console.log('reported_id:', reported_id);
    console.log('reporter_id:', reporter_id);
    
    await db.insert('reports', { reporter_id: reporter_id , reported_id: reported_id, reason: reason})
  
    res.status(200).json({
      message: 'utilisateur bloquer avec succès',
    });
  }catch (error){
    console.error('Erreur lors du block de l\'utilisateur:', error);
    res.status(500).json({ 
      message: 'Erreur serveur lors du block de l\'utilisateur'
    });
  } 
};


export default { recordProfileView, getAllUsers, getUser, blockUser, getBlockUser, unblockUser, signalUser };