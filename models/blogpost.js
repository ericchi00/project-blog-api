import mongoose from 'mongoose';

const { Schema } = mongoose;

const blogPostSchema = new Schema(
	{
		username: { type: Schema.Types.ObjectId, ref: 'User' },
		title: { type: String, required: true },
		text: { type: String, required: true },
		date: { type: Date, default: Date.now },
		comments: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Comment',
			},
		],
	},
	{ timestamps: true }
);

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;
