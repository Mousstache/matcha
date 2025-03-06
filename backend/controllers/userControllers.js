import bcrypt from 'bcrypt';
// import pkg from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// const {jwt} = pkg;

export default {
  // Route de test simple
  hello: (req, res) => {
    res.json({ message: 'Hello from Express!' });
  },

  createUser: async (req, res) => {
    try {
      const { 
        email, 
        password, 
        firstName, 
        lastName, 
        description, 
        preference, 
        gender 
      } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'Un utilisateur avec cet email existe déjà' 
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        description: description || '',
        preference,
        gender
      });

      const token = jwt.sign(
        { 
          id: newUser.id, 
          email: newUser.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const userResponse = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      };

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: userResponse,
        token,
        RedirectUrl: '/profile'
      });

    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          message: 'Erreur de validation',
          errors: error.errors.map(e => e.message)
        });
      }

      res.status(500).json({ 
        message: 'Erreur serveur lors de la création de l\'utilisateur' 
      });
    }
  },

  logUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
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

      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const userResponse = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
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

  getUser: async (req, res) => {
    try{
        const token = req.headers.authorization?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findByPk(userId, {
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

  updateUser: async (req, res) => {
    try{
      const token = req.headers.authorization?.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const { 
        email, 
        firstName, 
        lastName, 
        description, 
        preference
      } = req.body;

    }catch(error){
      console.error('Erreur lors de la modification de l\'utilisateur:', error);
      res.status(500).json({ 
        message: 'Erreur serveur lors de la modification de l\'utilisateur'
      });
    }
  }
};
