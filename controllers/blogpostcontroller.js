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

			const post = await BlogPost.findById(req.body.postID);
			if (post) {
				const blogPost = await BlogPost.findByIdAndUpdate(req.body.postID, {
					title: req.body.title,
					text: cleanText,
				});
				return res.status(200).json(blogPost._id);
			}
			if (post === null) {
				const blogPost = await BlogPost.create({
					username: req.body.id,
					title: req.body.title,
					text: cleanText,
				});
				return res.status(200).json(blogPost._id);
			}
		} catch (error) {
			next(error);
		}
	},
];

const deleteBlogPost = async (req, res, next) => {
	try {
		Promise.all([
			await BlogPost.findByIdAndRemove({ _id: req.params.id }),
			await Comment.deleteMany({ blogPost: req.params.id }),
		]);
		return res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

export { getAllBlogPosts, getBlogPost, deleteBlogPost, postBlogPost };
