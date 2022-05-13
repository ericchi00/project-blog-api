import 'dotenv/config';
import express from 'express';
import path from 'path';
import httpErrors from 'http-errors';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';
import helmet from 'helmet';
import compression from 'compression';
import passport from 'passport';
import __dirname from './dirname.js';

import apiRouter from './routes/api.js';
import * as authentication from './modules/authentication.js';

const app = express();

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

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
// app.use(express.static(path.join(__dirname, 'views')));

app.use(helmet());
app.use(compression());

passport.use(authentication.local);
passport.deserializeUser(authentication.deserializeUser);
passport.serializeUser(authentication.serializeUser);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(httpErrors(404));
});

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
