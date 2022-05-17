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

const loginPost = (req, res, next) => {
	passport.authenticate('local', { session: false }, (err, user, info) => {
		if (err || !user) {
			return res.status(400).json({
				message: 'Something is not right',
				user,
			});
		}

		req.login(user, { session: false }, (error) => {
			if (error) {
				res.send(error);
			}

			// generate a signed son web token with the contents of user object and return it in the response

			const token = jwt.sign(user, 'your_jwt_secret');
			return res.json({ user, token });
		});
	})(req, res);
};

export { registerPost, loginPost };
