import { Router } from 'express';
import {
	deleteMessage,
	getAllMessages,
	getMessage,
} from '../controllers/messagecontroller.js';

const router = Router();

router.get('/posts', getAllMessages);

router.get('/posts/:id', getMessage);

// // create a post
// router.post('/posts')
// jwt.verify(req.token, process.env.JWT_TOKEN, (err, authData) => {
// if (error) {
// 	res.sendSTatus(403);
// } else {
// 	res.json({
// 		mesage: 'post created',
// 		authData
// 	})
// 	}
// })
router.delete('/posts/:id', deleteMessage);

export default router;
