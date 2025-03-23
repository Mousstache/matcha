import jwt from 'jsonwebtoken';
import db from '../config/db.js';

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
        interests
      } = req.body;
      console.log('minAge:', minAge);
      console.log('maxAge:', maxAge);
      console.log('sexualPreference:', sexualPreference);
      console.log('gender:', gender);
      console.log('latitude:', latitude);
      console.log('longitude:', longitude);
      console.log('maxDistance:', maxDistance);
      
      let query = `SELECT id, email, firstname, lastname, description, interests, age, city`;
  
      if (latitude && longitude) {
        query += `,
          ( 6371 * acos( cos( radians($1) ) * 
            cos( radians( latitude ) ) * 
            cos( radians( longitude ) - radians($2) ) + 
            sin( radians($1) ) * 
            sin( radians( latitude ) ) 
          ) ) AS distance`;
      }
      
      query += ` FROM users WHERE 1=1`;
  
      const params = [];
  
      if (latitude && longitude) {
        params.push(parseFloat(latitude), parseFloat(longitude));
      }
      
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
  
      if (latitude && longitude && maxDistance) {
        query += ` HAVING distance <= $${paramIndex}`;
        params.push(parseFloat(maxDistance));
        paramIndex++;
      }
  
      if (ordered){
        if (ordered === "age"){
          if (age){
            query += ` ORDER BY age`;
          }
        }
        if (ordered === "distance"){
          if (latitude && longitude) {
            query += ` ORDER BY distance`;
          }
        }
        if (ordered === "interests"){
          if (interests){
            query += ` ORDER BY interests`;
          }
        }
      }
  
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


export default { recordProfileView, getAllUsers, getUser };