import 'dotenv/config';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const registerPost = [
	body('username')
		.trim()
		.isLength({ min: 3 })
		.escape()
		.withMessage('Username must be at least 3 characters')
		.custom((value) =>
			User.exists({ username: value }).then((user) => {
				if (user) {
					return Promise.reject(new Error('Username already taken.'));
				}
				return true;
			})
		),
	body('password')
		.isLength({ min: 5 })
		.withMessage('Password must be at least 5 charaacters'),
	body('confirmPassword').custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error('Passwords must match.');
		} else return true;
	}),

	async (req, res, next) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.json(errors);
				return;
			}
			bcrypt.hash(req.body.password, 10, (error, hashedPassword) => {
				if (error) return next(error);
				const user = new User({
					username: req.body.username,
					password: hashedPassword,
				});
				user.save();
				res.json({ message: 'User successfully created.' });
			});
		} catch (error) {
			next(error);
		}
	},
];

const loginPost = async (req, res, next) => {
	passport.authenticate('local', async (err, user, info) => {
		try {
			if (err || !user) {
				return next(err);
			}

			req.login(user, { session: false }, (error) => {
				if (error) {
					return next(error);
				}
				const token = jwt.sign({ user }, process.env.JWT_TOKEN, {
					expiresIn: '15m',
				});
				return res.json({
					authState: {
						username: user.username,
						id: user._id,
					},
					expiresIn: 15,
					token,
				});
			});
		} catch (error) {
			return next(error);
		}
	})(req, res, next);
};

const logoutPost = (req, res, next) => {
	try {
		req.logout();
	} catch (error) {
		next(error);
	}
};

export { registerPost, loginPost, logoutPost };
