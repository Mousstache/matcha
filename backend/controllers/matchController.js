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

        // Envoi de notifications en temps réel pour les deux utilisateurs
        if (likedSocketId) {
          io.to(likedSocketId).emit('match', {
            type: 'match',
            message: `Vous avez un nouveau match avec ${user2.firstname} ${user2.lastname}!`,
            userId: liker_id,
            userInfo: {
              id: liker_id,
              firstname: user2.firstname,
              lastname: user2.lastname,
              profile_picture: user2.profile_picture
            }
          });
        }

        if (likerSocketId) {
          io.to(likerSocketId).emit('match', {
            type: 'match',
            message: `Vous avez un nouveau match avec ${user.firstname} ${user.lastname}!`,
            userId: liked_id,
            userInfo: {
              id: liked_id,
              firstname: user.firstname,
              lastname: user.lastname,
              profile_picture: user.profile_picture
            }
          });
        }

      return res.status(201).json({
        message: "c'est un match",
        isMatch: true
      })
    }
    
    await db.insert('likes', {liker_id, liked_id});

    // Notification pour un simple like
    if (likedSocketId) {
      const liker = await db.findOne('users', { id: liker_id });
      io.to(likedSocketId).emit('like', {
        type: 'like',
        message: `${liker.firstname} ${liker.lastname} vous a liké!`,
        userId: liker_id,
        userInfo: {
          id: liker_id,
          firstname: liker.firstname,
          lastname: liker.lastname,
          profile_picture: liker.profile_picture
        }
      });
    }

      return res.status(201).json({
        message: "like ajouter",
        isMatch: false
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
      SELECT 
        u.id, u.email, u.firstname, u.lastname, u.description, u.interests, u.age, u.city, 
        u.profile_picture, u.gender, u.preference, u.fame_rate, u.lastConnection, u.isonline,
        COALESCE(
          ARRAY_AGG(ui.image_url) FILTER (WHERE ui.image_url IS NOT NULL),
          ARRAY[]::text[]
        ) AS images
      FROM likes l
      JOIN users u ON l.liked_id = u.id
      LEFT JOIN user_images ui ON ui.user_id = u.id
      WHERE l.liker_id = $1
      AND u.id NOT IN (
        SELECT blocked_id FROM blocks WHERE blocker_id = $1
        UNION
        SELECT blocker_id FROM blocks WHERE blocked_id = $1
      )
      GROUP BY u.id, u.email, u.firstname, u.lastname, u.description, u.interests, u.age, u.city, 
               u.profile_picture, u.gender, u.preference, u.fame_rate, u.lastConnection, u.isonline
    `;

    const likes = await db.query(sql, [user.id]);

    return res.status(200).json({
      message: "liste des likes",
      likes: likes.rows || likes,
    });
  }catch(error){
    console.error('Error lors de la recup des likes', error);
    return res.status(500).json({ message: "Erreur lors de la récupération des likes" });
  }
};



  export async function dislikeUser (req, res){
    try{
      const { liked_id, liker_id } = req.body;
  
      if (!liker_id || !liked_id) {
        return res.status(400).json({
          message: "Données manquantes",
        });
      }

      if (liker_id === liked_id) {
        return res.status(400).json({
          message: "Impossible de se disliker soi-même",
        });
      }

      // Vérifier si déjà disliké
      const existingDislike = await db.findOne('dislikes', {
        disliker_id: liker_id,
        disliked_id: liked_id
      });

      if (existingDislike) {
        return res.status(400).json({
          message: "Profil déjà disliké",
        });
      }

      // Ajouter le dislike
      await db.insert('dislikes', {
        disliker_id: liker_id,
        disliked_id: liked_id
      });

      // Diminuer la fame rate
      const user = await db.findOne('users', { id: liked_id });
      const newFameRate = Math.max(0, user.fame_rate - 1);
      await db.update('users', { fame_rate: newFameRate }, { id: liked_id });    
      
      return res.status(201).json({
        message: "Dislike enregistré",
      });
  
    }catch (error){
      console.error('Error lors du dislike', error);
      return res.status(500).json({
        message: "Erreur lors du dislike",
        error: error.message
      });
    }
  };
  
  export async function getOtherLikes (req, res){
    try{
  
      const token = req.headers.authorization?.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await db.findOne('users',  { email: decoded.email });
  
      const sql = `
      SELECT u.id, u.email, u.firstname, u.lastname, u.description, u.interests, u.age, u.city, 
        u.profile_picture, u.gender, u.preference, u.fame_rate, u.lastConnection, u.isonline,
        COALESCE(
          ARRAY_AGG(ui.image_url) FILTER (WHERE ui.image_url IS NOT NULL),
          ARRAY[]::text[]
        ) AS images
      FROM likes l
      JOIN users u ON l.liker_id = u.id
      LEFT JOIN user_images ui ON ui.user_id = u.id
      WHERE l.liked_id = $1
      AND u.id NOT IN (
        SELECT blocked_id FROM blocks WHERE blocker_id = $1
        UNION
        SELECT blocker_id FROM blocks WHERE blocked_id = $1
      )
      GROUP BY u.id, u.email, u.firstname, u.lastname, u.description, u.interests, u.age, u.city, 
       u.profile_picture, u.gender, u.preference, u.fame_rate, u.lastConnection, u.isonline
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
      SELECT m.match_id, u.id, u.email, u.firstname, u.lastname, u.description, u.interests, u.age, u.city, 
        u.profile_picture, u.gender, u.preference, u.fame_rate, u.lastConnection, u.isonline,
        COALESCE(
          ARRAY_AGG(ui.image_url) FILTER (WHERE ui.image_url IS NOT NULL),
          ARRAY[]::text[]
        ) AS images
      FROM matches m
      JOIN users u ON m.user2_id = u.id
      LEFT JOIN user_images ui ON ui.user_id = u.id
      WHERE m.user1_id = $1
      AND u.id NOT IN (
        SELECT blocked_id FROM blocks WHERE blocker_id = $1
        UNION
        SELECT blocker_id FROM blocks WHERE blocked_id = $1
      )
      GROUP BY m.match_id, u.id, u.email, u.firstname, u.lastname, u.description, u.interests, u.age, u.city, 
       u.profile_picture, u.gender, u.preference, u.fame_rate, u.lastConnection, u.isonline
      
      UNION
      
      SELECT m.match_id, u.id, u.email, u.firstname, u.lastname, u.description, u.interests, u.age, u.city, 
        u.profile_picture, u.gender, u.preference, u.fame_rate, u.lastConnection, u.isonline,
        COALESCE(
          ARRAY_AGG(ui.image_url) FILTER (WHERE ui.image_url IS NOT NULL),
          ARRAY[]::text[]
        ) AS images
      FROM matches m
      JOIN users u ON m.user1_id = u.id
      LEFT JOIN user_images ui ON ui.user_id = u.id
      WHERE m.user2_id = $1
      AND u.id NOT IN (
        SELECT blocked_id FROM blocks WHERE blocker_id = $1
        UNION
        SELECT blocker_id FROM blocks WHERE blocked_id = $1
      )
      GROUP BY m.match_id, u.id, u.email, u.firstname, u.lastname, u.description, u.interests, u.age, u.city, 
       u.profile_picture, u.gender, u.preference, u.fame_rate, u.lastConnection, u.isonline
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

export async function getViewlist (req, res){
  try{

    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.findOne('users',  { email: decoded.email });

    const sql = `
    SELECT  u.id, u.email, u.firstname, u.lastname, u.description, u.interests, u.age, u.city, 
        u.profile_picture, u.gender, u.preference, u.fame_rate, u.lastConnection, u.isonline,
        COALESCE(
          ARRAY_AGG(ui.image_url) FILTER (WHERE ui.image_url IS NOT NULL),
          ARRAY[]::text[]
        ) AS images
    FROM consult_profile l
    JOIN users u ON l.viewer_id = u.id
    LEFT JOIN user_images ui ON ui.user_id = u.id
    WHERE l.viewed_id = $1
    AND u.id NOT IN (
      SELECT blocked_id FROM blocks WHERE blocker_id = $1
      UNION
      SELECT blocker_id FROM blocks WHERE blocked_id = $1
    )
    GROUP BY u.id, u.email, u.firstname, u.lastname, u.description, u.interests, u.age, u.city, 
          u.profile_picture, u.gender, u.preference, u.fame_rate, u.lastConnection, u.isonline
    `;

    const viewlist = await db.query(sql, [user.id]);

    return res.status(200).json({
      message: "liste des other likes",
      viewlist: viewlist,
    })

  }catch (error){
    console.log('Error lors de la recup other likes', error);
  }
};

export async function getConsultedUsers(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.findOne('users', { email: decoded.email });

    const sql = `
      SELECT  u.id, u.email, u.firstname, u.lastname, u.description, u.interests, u.age, u.city, 
        u.profile_picture, u.gender, u.preference, u.fame_rate, u.lastConnection, u.isonline,
        COALESCE(
          ARRAY_AGG(ui.image_url) FILTER (WHERE ui.image_url IS NOT NULL),
          ARRAY[]::text[]
        ) AS images
      FROM profile_views l
      JOIN users u ON l.viewed_id = u.id
      LEFT JOIN user_images ui ON ui.user_id = u.id
      WHERE l.viewer_id = $1
      AND u.id NOT IN (
        SELECT blocked_id FROM blocks WHERE blocker_id = $1
        UNION
        SELECT blocker_id FROM blocks WHERE blocked_id = $1
        )
      GROUP BY u.id, u.email, u.firstname, u.lastname, u.description, u.interests, u.age, u.city, 
            u.profile_picture, u.gender, u.preference, u.fame_rate, u.lastConnection, u.isonline
    `;

    const consulted = await db.query(sql, [user.id]);

    return res.status(200).json({
      message: "liste des profils consultés",
      consulted: consulted.rows || consulted,
    });
  } catch (error) {
    console.log('Error lors de la récupération des profils consultés', error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des profils consultés",
      error: error.message
    });
  }
}

export async function getInteractedProfiles(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.findOne('users', { email: decoded.email });

    // Récupérer tous les profils avec lesquels l'utilisateur a interagi (likes et dislikes)
    const sql = `
      SELECT DISTINCT user_id FROM (
        SELECT liked_id as user_id FROM likes WHERE liker_id = $1
        UNION
        SELECT disliked_id as user_id FROM dislikes WHERE disliker_id = $1
      ) AS interacted_profiles
    `;

    const interacted = await db.query(sql, [user.id]);
    const interactedIds = interacted.rows ? interacted.rows.map(row => row.user_id) : interacted.map(row => row.user_id);

    console.log(`Profils exclus pour l'utilisateur ${user.id}:`, interactedIds);

    return res.status(200).json({
      message: "Liste des profils déjà likés/dislikés",
      interactedIds: interactedIds,
    });
  } catch (error) {
    console.log('Error lors de la récupération des profils interagis', error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des profils interagis",
      error: error.message
    });
  }
}

export async function getRelationshipStatus(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await db.findOne('users', { email: decoded.email });
    
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        message: "ID utilisateur manquant"
      });
    }

    // Vérifier si c'est un match
    const matchQuery = `
      SELECT * FROM matches 
      WHERE (user1_id = $1 AND user2_id = $2) 
         OR (user1_id = $2 AND user2_id = $1)
      LIMIT 1
    `;
    const matchResult = await db.query(matchQuery, [currentUser.id, parseInt(userId)]);
    const match = matchResult.rows ? matchResult.rows[0] : matchResult[0];

    // Vérifier si l'utilisateur actuel a liké cet utilisateur
    const currentUserLikesTarget = await db.findOne('likes', {
      liker_id: currentUser.id,
      liked_id: parseInt(userId)
    });

    // Vérifier si cet utilisateur a liké l'utilisateur actuel
    const targetLikesCurrentUser = await db.findOne('likes', {
      liker_id: parseInt(userId),
      liked_id: currentUser.id
    });

    return res.status(200).json({
      isMatch: !!match,
      currentUserLikesTarget: !!currentUserLikesTarget,
      targetLikesCurrentUser: !!targetLikesCurrentUser,
      relationshipStatus: match ? 'match' : 
                         (currentUserLikesTarget && targetLikesCurrentUser) ? 'mutual_like' :
                         currentUserLikesTarget ? 'you_liked' :
                         targetLikesCurrentUser ? 'they_liked' : 'none'
    });

  } catch (error) {
    console.error('Error lors de la vérification du statut de relation:', error);
    return res.status(500).json({
      message: "Erreur lors de la vérification du statut de relation",
      error: error.message
    });
  }
}

export default { ConsultProfile, likeUser, unlikeUser, getLikes, getOtherLikes, getMatches, dislikeUser , getViewlist, getConsultedUsers, getInteractedProfiles, getRelationshipStatus};