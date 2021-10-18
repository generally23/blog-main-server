const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      minlength: [1]
    },
    author_id: {
      type: mongoose.Schema.Types.ObjectId
    },
    edited: {
      type: Boolean,
      default: false
    },
    replies: (function() {
      return [commentSchema];
    })()
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
