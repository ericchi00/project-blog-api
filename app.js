import 'dotenv/config';
import express from 'express';
import httpErrors from 'http-errors';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';
import helmet from 'helmet';
import compression from 'compression';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import passport from 'passport';

import User from './models/user.js';

import apiRouter from './routes/api.js';
import userRouter from './routes/users.js';

const app = express();

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		maxAge: 24 * 60 * 60 * 1000,
	})
);
app.use(cookieParser());

app.use(helmet());
app.use(compression());

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);

passport.use(
	new LocalStrategy(
		{ passReqToCallback: true },
		(req, username, password, done) => {
			User.findOne({ username: username.trim() }, async (error, user) => {
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
	)
);
passport.serializeUser((user, done) => {
	done(null, user.id);
});
passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		done(err, user);
	});
});

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.all('/', (req, res, next) => {
	res.redirect(301, '/api/posts');
});
app.use('/api', apiRouter);
app.use('/users', userRouter);

app.use((req, res, next) => {
	res
		.status(404)
		.json({ message: "We couldn't find what you were looking for 😞" });
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json(err);
});

export default app;
