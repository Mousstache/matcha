import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendConfirmationEmail } from '../utils/emailService.js';
import db from '../config/db.js';

export async function registerUser(req,res){
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

      console.log("token", token);
      
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
  };

  export async function fillInfo(req, res){
    try{

      const token = req.headers.authorization?.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await db.findOne('users',  { email: decoded.email });
      if (!user) {
        return res.status(400).json({ message: "ID utilisateur requis" });
      }


      const {description, gender, birthDate, preference, interests, city, country, latitude, longitude,age } = req.body;

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
      if (age !== undefined) updateData.age = age;

      


      await db.update('users', updateData , conditions);

      res.status(200).json({ 
        message: "Informations mises à jour avec succès",
        email: user.email, // On renvoie l'email
        password: user.password // ⚠️ Optionnel : Seulement si tu veux aussi pré-remplir le mot de passe
    });

    }catch (error){
      console.error("Erreur lors de l'update des infos", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour des informations" });
    }
  };


  export async function updateUser (req, res){
    try{

      const token = req.headers.authorization?.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await db.findOne('users',  { email: decoded.email });


      console.log("dans le back", user.id, ">>>>>>>", user.email);

      
      if (!user) {
        return res.status(400).json({ message: "ID utilisateur requis" });
      }
      
      console.log("user id = ", user.id);
      
      const {email, lastname, firstname, description, gender, birthDate, preference, interests, city, age} = req.body;
      console.log(firstname, lastname, description);

      const conditions = { id: user.id};

      const updateData = {};
      if (firstname !== undefined) updateData.firstname = firstname;
      if (lastname !== undefined) updateData.lastname = lastname;
      if (description !== undefined) updateData.description = description;
      if (gender !== undefined) updateData.gender = gender;
      if (birthDate !== undefined) updateData.birthDate = birthDate;
      if (preference !== undefined) updateData.preference = preference;
      if (interests !== undefined) updateData.interests = interests;
      if (city !== undefined) updateData.city = city;
      if (email !== undefined) updateData.email = email;
      if (age !== undefined) updateData.age = age;


      await db.update('users', updateData , conditions);

      res.status(200).json({ message: "Informations mises à jour avec succès" });

    }catch (error){
      console.error("Erreur lors de l'update des infos", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour des informations" });
    }
  };

export async function confirmEmail (req, res){
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
};


export async function logUser (req, res){
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
};
  
  
export async function imageUpload (req, res){
try {

  console.log("req.files", req.files);
  
    if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "Aucune image reçue" });
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token manquant" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    await db.query('DELETE FROM user_images WHERE user_id = $1', [userId]);


    const insertImageQuery = `
    INSERT INTO user_images (user_id, image_url, position)
    VALUES ($1, $2, $3)
    `;

    const images = req.files;

    for (let i = 0; i < images.length && i < 5; i++) {
      await db.query(insertImageQuery, [userId, images[i].path, i + 1]);
    }

    // const profilePicture = images[0];
    // const otherPictures = images.slice(1);

    if (!profilePicture.length > 4) {
      console.log("profilePicture.length", profilePicture.length);
    }

    // console.log("profilePicture:", profilePicture);

    // await db.update(
    // 'users',
    // { profile_picture: profilePicture },
    // { id: userId }
    // );

    res.status(200).json({
    message: "Images uploadées avec succès",
    images: images.map(img => img.path),
    profilePicture,
    otherPictures,
    });
} catch (error) {
    console.error("Erreur d'upload :", error);
    res.status(500).json({ error: "Erreur lors de l'upload des images" });
}
};

export async function getUserImages(req, res) {
  try {
    const userId = req.user.id;

    const result = await db.query(
      'SELECT image_url, position FROM user_images WHERE user_id = $1 ORDER BY position',
      [userId]
    );

    res.status(200).json({ images: result.rows });
  } catch (error) {
    console.error("Erreur lors de la récupération des images :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
  

export default {getUserImages, registerUser, fillInfo, confirmEmail, updateUser, logUser, imageUpload };