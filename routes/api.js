import { Router } from 'express';
import passport from 'passport';
import {
	deleteBlogPost,
	getAllBlogPosts,
	getBlogPost,
	postBlogPost,
} from '../controllers/blogpostcontroller.js';

const router = Router();

router.get('/messages', getAllBlogPosts);

router.get('/messages/:id', getBlogPost);

router.post(
	'/messages',
	passport.authenticate('jwt', { session: false }),
	postBlogPost
);

router.delete('/messages/:id', deleteBlogPost);

export default router;
