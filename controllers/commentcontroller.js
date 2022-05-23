import { body, validationResult } from 'express-validator';
import BlogPost from '../models/blogpost.js';
import Comment from '../models/comment.js';

const postComment = [
	body('comment')
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage('Comment must be at least 3 characters'),
	async (req, res, next) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.json(errors);
				return;
			}
			const comment = new Comment({
				username: req.body.username,
				text: req.body.comment,
				blogPost: req.body.id,
			});

			await comment.save();
			const blogPost = await BlogPost.findById(req.params.id);
			await blogPost.comments.push(comment);
			blogPost.save();
		} catch (error) {
			next(error);
		}
	},
];

export default postComment;
