import Message from '../models/message.js';
import Comment from '../models/comment.js';

const getAllMessages = async (req, res, next) => {
	try {
		const list = await Message.find({ published: true }).exec();
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

const deleteMessage = async (req, res, next) => {
	try {
		await Comment.deleteMany({ post: req.params.id }).exec();
		await Message.findByIdAndDelete(req.params.id).exec();
		res.json('success');
	} catch (error) {
		next(error);
	}
};

export { getAllMessages, getMessage, deleteMessage };
