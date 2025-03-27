import express from 'express';
import userCtrl from '../controllers/userControllers.js';
import authMiddleware from './authMiddleware.js';
import cloudinary from "../routes/cloudinaryConfig.js";
import upload from "../routes/uploadMiddleware.js";


const router = express.Router();


router.post('/register', userCtrl.registerUser);
router.put('/fillInfo', userCtrl.fillInfo);
router.get('/confirm-email/:token', userCtrl.confirmEmail);
router.post('/login', userCtrl.logUser);
router.post('/upload', authMiddleware, upload.array("images", 5), userCtrl.imageUpload);


router.get('/user', authMiddleware, userCtrl.getUser);
router.post('/allUsers', authMiddleware, userCtrl.getAllUsers);
// router.get('user/:id', authMiddleware, userCtrl.getUser);

router.post('/record-profile-view', authMiddleware, userCtrl.recordProfileView);
router.post('/likeUser', userCtrl.likeUser);
router.delete('/dislikeUser', userCtrl.dislikeUser);
router.post('/unlikeUser', userCtrl.unlikeUser);
router.get('/getLikes', userCtrl.getLikes);
router.get('/getOtherLikes', userCtrl.getOtherLikes);
router.get('/getMatches', userCtrl.getMatches);

router.get('/getMessages/:match_id', authMiddleware, userCtrl.getMessages);
router.post('/sendMessage', authMiddleware, userCtrl.sendMessage);
router.get('/getNotifications', authMiddleware, userCtrl.getNotifications);
router.post('/sendNotification', authMiddleware, userCtrl.sendNotification);

router.put('/updateUser', authMiddleware, userCtrl.updateUser);
router.post('/blockUser', userCtrl.blockUser);
router.post('/getBlockUser', userCtrl.getBlockUser);
// router.delete('/unblockUser', userCtrl.unblockUser);
// router.post('/signalUser', authMiddleware , userCtrl.signalUser);

// router.put('/logout', authMiddleware, userCtrl.logoutUser);

// router.post('/forgot-password', userController.forgotPassword);
// router.post('/reset-password', userController.resetPassword);





export default router;