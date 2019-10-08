import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import bodyParser from 'body-parser';
import api from './api';
import AppError from './utils/appError';
import globalErrorHandler from './api/controllers/errorController';

const app = express();

app.use(helmet()); // add security headers to request
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(mongoSanitize()); // Preventing NOSQL query injection

// Preventing XSS
app.use(xss());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ROUTES
app.use('/api/v1/', api);

app.all('*', (req, res, next) => {
  next(new AppError(`${req.originalUrl} does not exist on this server`, 400));
});

app.use(globalErrorHandler);

export default app;
