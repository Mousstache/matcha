import express from 'express';
import userCtrl from '../controllers/userControllers.js';
import authMiddleware from './authMiddleware.js';
// import { v2 as cloudinary } from "../cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import multer from "multer";

const router = express.Router();


router.post('/register', userCtrl.registerUser);
router.put('/fillInfo', userCtrl.fillInfo);
router.get('/confirm-email/:token', userCtrl.confirmEmail);
router.post('/login', userCtrl.logUser);
// router.post('/upload', userCtrl.imageUpload);


router.get('/user', authMiddleware, userCtrl.getUser);
router.get('/allUsers', authMiddleware, userCtrl.getAllUsers);
// router.get('user/:id', authMiddleware, userCtrl.getUser);

router.post('/likeUser', userCtrl.likeUser);
router.post('/dislikeUser', userCtrl.dislikeUser);
router.get('/getLikes', userCtrl.getLikes);
router.get('/getOtherLikes', userCtrl.getOtherLikes);

router.put('/updateUser', authMiddleware, userCtrl.updateUser);
// router.put('/logout', authMiddleware, userCtrl.logoutUser);



// router.post('/forgot-password', userController.forgotPassword);
// router.post('/reset-password', userController.resetPassword);

export default router;