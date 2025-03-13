// import express from 'express';
// // import User from '../models/User';
// // import { User } from '../models/index.js';

// const router = express.Router();

// router.post('/user', async (req, res) => {
//     try{
//         const { email, password, description, preference, firstName, lastName, gender } = req.body;
         
//         const userExists = await User.findOne({ where: { email } });
//         if(userExists) {
//             return res.status(400).json({ message: 'Email already exists' });
//         }
        
//         const user = await User.create({ email, password, description: description || '', preference, firstName, lastName, gender });

//         await user.save();

//         res.status(201).json({
//             success: true,
//             message: 'Inscription réussie',
//             user: userResponse
//           });

//         // Supprimer le mot de passe de la réponse
//         const userResponse = user.toJSON();
//         delete userResponse.password;
//     }catch (error) {
//         console.error('Erreur lors de l\'inscription:', error);
    
//         // Gérer les erreurs de validation
//         if (error.name === 'SequelizeValidationError') {
//           return res.status(400).json({
//             error: error.errors.map(e => e.message).join(', ')
//           });
//         }
        
//         res.status(500).json({
//           error: 'Erreur serveur lors de l\'inscription'
//         });
// }
// });

// export default router;