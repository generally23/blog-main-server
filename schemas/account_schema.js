const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: [5],
      maxlength: [12],
      required: [true]
    },

    email: {
      type: String,
      required: [true]
    },

    password: {
      type: String,
      required: [true],
      minlength: [8]
    },

    reset_token: {
      type: String
    },

    reset_token_expiration_date: {
      type: Date
    },

    auth_token: {
      type: String
    },

    photo_link: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', accountSchema);
