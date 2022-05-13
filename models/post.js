import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema(
	{
		title: { type: String, required: true },
		text: { type: String, required: true },
		published: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

postSchema.virtual('url').get(function () {
	return `/posts/${this._id}`;
});

const Post = mongoose.model('Post', postSchema);

export default Post;
