import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from './../models/userModels';
import catchAsync from './../../utils/catchAsync';
import AppError from './../../utils/appError';
import 'dotenv/config';

const createToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const { email, password, confirmPassword, name } = req.body;
  const newUser = await User.create({
    email,
    confirmPassword,
    name,
    password
  });
  const token = createToken(newUser._id);
  newUser.password = undefined;
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
      token
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Email or password not provided', 400));
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }
  const token = createToken(user._id);
  res.status(200).json({
    status: 'success',
    data: {
      token
    }
  });
});

exports.authMiddleware = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('Authorization Required', 401));
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id); // check user still exists
  if (!user) {
    return next(new AppError('User does not exist', 401));
  }
  req.user = user;
  next();
});
