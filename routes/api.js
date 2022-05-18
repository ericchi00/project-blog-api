import { Router } from 'express';
import passport from 'passport';
import {
	deleteMessage,
	getAllMessages,
	getMessage,
	postMessage,
} from '../controllers/messagecontroller.js';

const router = Router();

router.get('/messages', getAllMessages);

router.get('/messages/:id', getMessage);

router.post(
	'/messages',
	passport.authenticate('jwt', { session: false }),
	postMessage
);

router.delete('/messages/:id', deleteMessage);

export default router;
