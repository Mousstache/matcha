import express from 'express';
import userCtrl from '../controllers/userControllers.js';
import authMiddleware from './authMiddleware.js';

const router = express.Router();

router.get('/', userCtrl.hello);
router.post('/create', userCtrl.createUser);
router.post('/login', authMiddleware, userCtrl.logUser);
router.get('/user', authMiddleware, userCtrl.getUser);
router.put('/updatUser', authMiddleware, userCtrl.updateUser);
router.post('/logout', authMiddleware, logoutUser);

export default router;