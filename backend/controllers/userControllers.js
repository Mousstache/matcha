import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendConfirmationEmail } from '../utils/emailService.js';
import db from '../config/db.js';
import cloudinary from "../routes/cloudinaryConfig.js";
// import { v2 as cloudinary } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import multer from "multer";
// import { log } from 'console';



const userController = {
  registerUser: async (req, res) => {
    try {
      const { email, userName, firstName, lastName, password } = req.body;
      

      const existingUser = await db.findOne('users', { email });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'Un utilisateur avec cet email existe déjà' 
        });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Générer un token de confirmation
      const confirmationToken = crypto.randomBytes(32).toString('hex');
      const confirmationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      

      const result = await db.insert('users', {
        email,
        password: hashedPassword,
        userName,
        firstName,
        lastName,
        confirmationToken,
        confirmationTokenExpires,
        emailConfirmed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      

      await sendConfirmationEmail(email, confirmationToken);
      
      const token = jwt.sign(
        { 
          id: result.id, 
          email: email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      const userResponse = {
        id: result.id,
        email,
        firstName,
        lastName,
        userName,
      };
      
      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: userResponse,
        token
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      
      if (error.code === '23505') { // Code unique pour les violations de contrainte unique dans PostgreSQL
        return res.status(400).json({
          message: 'Erreur de validation',
          errors: ['Cette valeur existe déjà dans la base de données']
        });
      }
      
      if (error.code === '42703') { // Code pour colonne inexistante dans PostgreSQL
        return res.status(400).json({
          message: 'Erreur de validation',
          errors: ['Champ invalide']
        });
      }
      
      res.status(500).json({
        message: 'Erreur serveur lors de la création de l\'utilisateur'
      });
    }
  },

  fillInfo: async (req, res) => {
    try{

      const token = req.headers.authorization?.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await db.findOne('users',  { email: decoded.email });
      if (!user) {
        return res.status(400).json({ message: "ID utilisateur requis" });
      }


      const {description, gender, birthDate, preference, interests, city, country, latitude, longitude } = req.body;

      const conditions = { id: user.id};

      const updateData = {};
      if (description !== undefined) updateData.description = description;
      if (gender !== undefined) updateData.gender = gender;
      if (birthDate !== undefined) updateData.birthDate = birthDate;
      if (preference !== undefined) updateData.preference = preference;
      if (interests !== undefined) updateData.interests = interests;
      if (city !== undefined) updateData.city = city;
      if (country !== undefined) updateData.country = country;
      if (latitude !== undefined) updateData.latitude = latitude;
      if (longitude !== undefined) updateData.longitude = longitude;
      


      await db.update('users', updateData , conditions);

      res.status(200).json({ message: "Informations mises à jour avec succès" });

    }catch (error){
      console.error("Erreur lors de l'update des infos", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour des informations" });
    }
  },

  updateUser: async (req, res) => {
    try{

      const token = req.headers.authorization?.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await db.findOne('users',  { email: decoded.email });


      console.log("dans le back", user.id, ">>>>>>>", user.email);

      if (!user) {
        return res.status(400).json({ message: "ID utilisateur requis" });
      }

      console.log("user id = ", user.id);

      const {lastName, firstName, description, gender, birthDate, preference, interests} = req.body;

      const conditions = { id: user.id};

      const updateData = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (description !== undefined) updateData.description = description;
      if (gender !== undefined) updateData.gender = gender;
      if (birthDate !== undefined) updateData.birthDate = birthDate;
      if (preference !== undefined) updateData.preference = preference;
      if (interests !== undefined) updateData.interests = interests;


      await db.update('users', updateData , conditions);

      res.status(200).json({ message: "Informations mises à jour avec succès" });

    }catch (error){
      console.error("Erreur lors de l'update des infos", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour des informations" });
    }
  },
  
  confirmEmail: async (req, res) => {
    try {
      const { token } = req.params;
      
      console.log('Token reçu:', token);
      
      const sql = `
        SELECT * FROM users 
        WHERE confirmationToken = ? 
        AND confirmationTokenExpires > ?
      `;
      
      const now = new Date();
      const users = await db.query(sql, [token, now]);
      
      if (users.length === 0) {
        return res.status(400).json({
          message: 'Token invalide ou expiré'
        });
      }
      
      await db.update(
        'users',
        {
          emailConfirmed: true,
          confirmationToken: null,
          confirmationTokenExpires: null,
          updatedAt: new Date()
        },
        { id: users[0].id }
      );
      
      res.status(200).json({
        message: 'Email confirmé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la confirmation de l\'email:', error);
      res.status(500).json({
        message: 'Erreur serveur lors de la confirmation de l\'email'
      });
    }
  },
  
  logUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await db.findOne('users', { email });
      if (!user) {
        return res.status(401).json({ 
          message: 'Identifiants invalides' 
        });
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          message: 'Identifiants invalides' 
        });
      }
      
      await db.update(
        'users',
        {
          isOnline: true,
          lastConnection: new Date(),
          updatedAt: new Date()
        },
        { id: user.id }
      );
      
      // Générer un token JWT
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Préparer la réponse utilisateur (sans le mot de passe)
      const userResponse = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        isOnline: true,
        lastConnection: new Date()
      };
      
      res.status(200).json({
        message: 'Connexion réussie',
        user: userResponse,
        token,
        redirectUrl: '/profile'
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la connexion' 
      });
    }
  },

  imageUpload: async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "Aucune image reçue" });
      }
  
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ error: "Token manquant" });
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      const images = req.files.map((file) => file.path);
      const profilePicture = images[0];
      const otherPictures = images.slice(1);

      console.log("profilePicture:", profilePicture);
  
      await db.update(
        'users',
        { profile_picture: profilePicture },
        { id: userId }
      );
  
      res.status(200).json({
        message: "Images uploadées avec succès",
        profilePicture,
        otherPictures,
      });
    } catch (error) {
      console.error("Erreur d'upload :", error);
      res.status(500).json({ error: "Erreur lors de l'upload des images" });
    }
  },

  recordProfileView: async (req, res) => {
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
  },
  
  

  getUser: async (req, res) => {
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
  },

  getAllUsers: async (req, res) => {
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
        if (odrdered === "age"){
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
  },

  unlikeUser: async(req, res) => {
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
  },

  dislikeUser: async(req, res) => {
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
  },


  likeUser: async(req, res) => {
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
  },

  getLikes: async (req, res) => {
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
  },

  getOtherLikes: async (req, res) => {
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
  },

  getMatches: async (req, res) => {
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
  },
};




export default userController;









// export default {
//   // Route de test simple
//   hello: (req, res) => {
//     res.json({ message: 'Hello from Express!' });
//   },

//   createUser: async (req, res) => {
//     try {
//       const { 
//         description, 
//         preference, 
//         gender,
//         birthDate,
//         age,
//         interests,
//         isOnline,
//         lastConnection
//       } = req.body;

//       const token = req.headers.authorization?.split(' ')[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const userId = decoded.id;

//       const user = await User.findByPk(userId);

//       const updateData = {};
//       if (req.body.gender !== undefined) updateData.gender = req.body.gender;
//       if (req.body.isOnline !== undefined) updateData.isOnline = req.body.isOnline;
//       if (req.body.age !== undefined) updateData.age = req.body.age;
//       if (req.body.description !== undefined) updateData.description = req.body.description;
//       if (req.body.preference !== undefined) updateData.preference = req.body.preference;
//       if (req.body.birthDate !== undefined) updateData.birthDate = req.body.birthDate;
//       if (req.body.interests !== undefined) updateData.interests = req.body.interests;

//       await user.update(updateData);

//         const userResponse = {
//           id: User.id,
//           email: User.email,
//           firstName: User.firstName,
//           lastName: User.lastName
//         };
        
//         res.status(201).json({
//           message: 'Utilisateur créé avec succès',
//           user: userResponse,
//           token,
//         });
        
//       } catch (error) {
//         console.error('Erreur lors de la création de l\'utilisateur:', error);
        
//         if (error.name === 'SequelizeValidationError') {
//           return res.status(400).json({
//             message: 'Erreur de validation',
//             errors: error.errors.map(e => e.message)
//           });
//         }
        
//         res.status(500).json({ 
//           message: 'Erreur serveur lors de la création de l\'utilisateur' 
//         });
//       }
//     },
    
//     registerUser: async(req, res) => {
//       try{
//         const { email, userName, firstName, lastName, password} = req.body
        
//         const existingUser = await User.findOne({ where: { email } });
//         if (existingUser) {
//           return res.status(400).json({ 
//             message: 'Un utilisateur avec cet email existe déjà' 
//           });
//         }
        
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Générer un token de confirmation
//         const confirmationToken = crypto.randomBytes(32).toString('hex');
//         const confirmationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
//         const newUser = await User.create({
//           email,
//           password: hashedPassword,
//           userName,
//           firstName,
//           lastName,
//           confirmationToken,
//           confirmationTokenExpires,
//           emailConfirmed: false
//         });
        
//         await sendConfirmationEmail(email, confirmationToken);

//         const token = jwt.sign(
//           { 
//             id: newUser.id, 
//             email: newUser.email 
//           },
//           process.env.JWT_SECRET,
//           { expiresIn: '24h' }
//         );

//       const userResponse = {
//         id: newUser.id,
//         email: newUser.email,
//         firstName: newUser.firstName,
//         lastName: newUser.lastName,
//         confirmationToken: newUser.confirmationToken
//       };

//       res.status(201).json({
//         message: 'Utilisateur créé avec succès',
//         user: userResponse,
//         token,
//       });

//     }catch  (error){
//       console.error('Erreur lors de la création de l\'utilisateur:', error);
      
//       if (error.name === 'SequelizeValidationError') {
//         return res.status(400).json({
//           message: 'Erreur de  validation register',
//           errors: error.errors.map(e => e.message)
//         });
//       }

//       res.status(500).json({ 
//         message: 'Erreur serveur lors de la registration de l\'utilisateur' 
//       });
//     }
//   },

//   logUser: async (req, res) => {
//     try {
//       const { email, password , lastConnection } = req.body;

//       const user = await User.findOne({ where: { email } });
//       if (!user) {
//         return res.status(401).json({ 
//           message: 'Identifiants invalides' 
//         });
//       }

//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         return res.status(401).json({ 
//           message: 'Identifiants invalides' 
//         });
//       }

//       const token = jwt.sign(
//         { 
//           id: user.id, 
//           email: user.email 
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: '24h' }
//       );

//       const userResponse = {
//         id: user.id,
//         email: user.email,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         isOnline: user.isOnline,
//         lastConnection: user.lastConnection
//       };

//       res.status(200).json({
//         message: 'Connexion réussie',
//         user: userResponse,
//         token,
//         redirectUrl: '/profile'
//       });

//     } catch (error) {
//       console.error('Erreur lors de la connexion:', error);
//       res.status(500).json({ 
//         message: 'Erreur serveur lors de la connexion' 
//       });
//     }
//   },

//   getUser: async (req, res) => {
//     try{
//         const token = req.headers.authorization?.split(' ')[1];
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const userId = decoded.id;

//         const user = await User.findByPk(userId, {
//           attributes: { exclude: ['password'] }
//         });

//         res.status(200).json({
//           user: user
//         });
        

//     }catch(error){
//       console.error('Erreur lors de la récupération de l\'utilisateur:', error);
//       res.status(500).json({ 
//         message: 'Erreur serveur lors de la récupération de l\'utilisateur'
//       });
//     } 
//   },

//   updateUser: async (req, res) => {
//     try{
//       const token = req.headers.authorization?.split(' ')[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const userId = decoded.id;

//       const user = await User.findByPk(userId);

//       if (!user) {
//         return res.status(404).json({ message: 'Utilisateur non trouvé' });
//       }

//       console.log("Données reçues:", req.body);
    
//       const updateData = {};
      
//       if (req.body.email !== undefined) updateData.email = req.body.email;
//       if (req.body.firstName !== undefined) updateData.firstName = req.body.firstName;
//       if (req.body.lastName !== undefined) updateData.lastName = req.body.lastName;
//       if (req.body.description !== undefined) updateData.description = req.body.description;
//       if (req.body.preference !== undefined) updateData.preference = req.body.preference;
//       if (req.body.birthDate !== undefined) updateData.birthDate = req.body.birthDate;
//       if (req.body.interests !== undefined) updateData.interests = req.body.interests;

//       await user.update(updateData);
//       return res.status(200).json({ message: 'Utilisateur mis à jour avec succès', user });

//     }catch(error){
//       console.error('Erreur lors de la modification de l\'utilisateur:', error);
//       res.status(500).json({ 
//         message: 'Erreur serveur lors de la modification de l\'utilisateur'
//       });
//     }
//   },

//   logoutUser: async (req, res) => {
//     try{
//       const token = req.headers.authorization?.split(' ')[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const userId = decoded.id;

//       const user = await User.findByPk(userId);

//       if (!user) {
//         return res.status(404).json({ message: 'Utilisateur non trouvé' });
//       }

//       user.isOnline = false;
//       user.lastConnection = new Date();
//       await user.save();

//       res.status(200).json({ message: 'Déconnexion réussie' });

//     }catch(error){
//       console.error('Erreur lors de la déconnexion de l\'utilisateur:', error);
//       res.status(500).json({ 
//         message: 'Erreur serveur lors de la déconnexion de l\'utilisateur'
//       });
//     }
//   },

//   getAllUsers: async (req, res) => {
//     try{
//       const users = await User.findAll({
//         attributes: { exclude: ['password'] }
//       });

//       res.status(200).json({
//         users: users
//       });

//       res.status(200).json({ message: 'Liste des utilisateurs récupérée avec succès' });

//     }catch(error){
//       console.error('Erreur lors de la récupération des utilisateurs:', error);
//       res.status(500).json({ 
//         message: 'Erreur serveur lors de la récupération des utilisateurs'
//       });
//     }
//   },

//   confirmEmail: async (req, res) => {
//     try {
//       const { token } = req.params;

//       console.log('Token reçu:', token);
      
//       const user = await User.findOne({ 
//         where: { 
//           confirmationToken: token,
//           confirmationTokenExpires: { [Op.gt]: new Date() }
//         }
//       });
      
//       if (!user) {
//         return res.status(400).json({
//           message: 'Token invalide ou expiré'
//         });
//       }
      
//       // Confirmer l'email de l'utilisateur
//       await user.update({
//         emailConfirmed: true,
//         confirmationToken: null,
//         confirmationTokenExpires: null
//       });
      
//       res.status(200).json({
//         message: 'Email confirmé avec succès'
//       });
//     } catch (error) {
//       console.error('Erreur lors de la confirmation de l\'email:', error);
//       res.status(500).json({
//         message: 'Erreur serveur lors de la confirmation de l\'email'
//       });
//     }
//   },

  // imageUpload: async (req, res) => {
  //   try {
  //     if (!req.files) {
  //       return res.status(400).json({ error: "Aucune image reçue" });
  //     }
  
  //     const images = req.files.map((file) => file.path);
  //     res.status(200).json({ message: "Images uploadées avec succès", images });
  //   } catch (error) {
  //     res.status(500).json({ error: "Erreur lors de l'upload des images" });
  //   }
  // },

  // forgotPassword: async (req, res) => {
  //   try {
  //     const { email } = req.body;
      
  //     const user = await User.findOne({ where: { email } });
  //     if (!user) {
  //       return res.status(404).json({
  //         message: 'Aucun utilisateur trouvé avec cet email'
  //       });
  //     }
      
  //     // Générer un token de réinitialisation
  //     const resetToken = crypto.randomBytes(32).toString('hex');
  //     const resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 heure
      
  //     await user.update({
  //       resetPasswordToken: resetToken,
  //       resetPasswordExpires: resetTokenExpires
  //     });
      
  //     // Envoyer l'email de réinitialisation
  //     await sendPasswordResetEmail(email, resetToken);
      
  //     res.status(200).json({
  //       message: 'Un email de réinitialisation a été envoyé'
  //     });
  //   } catch (error) {
  //     console.error('Erreur lors de la demande de réinitialisation du mot de passe:', error);
  //     res.status(500).json({
  //       message: 'Erreur serveur lors de la demande de réinitialisation du mot de passe'
  //     });
  //   }
  // },
  
  // resetPassword: async (req, res) => {
  //   try {
  //     const { token, newPassword } = req.body;
      
  //     const user = await User.findOne({ 
  //       where: { 
  //         resetPasswordToken: token,
  //         resetPasswordExpires: { [Op.gt]: new Date() }
  //       }
  //     });
      
  //     if (!user) {
  //       return res.status(400).json({
  //         message: 'Token invalide ou expiré'
  //       });
  //     }
      
  //     // Hasher le nouveau mot de passe
  //     const hashedPassword = await bcrypt.hash(newPassword, 10);
      
  //     // Mettre à jour le mot de passe et réinitialiser les tokens
  //     await user.update({
  //       password: hashedPassword,
  //       resetPasswordToken: null,
  //       resetPasswordExpires: null
  //     });
      
  //     res.status(200).json({
  //       message: 'Mot de passe réinitialisé avec succès'
  //     });
  //   } catch (error) {
  //     console.error('Erreur lors de la réinitialisation du mot de passe:', error);
  //     res.status(500).json({
  //       message: 'Erreur serveur lors de la réinitialisation du mot de passe'
  //     });
  //   }
  // }
// };
