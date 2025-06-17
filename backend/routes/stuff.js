import express from 'express';
import userCtrl from '../controllers/userControllers.js';
import {authMiddleware} from './authMiddleware.js';
import cloudinary from "../routes/cloudinaryConfig.js";
import upload from "../routes/uploadMiddleware.js";
import { ensureEmailConfirmed } from './authMiddleware.js';


const router = express.Router();

router.get("/test", function test(req, res) {
    res.status(200).json(
        { "pureedsdsdsfdsf": "SADASDA" }
    );
})

// AUTHENTICATION
router.post('/register', userCtrl.registerUser);
router.put('/fillInfo',authMiddleware, userCtrl.fillInfo);
router.get('/confirm-email/:token', userCtrl.confirmEmail);
router.post('/login', userCtrl.logUser);
router.post('/upload', authMiddleware ,upload.array("images", 5), userCtrl.imageUpload);
router.get('/user-images', authMiddleware,  userCtrl.getUserImages);

router.get('/user', authMiddleware,ensureEmailConfirmed,  userCtrl.getUser);
router.post('/allUsers', authMiddleware,ensureEmailConfirmed,  userCtrl.getAllUsers);
// router.get('consult-profil/:id', authMiddleware,ensureEmailConfirmed,  userCtrl.getConsultProfil);

router.post('/record-profile-view', authMiddleware,ensureEmailConfirmed,  userCtrl.recordProfileView);
router.post('/likeUser',authMiddleware,ensureEmailConfirmed, userCtrl.likeUser);
router.post('/dislikeUser',authMiddleware,ensureEmailConfirmed, userCtrl.dislikeUser);
router.delete('/unlikeUser',authMiddleware,ensureEmailConfirmed, userCtrl.unlikeUser);
router.get('/getLikes',authMiddleware,ensureEmailConfirmed, userCtrl.getLikes);
router.get('/getOtherLikes',authMiddleware,ensureEmailConfirmed, userCtrl.getOtherLikes);
router.get('/getMatches',authMiddleware,ensureEmailConfirmed, userCtrl.getMatches);
router.post('/ConsultProfile',authMiddleware,ensureEmailConfirmed, userCtrl.ConsultProfile);
router.get('/getViewlist',authMiddleware,ensureEmailConfirmed, userCtrl.getViewlist);
router.get('/getHistory',authMiddleware,ensureEmailConfirmed, userCtrl.getConsultedUsers);


// SOCKET 
router.get('/getMessages/:match_id', authMiddleware,ensureEmailConfirmed,  userCtrl.getMessages);
router.post('/sendMessage', authMiddleware,ensureEmailConfirmed,  userCtrl.sendMessage);
router.get('/getNotifications', authMiddleware,ensureEmailConfirmed,  userCtrl.getNotifications);
router.post('/sendNotification', authMiddleware,ensureEmailConfirmed,  userCtrl.sendNotification);


// BLOCK SIGNAL UPDATE
router.put('/updateUser', authMiddleware,ensureEmailConfirmed,  userCtrl.updateUser);
router.post('/blockUser',authMiddleware,ensureEmailConfirmed, userCtrl.blockUser);
router.get('/getBlockUser',authMiddleware,ensureEmailConfirmed, userCtrl.getBlockUser);
router.delete('/unblockUser',authMiddleware,ensureEmailConfirmed, userCtrl.unblockUser);
router.post('/signalUser',authMiddleware,ensureEmailConfirmed, userCtrl.signalUser);

// router.put('/logout', authMiddleware,ensureEmailConfirmed,  userCtrl.logoutUser);

router.post('/forgot-password', userCtrl.forgotPassword);
router.post('/reset-password', userCtrl.resetPassword);

router.delete('/delete-image/:position', authMiddleware, userCtrl.deleteUserImage);

router.put('/set-profile-picture', authMiddleware, userCtrl.setProfilePicture);

export default router;