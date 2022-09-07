const mongoose = require("mongoose");
const slug = require("slug");
const Comment = require("./comment-schema");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: [10, "Field {title} cannot be less than 10 characters"],
      maxlength: [100, "Field {title} cannot exceed 100 characters"],
      required: [true, "Field {title} is required"],
      unique: [true, "Title already exist"],
    },

    category: {
      type: String,
      minlength: [1, "Field {category} cannot be empty"],
      maxlength: [15, "Field {category} cannot exceed 15 characters"],
      required: [true, "Field {category} is required"],
      lowercase: true,
    },

    summary: {
      type: String,
      minlength: [32, "Field {summary} cannot be less than 32 characters"],
      maxlength: [400, "Field {summary} cannot exceed 400 characters"],
      required: [true, "Field {summary} is required"],
    },

    content: {
      type: String,
      minlength: [32, "Field {content} cannot be less than 32 characters"],
      required: [true, "Field {content} is required"],
    },

    thumbnail: {
      type: String,
      required: [true, "Field {thumbnail} is required"],
      default: "https://unsplash.com/photos/photo1.jpg",
    },

    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "A post must have an author"],
    },

    url_encoded_title: {
      type: String,
      default() {
        return slug(this.title);
      },
      required: [true, "Field {url_encoded_title is required}"],
      unique: [true, "Url already exist"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

/** VIRTUALS */
postSchema.virtual("author", {
  ref: "Account",
  localField: "author_id",
  foreignField: "_id",
  justOne: true,
});

/** VIRTUALS END */

/** HOOKS*/

// update slug if title changed
postSchema.pre("save", function (next) {
  const post = this;
  if (post.isModified("title")) {
    post.url_encoded_title = slug(post.title);
  }
  next();
});

postSchema.pre("remove", async function (next) {
  // delete all comments associated with this post
  await Comment.deleteMany({ post_id: this._id });
});

/** VIRTUALS END */

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
