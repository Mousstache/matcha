import { User } from '../models/user.js';

export const userController = {
  // Obtenir tous les utilisateurs
  async getAllUsers(req, res) {
    try {
      const users = await User.query()
        .orderBy('created_at', 'DESC')
        .limit(10)
        .findAll();
      
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // Obtenir un utilisateur par ID avec ses posts
  async getUserById(req, res) {
    try {
      const user = await User.query()
        .include('posts')
        .findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // Créer un nouvel utilisateur
  async createUser(req, res) {
    try {
      // Validation
      const errors = User.validate(req.body);
      if (errors) {
        return res.status(400).json({ errors });
      }
      
      const newUser = await User.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // Mettre à jour un utilisateur
  async updateUser(req, res) {
    try {
      const updated = await User.update(req.params.id, req.body);
      
      if (!updated) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  // Supprimer un utilisateur
  async deleteUser(req, res) {
    try {
      const deleted = await User.delete(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      
      res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};