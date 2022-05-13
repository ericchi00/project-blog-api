import mongoose from 'mongoose';

const { Schema } = mongoose;

const adminSchema = new Schema({
	admin: { type: Boolean, default: true },
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
