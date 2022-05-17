import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema(
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

postSchema.virtual('url').get(function () {
	return `/posts/${this._id}`;
});

const Post = mongoose.model('Post', postSchema);

export default Post;
