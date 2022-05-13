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
import __dirname from './dirname.js';

import apiRouter from './routes/api.js';

const app = express();

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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
app.use(express.static(path.join(__dirname, 'views')));

app.use(helmet());
app.use(compression());

app.use('/api', apiRouter);

app.use((req, res, next) => {
	next(httpErrors(404));
});

// error handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(err.status || 500);
	res.render('error');
});

export default app;
