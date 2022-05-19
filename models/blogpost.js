import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema(
	{
		username: { type: Schema.Types.ObjectId, ref: 'User' },
		text: { type: String, required: true, minlength: 2 },
	},
	{ timestamps: true }
);

const blogPostSchema = new Schema(
	{
		username: { type: Schema.Types.ObjectId, ref: 'User' },
		title: { type: String, required: true },
		text: { type: String, required: true },
		date: { type: Date, default: Date.now },
		comments: [commentSchema],
	},
	{ timestamps: true }
);

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;
