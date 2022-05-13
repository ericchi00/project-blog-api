import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import Admin from '../models/admin.js';
import app from '../app.js';

const local = new LocalStrategy(
	{ passReqToCallback: true },
	(req, username, password, done) => {
		Admin.findOne({ username: username.trim() }, async (error, user) => {
			if (error) {
				return done(error);
			}
			if (!user) {
				return done(null, false, {
					message: 'Incorrect username or password',
				});
			}
			try {
				if (await bcrypt.compare(password, user.password)) {
					return done(null, user);
				}
				return done(null, false, {
					message: 'Incorrect username or password',
				});
			} catch (err) {
				return done(err);
			}
		});
	}
);

const serializeUser = (user, done) => {
	done(null, user.id);
};

const deserializeUser = (id, done) => {
	Admin.findById(id, (err, user) => {
		done(err, user);
	});
};

export { local, serializeUser, deserializeUser };
