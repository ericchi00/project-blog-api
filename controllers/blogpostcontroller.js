import sanitizeHtml from 'sanitize-html';
import { body, validationResult } from 'express-validator';
import BlogPost from '../models/blogpost.js';
import Comment from '../models/comment.js';

const getAllBlogPosts = async (req, res, next) => {
	try {
		const list = await BlogPost.find().populate('username', 'username').exec();
		return res.status(200).json(list);
	} catch (error) {
		next(error);
	}
};

const getBlogPost = async (req, res, next) => {
	try {
		const post = await BlogPost.findById(req.params.id)
			.populate('username', 'username')
			.populate({
				path: 'comments',
				populate: { path: 'username', select: 'username' },
			})
			.exec();
		res.status(200).json(post);
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
				return res.status(400).json(errors);
			}
			const cleanText = sanitizeHtml(req.body.text, {
				allowedTags: false,
				allowedATtributes: false,
			});
			const options = {
				upsert: true,
				new: true,
				setDefaultsOnInsert: true,
			};
			const blogPost = await BlogPost.findOneAndUpdate(
				req.body.postID,
				{
					username: req.body.id,
					title: req.body.title,
					text: cleanText,
				},
				options
			);
			return res.status(200).json(blogPost._id);
		} catch (error) {
			next(error);
		}
	},
];

const deleteBlogPost = async (req, res, next) => {
	try {
		const post = await BlogPost.findById(req.params.id);
		if (post.comments.length === 0) {
			return await BlogPost.findByIdAndDelete(req.params.id);
		}
		Promise.all([
			await Comment.deleteMany({ blogPost: req.params.id }),
			await BlogPost.findByIdAndDelete(req.params.id),
		]);
		return res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

export { getAllBlogPosts, getBlogPost, deleteBlogPost, postBlogPost };
