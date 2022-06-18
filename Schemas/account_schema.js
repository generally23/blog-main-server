const mongoose = require('mongoose');
const argon = require('argon2');
const crypto = require('crypto');

const accountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: [5, 'field {username} cannot be less than 5 characetrs'],
      maxlength: [26, 'field {username} cannot exceed 26 characters'],
      required: [true, 'field {username} is required']
    },

    email: {
      type: String,
      required: [true, 'field {email} is required'],
      unique: [true, 'this email already exist']
    },

    type: {
      type: String,
      enum: ['Admin', 'Regular'],
      default: 'Regular',
      select: false
    },

    password: {
      type: String,
      required: [true, 'field {password} is required'],
      select: false
    },

    reset_token: {
      type: String,
      select: false
    },

    reset_token_expiration_date: {
      type: Date,
      select: false
    },

    auth_token: {
      type: String,
      select: false
    },

    photo_link: {
      type: String,
      default: 'https://unsplash.com/photos/photo1.jpg',
      required: [true, 'field {photo_link} is required']
    }
  },
  { timestamps: true }
);

// hash password before saving it
accountSchema.pre('save', async function(next) {
  const account = this;
  // stop execution here if password field has not changed
  if (!account.isModified('password')) return next();
  // pwd minlength
  const minlength = 8;
  // pwd max length
  const maxlength = 32;

  const { password, confirmation_password } = account;

  if (password !== confirmation_password) {
    // error handle
    console.log('pass not equ to pass conf');
  }

  if (password < minlength) {
    // error
    console.log('pass less');
  }

  if (password > maxlength) {
    // error
    console.log('pass high');
  }

  const hash = await argon.hash(password);

  account.password = hash;

  next();
});

accountSchema.methods.validatePassword = async function(password) {
  const account = this;

  return await argon.verify(account.password, password);
};

accountSchema.methods.generateResetToken = async function() {
  const account = this;

  const resetToken = crypto.randomBytes(40).toString('hex');

  account.reset_token = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  account.reset_token_expiration_date = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('Account', accountSchema);
