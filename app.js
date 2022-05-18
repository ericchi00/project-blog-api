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
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
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
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await User.findOne({ username });
			if (!user) {
				return done(401, false, { message: 'Incorrect username or password' });
			}

			if (await bcrypt.compare(password, user.password)) {
				return done(null, user);
			}
			return done(401, false, { message: 'Incorrect username or password' });
		} catch (error) {
			return done(error);
		}
	})
);

passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_TOKEN,
		},
		async (token, done) => {
			try {
				return done(null, token.user);
			} catch (error) {
				return done(error);
			}
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
	next(httpErrors(404));
});

app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.json(err);
});

export default app;
