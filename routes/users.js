import { Router } from 'express';
import { loginPost } from '../controllers/usercontroller.js';
import { registerPost } from '../controllers/usercontroller.js';

const router = Router();

router.post('/login', loginPost);

// new user
router.post('/', registerPost); 



export default router;
