import { body, validationResult } from 'express-validator';
import BlogPost from '../models/blogpost.js';

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
			await BlogPost.findByIdAndUpdate(req.body.id, {
				$push: {
					comments: { username: req.body.username, text: req.body.comment },
				},
			});
		} catch (error) {
			console.log('comment', error);
			next(error);
		}
	},
];

export default postComment;
