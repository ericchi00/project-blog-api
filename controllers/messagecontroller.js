import Message from '../models/message.js';
import Comment from '../models/comment.js';
import { body, validationResult } from 'express-validator';

const getAllMessages = async (req, res, next) => {
	try {
		const list = await Message.find().populate('username', 'username').exec();
		res.json(list);
	} catch (error) {
		next(error);
	}
};

const getMessage = async (req, res, next) => {
	try {
		const [post, comments] = await Promise.all([
			Message.findById(req.params.id).exec(),
			Comment.find({ post: req.params.id }).exec(),
		]);
		res.json({ post, comments });
	} catch (error) {
		next(error);
	}
};

const postMessage = [
	body('title')
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage('Title must be at least 3 characters'),
	body('text')
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage('Text must be at least 3 characters'),
	async (req, res, next) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.json(errors);
				return;
			}
			await Message.create({
				username: req.body.id,
				title: req.body.title,
				text: req.body.text,
			});
			res.json(201);
		} catch (error) {
			next(error);
		}
	},
];

const deleteMessage = async (req, res, next) => {
	try {
		await Comment.deleteMany({ post: req.params.id }).exec();
		await Message.findByIdAndDelete(req.params.id).exec();
		res.json('success');
	} catch (error) {
		next(error);
	}
};

export { getAllMessages, getMessage, deleteMessage, postMessage };
