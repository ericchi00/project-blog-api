import { Router } from 'express';
import passport from 'passport';
import {
	deleteBlogPost,
	getAllBlogPosts,
	getBlogPost,
	postBlogPost,
} from '../controllers/blogpostcontroller.js';
import postComment from '../controllers/commentcontroller.js';

const router = Router();

router.get('/blogposts', getAllBlogPosts);

router.get('/blogposts/:id', getBlogPost);

router.post(
	'/blogposts',
	passport.authenticate('jwt', { session: false }),
	postBlogPost
);

router.delete(
	'/blogposts/:id',
	passport.authenticate('jwt', { session: false }),
	deleteBlogPost
);

router.post(
	'/blogposts/:id/comments',
	passport.authenticate('jwt', { session: false }),
	postComment
);

export default router;
