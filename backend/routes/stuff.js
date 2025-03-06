import express from 'express';
import userCtrl from '../controllers/userControllers.js';

const router = express.Router();

router.get('/', userCtrl.hello);
router.post('/create', userCtrl.createUser);
router.post('/login', userCtrl.logUser);
router.get('/user', userCtrl.getUser);
router.put('/updatUser', userCtrl.updateUser);

export default router;