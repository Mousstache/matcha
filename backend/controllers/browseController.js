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
      
      if (viewerId === parseInt(viewedId)) {
        return res.status(400).json({
          success: false,
          message: "Impossible d'enregistrer une vue sur son propre profil"
        });
      }
      
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
  
  
  
  export async function getAllUsers(req, res) {
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
        fame_rate,
        id,
        excludeIds, // Nouveau paramètre pour exclure les profils déjà interagis
      } = req.body;
  
      console.log('>>>>>>>>>>>>');
      console.log('minAge:', minAge);
      console.log('maxAge:', maxAge);
      console.log('sexualPreference:', sexualPreference);
      console.log('gender:', gender);
      console.log('latitude:', latitude);
      console.log('longitude:', longitude);
      console.log('maxDistance:', maxDistance);
      console.log('ordered:', ordered);
      console.log('interests:', interests);
      console.log('excludeIds:', excludeIds);
      console.log('excludeIds length:', excludeIds ? excludeIds.length : 0);
      console.log('>>>>>>>>>>>>');
  
      const currentUserId = req.user.id;
      const blocked_id = req.user.getBlockUsers;
  
      console.log('blocked_id:', blocked_id);
      console.log('id :', currentUserId);
  
      // Solution: Utiliser une sous-requête pour pouvoir utiliser l'alias "distance" dans le filtrage
      let query = `
      SELECT * FROM (
        SELECT 
          u.id, u.email, u.firstname, u.lastname, u.description, u.interests, u.age, u.city, 
          u.profile_picture, u.gender, u.preference, u.fame_rate, u.lastConnection, u.isonline,
          COALESCE(
            ARRAY_AGG(ui.image_url) FILTER (WHERE ui.image_url IS NOT NULL),
            ARRAY[]::text[]
          ) AS images`;
      
      const params = [];
      
      // Ajout du calcul de distance si les coordonnées sont fournies
      if (latitude && longitude) {
        query += `,
        ROUND(6371 * acos(
          cos(radians($1)) *
          cos(radians(latitude)) *
          cos(radians(longitude) - radians($2)) +
          sin(radians($1)) *
          sin(radians(latitude))
        )) AS distance`;
        params.push(parseFloat(latitude), parseFloat(longitude));
      }
      
      query += ` FROM users u
        LEFT JOIN user_images ui ON ui.user_id = u.id
        WHERE u.id != $${params.length + 1}
        AND u.id NOT IN (
          SELECT blocked_id FROM blocks WHERE blocker_id = $${params.length + 1}
          UNION
          SELECT blocker_id FROM blocks WHERE blocked_id = $${params.length + 1}
        )`;
      params.push(currentUserId);
      
      // Exclure les profils déjà interagis
      if (excludeIds && excludeIds.length > 0) {
        const placeholders = excludeIds.map((_, index) => `$${params.length + index + 1}`).join(',');
        query += ` AND u.id NOT IN (${placeholders})`;
        params.push(...excludeIds);
      }
      
      // Filtres d'âge
      if (minAge) {
        query += ` AND age >= $${params.length + 1}`;
        params.push(parseInt(minAge));
      }
      
      if (maxAge) {
        query += ` AND age <= $${params.length + 1}`;
        params.push(parseInt(maxAge));
      }

      // Amélioration de la logique de matching pour vérifier la compatibilité mutuelle
      if (gender && sexualPreference) {
        console.log(`Filtrage par genre et préférences: genre=${gender}, préférence=${sexualPreference}`);
        
        // L'utilisateur cherche des profils qui correspondent à ses critères
        // ET ces profils doivent aussi être intéressés par le genre de l'utilisateur
        
        if (sexualPreference === 'Homme') {
          // L'utilisateur cherche des hommes
          query += ` AND u.gender = 'Homme' AND (u.preference = '${gender}' OR u.preference = 'Les deux')`;
        }
        else if (sexualPreference === 'Femme') {
          // L'utilisateur cherche des femmes
          query += ` AND u.gender = 'Femme' AND (u.preference = '${gender}' OR u.preference = 'Les deux')`;
        }
        else if (sexualPreference === 'Non binaire') {
          // L'utilisateur cherche des personnes non binaires
          query += ` AND u.gender = 'Non binaire' AND (u.preference = '${gender}' OR u.preference = 'Les deux')`;
        }
        else if (sexualPreference === 'Les deux') {
          // L'utilisateur cherche tout le monde
          query += ` AND (
            (u.gender = 'Homme' AND (u.preference = '${gender}' OR u.preference = 'Les deux'))
            OR
            (u.gender = 'Femme' AND (u.preference = '${gender}' OR u.preference = 'Les deux'))
            OR
            (u.gender = 'Non binaire' AND (u.preference = '${gender}' OR u.preference = 'Les deux'))
          )`;
        }
      }

      if (fame_rate) {
        query += ` AND fame_rate <= $${params.length + 1}`;
        params.push(parseInt(fame_rate));
      }

    // Filtrage par intérêts - ne s'applique que si des intérêts sont sélectionnés
    if (interests) {
      let interestsArray = [];
    
      if (Array.isArray(interests)) {
        interestsArray = interests;
      } else if (typeof interests === 'string') {
        interestsArray = interests.replace(/[{}"]/g, '').split(',').map(i => i.trim()).filter(i => i.length > 0);
      }
    
      console.log('interestsArray:', interestsArray);
      console.log('interestsArray.length:', interestsArray.length);
    
      // Ne filtrer par intérêts que si au moins un intérêt est sélectionné
      if (interestsArray.length > 0) {
        const nextParamIndex = params.length + 1;
    
        query += ` AND interests && $${nextParamIndex}::text[]`; // Filtre : au moins un intérêt commun
    
        // Ajout du calcul des intérêts communs
        query = query.replace(
          'SELECT ',
          `SELECT cardinality(ARRAY(
             SELECT UNNEST(interests)
             INTERSECT
             SELECT UNNEST($${nextParamIndex}::text[])
           )) AS common_interests, `
        );
    
        params.push(interestsArray);
        console.log('Filtre par intérêts appliqué avec:', interestsArray);
      } else {
        console.log('Aucun intérêt sélectionné, pas de filtrage par intérêts');
      }
    }
      
      // Fermer la sous-requête
      query += ` GROUP BY u.id, u.email, u.firstname, u.lastname, u.description, u.interests, u.age, u.city, 
        u.profile_picture, u.gender, u.preference, u.fame_rate, u.lastConnection, u.isonline
      ) AS filtered_users`;
      
      // Maintenant on peut filtrer par distance puisque c'est une colonne dans la sous-requête
      if (latitude && longitude && maxDistance) {
        query += ` WHERE distance <= $${params.length + 1}`;
        params.push(parseFloat(maxDistance));
      }
      
      
      // Tri des résultats
      // if (ordered) {
        //   if (ordered === "age") {
            //     query += ` ORDER BY age`;
            //   } else if (ordered === "distance" && latitude && longitude) {
                //     query += ` ORDER BY distance`;
                //   } else if (ordered === "interests") {
                    // query += ` ORDER BY interests`;
                    //   }
      // } else if (latitude && longitude) {
      //   // Par défaut, trier par distance si les coordonnées sont fournies
      //   query += ` ORDER BY distance`;
      // }
  
      const result = await db.query(query, params);
      
      console.log('Nombre de profils trouvés:', result.rows ? result.rows.length : result.length);
      console.log('Requête SQL générée:', query);
      console.log('Paramètres SQL:', params);
      
      res.status(200).json({
        message: 'Liste des utilisateurs récupérée avec succès',
        users: result.rows || result
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

    await db.delete('matches', { match_id });
    
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
      WHERE b.blocker_id = $1;
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