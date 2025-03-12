import express from 'express';
import userCtrl from '../controllers/userControllers.js';
import authMiddleware from './authMiddleware.js';

const router = express.Router();

router.get('/', userCtrl.hello);
router.get('/user', authMiddleware, userCtrl.getUser);
router.get('/allUsers', authMiddleware, userCtrl.getAllUsers);
router.post('/create', userCtrl.createUser);
router.post('/register', userCtrl.registerUser);
router.post('/login', userCtrl.logUser);
router.put('/updateUser', authMiddleware, userCtrl.updateUser);
router.put('/logout', authMiddleware, userCtrl.logoutUser);

router.post('/upload', userCtrl.imagePost);


router.get('/confirm-email/:token', userCtrl.confirmEmail);
// router.post('/forgot-password', userController.forgotPassword);
// router.post('/reset-password', userController.resetPassword);

export default router;