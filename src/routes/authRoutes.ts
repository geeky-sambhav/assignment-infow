import express from 'express';
import { signup, login, adminLogin } from '../controllers/auth';

const router = express.Router();

// Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/admin/login', adminLogin);

export default router;