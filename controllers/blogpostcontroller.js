import sanitizeHtml from 'sanitize-html';
import { body, validationResult } from 'express-validator';
import BlogPost from '../models/blogpost.js';
import Comment from '../models/comment.js';

const getAllBlogPosts = async (req, res, next) => {
	try {
		const list = await BlogPost.find().populate('username', 'username').exec();
		res.json(list);
	} catch (error) {
		next(error);
	}
};

const getBlogPost = async (req, res, next) => {
	try {
		const post = await BlogPost.findById(req.params.id)
			.populate('username', 'username')
			.exec();
		res.json(post);
	} catch (error) {
		next(error);
	}
};

const postBlogPost = [
	body('title')
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage('Title must be at least 3 characters'),
	body('text')
		.isLength({ min: 3 })
		.withMessage('Text must be at least 3 characters'),
	async (req, res, next) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.json(errors);
				return;
			}

			const cleanText = sanitizeHtml(req.body.text, {
				allowedTags: false,
				allowedATtributes: false,
			});
			await Message.create({
				username: req.body.id,
				title: req.body.title,
				text: cleanText,
			});
			res.json(201);
		} catch (error) {
			next(error);
		}
	},
];

const deleteBlogPost = async (req, res, next) => {
	try {
		await Comment.deleteMany({ post: req.params.id }).exec();
		await BlogPost.findByIdAndDelete(req.params.id).exec();
		res.json('success');
	} catch (error) {
		next(error);
	}
};

export { getAllBlogPosts, getBlogPost, deleteBlogPost, postBlogPost };
