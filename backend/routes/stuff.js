import express from 'express';
import userCtrl from '../controllers/userControllers.js';
import authMiddleware from './authMiddleware.js';

const router = express.Router();

router.get('/', userCtrl.hello);
router.get('/user', authMiddleware, userCtrl.getUser);
router.get('/allUsers', authMiddleware, userCtrl.getAllUsers);
router.post('/create', userCtrl.createUser);
router.post('/login', userCtrl.logUser);
router.put('/updateUser', authMiddleware, userCtrl.updateUser);
router.put('/logout', authMiddleware, userCtrl.logoutUser);

export default router;