import { Router } from 'express';
import {
	loginPost,
	registerPost,
	logoutPost,
} from '../controllers/usercontroller.js';

const router = Router();

// new user
router.post('/', registerPost);

router.post('/login', loginPost);

router.post('/logout', logoutPost);

export default router;
