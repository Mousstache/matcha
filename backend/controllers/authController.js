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
      if (city !== undefined) updateData.city = city;
      if (country !== undefined) updateData.country = country;
      if (latitude !== undefined) updateData.latitude = latitude;
      if (longitude !== undefined) updateData.longitude = longitude;
      if (age !== undefined) updateData.age = age;
      // if (interests !== undefined) updateData.interests = interests;
      if (interests !== undefined) {
        if (typeof interests === 'string') {
          // Gère le format spécial {"item1","item2"}
          const cleaned = interests.replace(/^{|}$/g, ''); // Enlève les accolades
          updateData.interests = cleaned.split(',').map(item => item.replace(/"/g, '').trim());
        } else if (Array.isArray(interests)) {
          updateData.interests = interests;
        }
      }

      console.log("intersts", interests);
      


      await db.update('users', updateData , conditions);

      res.status(200).json({ 
        message: "Informations mises à jour avec succès",
        email: user.email, 
        password: user.password
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


export async function imageUpload(req, res) {
  try {
    const files = req.files || [];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Aucune image reçue" });
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token manquant" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    console.log("userId (type):", userId, typeof userId);
    const result = await db.query(
      'SELECT image_url, position FROM user_images WHERE user_id = $1 ORDER BY position',
      [Number(userId)]
    );
    console.log("Résultat SQL brut :", result);
    const existingImages = result || [];
    console.log("existingImages =", existingImages);

    // Vérifier qu'on ne dépasse pas 5 images
    const totalImages = existingImages.length + files.length;
    if (totalImages > 5) {
      return res.status(400).json({ error: "Vous ne pouvez pas avoir plus de 5 images." });
    }

    // Trouver les positions déjà prises
    const takenPositions = existingImages.map(img => img.position);
    // Générer la liste des positions libres (1 à 5)
    const freePositions = [];
    for (let i = 1; i <= 5; i++) {
      if (!takenPositions.includes(i)) freePositions.push(i);
    }

    // Insérer les nouvelles images sur les positions libres
    for (let i = 0; i < files.length && i < freePositions.length; i++) {
      await db.query(
        'INSERT INTO user_images (user_id, image_url, position) VALUES ($1, $2, $3)',
        [userId, files[i].path, freePositions[i]]
      );
    }

    // Mettre à jour la photo principale si demandé
    const profilePictureIndex = parseInt(req.body.profilePictureIndex) || 0;
    const allImages = [...existingImages, ...files.map((img, idx) => ({
      image_url: img.path,
      position: freePositions[idx]
    }))];
    if (profilePictureIndex >= 0 && profilePictureIndex < allImages.length) {
      const profilePicture = allImages[profilePictureIndex];
      if (profilePicture) {
        await db.query(
          'UPDATE users SET profile_picture = $1 WHERE id = $2',
          [profilePicture.image_url, userId]
        );
      }
    }

    // Retourner la liste à jour
    const updatedImages = await db.query(
      'SELECT image_url, position FROM user_images WHERE user_id = $1 ORDER BY position',
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "Images uploadées avec succès",
      images: updatedImages,
      profilePicture: updatedImages[profilePictureIndex]?.image_url || null
    });
  } catch (error) {
    console.error("Erreur d'upload :", error);
    res.status(500).json({ error: "Erreur lors de l'upload des images" });
  }
}
export async function deleteUserImage(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token manquant" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { position } = req.params;

    // Supprimer l'image à la position donnée
    await db.query(
      'DELETE FROM user_images WHERE user_id = $1 AND position = $2',
      [userId, position]
    );

    // Réordonner les positions restantes
    const images = await db.query(
      'SELECT id FROM user_images WHERE user_id = $1 ORDER BY position',
      [userId]
    );
    for (let i = 0; i < images.length; i++) {
      await db.query(
        'UPDATE user_images SET position = $1 WHERE id = $2',
        [i + 1, images[i].id]
      );
    }

    // Si la photo principale a été supprimée, mettre à jour profile_picture
    const userImages = await db.query(
      'SELECT image_url FROM user_images WHERE user_id = $1 ORDER BY position',
      [userId]
    );
    const newProfilePicture = userImages[0]?.image_url || null;
    await db.query(
      'UPDATE users SET profile_picture = $1 WHERE id = $2',
      [newProfilePicture, userId]
    );

    res.status(200).json({ success: true, images: userImages, profilePicture: newProfilePicture });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image :", error);
    res.status(500).json({ error: "Erreur lors de la suppression de l'image" });
  }
}

export async function getUserImages(req, res) {
  try {
    const userId = req.user.id;

    console.log("userId", userId);

    const result = await db.query(
      'SELECT image_url, position FROM user_images WHERE user_id = $1 ORDER BY position',
      [userId]
    );

    console.log("result", result);

    res.status(200).json({ images: result });
  } catch (error) {
    console.error("Erreur lors de la récupération des images :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function setProfilePicture(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token manquant" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { position } = req.body;

    console.log("Changement de photo principale - userId:", userId, "position:", position);

    // Récupérer l'image à la position demandée
    const result = await db.query(
      'SELECT image_url FROM user_images WHERE user_id = $1 AND position = $2',
      [userId, position]
    );
    
    if (!result || result.length === 0) {
      return res.status(404).json({ error: "Image non trouvée" });
    }

    console.log("Image trouvée:", result[0].image_url);

    // Mettre à jour la photo de profil
    const updateResult = await db.query(
      'UPDATE users SET profile_picture = $1 WHERE id = $2 RETURNING profile_picture',
      [result[0].image_url, userId]
    );

    console.log("Résultat de la mise à jour:", updateResult);

    if (!updateResult || updateResult.length === 0) {
      return res.status(500).json({ error: "Erreur lors de la mise à jour de la photo de profil" });
    }

    // Vérifier que la mise à jour a bien été effectuée
    const verifyUpdate = await db.query(
      'SELECT profile_picture FROM users WHERE id = $1',
      [userId]
    );

    console.log("Vérification après mise à jour:", verifyUpdate[0]);

    res.status(200).json({ 
      success: true, 
      profilePicture: result[0].image_url,
      verified: verifyUpdate[0]?.profile_picture === result[0].image_url
    });
  } catch (error) {
    console.error("Erreur lors du changement de photo principale :", error);
    res.status(500).json({ error: "Erreur lors du changement de photo principale" });
  }
}

export default {getUserImages, registerUser, fillInfo, confirmEmail, updateUser, logUser, imageUpload, deleteUserImage };