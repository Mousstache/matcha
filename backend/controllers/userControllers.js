import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendConfirmationEmail } from '../utils/emailService.js';
import db from '../config/db.js';
// import { log } from 'console';



const userController = {
  registerUser: async (req, res) => {
    try {
      const { email, userName, firstName, lastName, password } = req.body;
      
      // Vérifier si l'utilisateur existe déjà
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
      
      // Générer un JWT pour l'authentification
      const token = jwt.sign(
        { 
          id: result.id, 
          email: email 
        },
        config.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      // Préparer la réponse
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
  
  confirmEmail: async (req, res) => {
    try {
      const { token } = req.params;
      
      console.log('Token reçu:', token);
      
      // Chercher l'utilisateur avec ce token qui n'a pas expiré
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
      
      // Mettre à jour l'utilisateur pour confirmer son email
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
      
      // Rechercher l'utilisateur par email
      const user = await db.findOne('users', { email });
      if (!user) {
        return res.status(401).json({ 
          message: 'Identifiants invalides' 
        });
      }
      
      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          message: 'Identifiants invalides' 
        });
      }
      
      // Mettre à jour le statut en ligne et la dernière connexion
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
        config.JWT_SECRET,
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
  }
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
