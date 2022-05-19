import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema(
	{
		username: { type: Schema.Types.ObjectId, ref: 'User' },
		text: { type: String, required: true, minlength: 2 },
		blogPost: { type: Schema.Types.ObjectId, ref: 'BlogPost' },
	},
	{ timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
