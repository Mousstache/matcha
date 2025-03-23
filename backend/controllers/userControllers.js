import { registerUser, fillInfo, updateUser, confirmEmail, logUser, imageUpload, } from './authController.js';
import {  recordProfileView, getAllUsers, getUser } from './browseController.js';
import { likeUser, unlikeUser, getLikes, getOtherLikes, getMatches, setSocket } from './matchController.js';


export { registerUser, fillInfo, confirmEmail, logUser, imageUpload, recordProfileView, likeUser, unlikeUser, getLikes, getAllUsers, getUser, updateUser, getOtherLikes, getMatches, setSocket };

export default { registerUser, fillInfo, confirmEmail, logUser, imageUpload, recordProfileView, likeUser, unlikeUser, getLikes, getAllUsers, getUser, updateUser, getOtherLikes, getMatches, setSocket };



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
