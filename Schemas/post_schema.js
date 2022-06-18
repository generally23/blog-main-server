const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: [5],
      maxlength: [40],
      required: [true]
    },

    summary: {
      type: String,
      minlength: [32],
      maxlength: [400],
      required: [true]
    },

    content: {
      type: String,
      minlength: [32],
      required: [true]
    },

    thumbnail: {
      type: String,
      default: ''
    },

    author_id: {
      type: mongoose.Schema.Types.ObjectId
    },

    url_encoded_title: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Post', postSchema);
