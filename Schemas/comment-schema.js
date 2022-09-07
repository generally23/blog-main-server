const mongoose = require("mongoose");
const { deleteProps } = require("../Utils");
const Like = require("./like_schema");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      minlength: [1, "Field {content} cannot be empty"],
      required: ["Field {content} is required"],
    },
    author_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Field {post_id} is required"],
    },
    edited: {
      type: Boolean,
      default: false,
    },

    reply_to_id: {
      type: mongoose.Schema.Types.ObjectId,
    },

    level: {
      type: Number,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

/** VIRTUALS */
commentSchema.virtual("reply_to", {
  ref: "Comment",
  localField: "reply_to_id",
  foreignField: "_id",
  justOne: true,
});

commentSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "liked",
});
/** VIRTUALS END */

/** HOOKS */
commentSchema.pre("remove", async function (next) {
  // delete all replies to deleted comment
  await Comment.deleteMany({ reply_to_id: this._id });
  // delete all the likes to deleted comment
  await Like.deleteMany({ liked: this._id });

  next();
});
/** HOOKS END */

/** SCHEMA METHODS */
commentSchema.methods.toJSON = function () {
  const comment = this.toObject();

  deleteProps(comment, "__v");
  return comment;
};
/** SCHEMA METHODS END */

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
