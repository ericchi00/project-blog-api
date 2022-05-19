import { Router } from 'express';
import passport from 'passport';
import {
	deleteBlogPost,
	getAllBlogPosts,
	getBlogPost,
	postBlogPost,
} from '../controllers/blogpostcontroller.js';

const router = Router();

router.get('/blogposts', getAllBlogPosts);

router.get('/blogposts/:id', getBlogPost);

router.post(
	'/blogposts',
	passport.authenticate('jwt', { session: false }),
	postBlogPost
);

router.delete('/blogposts/:id', deleteBlogPost);

export default router;
