import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid Email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [5, 'Password less than 5 characters'],
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'Password is required'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Confirm password and password field not identical'
    }
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.checkPassword = async function(inputPassword, userPassword) {
  return await bcrypt.compare(inputPassword, userPassword);
};

userSchema.index({ name: 'text' });

userSchema.set('toJSON', {
  transform: (doc, final) => {
    delete final.__v;
  }
});
const User = mongoose.model('User', userSchema);

export default User;
