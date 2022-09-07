const mongoose = require("mongoose");
const argon = require("argon2");
const crypto = require("crypto");
const { ServerError } = require("../ErrorHandlers");
const emailValidator = require("deep-email-validator");
const { deleteProps } = require("../Utils");
const Post = require("./post_schema");

const accountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minlength: [5, "Field { username } cannot be less than 5 characetrs"],
      maxlength: [26, "Field { username } cannot exceed 26 characters"],
      required: [true, "Field { username } is required"],
      lowercase: true,
    },

    email: {
      type: String,
      required: [true, "Field { email } is required"],
      unique: [true, "Email already exist"],
      lowercase: true,
      validate: {
        async validator(value) {
          // try validating
          const response = await emailValidator.validate(value);
          // true if valid and false if invalid
          console.log(response);
          return response.valid;
        },
        message: "Invalid email address",
      },
    },

    type: {
      type: String,
      enum: ["Admin", "Regular"],
      default: "Regular",
    },

    password: {
      type: String,
      required: [true, "Field { password } is required"],
    },

    reset_token: {
      type: String,
      select: false,
    },

    reset_token_expiration_date: {
      type: Date,
      select: false,
    },

    auth_token: {
      type: String,
      select: false,
    },

    photo_link: {
      type: String,
      default: "https://unsplash.com/photos/photo1.jpg",
      required: [true, "Field { photo_link } is required"],
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

/** HOOKS */

// hash password before saving it
accountSchema.pre("save", async function (next) {
  // user account
  const account = this;
  // stop execution here if password field has not changed
  if (!account.isModified("password")) return next();
  // pwd minlength
  const minlength = 8;
  // pwd max length
  const maxlength = 32;

  const { password, confirmation_password } = account;

  console.log(password, confirmation_password);

  if (password !== confirmation_password) {
    // error handle
    return next(new ServerError("Your passwords do not match", 400));
  }

  if (password < minlength) {
    // error
    return next(new ServerError("Your password is too short", 400));
  }

  if (password > maxlength) {
    // error
    return next(new ServerError("Your password is too long", 400));
  }

  // hash pwd
  const hash = await argon.hash(password);

  // assign hash to account
  account.password = hash;

  // move to the next middleware
  next();
});

accountSchema.pre("remove", async function (next) {
  await Post.deleteMany({ author_id: this._id });
});

/** HOOKS END */

/** METHODS */

accountSchema.methods.validatePassword = async function (password) {
  const account = this;

  console.log(account);

  return await argon.verify(account.password, password);
};

accountSchema.methods.generateResetToken = async function () {
  const account = this;

  // create reset token string
  const resetToken = crypto.randomBytes(40).toString("hex");

  // append hashed token to account
  account.reset_token = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // set expiration date for the token
  account.reset_token_expiration_date = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

accountSchema.methods.toJSON = function () {
  // account clone
  const account = this.toObject();
  // remove props from user object
  deleteProps(
    account,
    "password",
    "__v",
    "reset_token",
    "reset_token_expiration_date",
    "auth_token"
  );
  // return value will be sent to client
  return account;
};
/** METHODS END */

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
