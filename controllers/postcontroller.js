import Post from '../models/post.js';
import Comment from '../models/comment.js';

const getAllPosts = async (req, res, next) => {
	try {
		const list = await Post.find({ published: true }).exec();
		res.json(list);
	} catch (error) {
		next(error);
	}
};

const getPost = async (req, res, next) => {
	try {
		const [post, comments] = await Promise.all([
			Post.findById(req.params.id).exec(),
			Comment.find({ post: req.params.id }).exec(),
		]);
		res.json({ post, comments });
	} catch (error) {
		next(error);
	}
};

const deletePost = async (req, res, next) => {
	try {
		await Comment.deleteMany({ post: req.params.id }).exec();
		await Post.findByIdAndDelete(req.params.id).exec();
		res.json('success');
	} catch (error) {
		next(error);
	}
};

export { getAllPosts, getPost, deletePost };
