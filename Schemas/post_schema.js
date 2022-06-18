const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: [10, 'field {title} cannot be less than 10 characters'],
      maxlength: [100, 'field {title} cannot exceed 100 characters'],
      required: [true, 'field {title} is required']
    },

    summary: {
      type: String,
      minlength: [32, 'field {summary} cannot be less than 32 characters'],
      maxlength: [400, 'field {summary} cannot exceed 400 characters'],
      required: [true, 'field {summary} is required']
    },

    content: {
      type: String,
      minlength: [32, 'field {content} cannot be less than 32 characters'],
      required: [true, 'field {content} is required']
    },

    thumbnail: {
      type: String,
      required: [true, 'field {thumbnail} is required'],
      default: 'https://unsplash.com/photos/photo1.jpg'
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
