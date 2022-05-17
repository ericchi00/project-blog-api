import { Router } from 'express';
import { registerPost } from '../controllers/usercontroller.js';

const router = Router();

router.post('/', registerPost);

export default router;
