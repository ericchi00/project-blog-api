import { Router } from 'express';
import {
	deletePost,
	getAllPosts,
	getPost,
} from '../controllers/postcontroller.js';

const router = Router();

router.get('/posts', getAllPosts);

router.get('/posts/:id', getPost);

router.delete('/posts/:id', deletePost);

export default router;
