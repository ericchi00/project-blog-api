import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema(
	{
		name: { type: String },
		text: { type: String, required: true, minlength: 2 },
		post: { type: Schema.Types.ObjectId, ref: 'Post' },
	},
	{ timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
