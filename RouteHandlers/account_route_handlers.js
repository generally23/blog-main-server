const catchAsyncErrors = require("../Utils/catch_async_errors");
const Account = require("../Schemas/account_schema");
const { generateJwt, objectAssign, isSame } = require("../Utils");
const crypto = require("crypto");
const sharp = require("sharp");
const { resolve } = require("path");
const fs = require("node:fs/promises");
const { ServerError } = require("../ErrorHandlers");

const signup = catchAsyncErrors(async (req, res, next) => {
  // create new account
  account = new Account(req.body);

  // assign a temporary confirmation password
  objectAssign(
    { confirmation_password: req.body.confirmation_password },
    account
  );

  // try saving newly created account
  await account.save();

  // generate an auth token for this account and save it to our DB
  const authToken = generateJwt(account.id);

  objectAssign({ auth_token: authToken }, account);

  await account.save();

  res.setHeader("auth_token", authToken);

  res.json(account);
});

const signin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // find account
  const account = await Account.findOne({ email });

  if (!account) {
    // account does not exist err
    return next(new ServerError("account not found", 401));
  }

  // verify password
  const isPasswordValid = await account.validatePassword(password);

  console.log(isPasswordValid);

  if (!isPasswordValid) {
    // err
    return next(new ServerError("invalid password", 401));
  }

  const authToken = generateJwt(account.id);

  objectAssign({ auth_token: authToken }, account);

  await account.save();

  res.setHeader("auth_token", authToken);

  res.json(account);
});

const signout = catchAsyncErrors(async (req, res, next) => {
  const { account } = req.account;

  objectAssign({ auth_token: undefined }, account);

  await account.save();
});

const changeMyPassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword, newConfirmationPassword } = req.body;

  console.log(req.body);

  const { account } = req;

  if (!currentPassword) {
    return next(new ServerError("You must provide your old password", 401));
  }

  const isPasswordValid = await account.validatePassword(currentPassword);

  console.log("yes sir");

  if (!isPasswordValid) {
    // error
    return next(new ServerError("Invalid password", 401));
  }

  account.password = newPassword;
  account.confirmation_password = newConfirmationPassword;

  await account.save();

  console.log("saved");

  const authToken = generateJwt(account.id);

  objectAssign(
    {
      auth_token: authToken,
    },
    account
  );

  await account.save();

  res.setHeader("auth_token", authToken);

  res.status(200).json(account);
});

const updateMyAccount = catchAsyncErrors(async (req, res, next) => {
  // info
  const { account, files } = req;

  const { username } = req.body;

  if (username !== account.username) {
    // update username
    objectAssign({ username }, account);
  }

  if (files.length) {
    const file = files[0];

    const filename = `avatar-${account._id}.webp`;
    const filePath = resolve("Uploads", filename);
    const fileLink = `${req.headers.host}/${filename}`;

    await sharp(file.buffer).resize(400, 400).webp().toFile(filePath);

    account.photo_link = fileLink;
  }

  await account.save();

  res.json(account);
});

const deleteMyAccount = catchAsyncErrors(async (req, res, next) => {
  const { account } = req;

  // await Account.deleteOne({ _id: account.id });

  await Account.deleteOne({ _id: "nonsense" });

  res.status(204).json();
});

const forgotMyPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  const account = await Account.findOne({ email });

  if (!account) {
    // error
    return next(new ServerError("account not found", 401));
  }

  const resetToken = await account.generateResetToken();

  res.json({ reset_token: resetToken });
});

const resetMyPassword = catchAsyncErrors(async (req, res, next) => {
  const { reset_token } = req.params;

  const { password, confirmation_password } = req.body;

  console.log(req.params, req.body);

  const hash = crypto.createHash("sha256").update(reset_token).digest("hex");

  const account = await Account.findOne({
    reset_token: hash,
    reset_token_expiration_date: { $gt: Date.now() },
  });

  if (!account) {
    // error
    return next(new ServerError("Account not found", 401));
  }

  (account.password = password),
    (account.confirmation_password = confirmation_password);

  await account.save();

  const authToken = generateJwt(account.id);

  objectAssign({ auth_token: authToken }, account);

  await account.save();

  res.setHeader("auth_token", authToken);

  res.json({ account });
});

const pullMyAccount = catchAsyncErrors(async (req, res, next) => {
  res.json(req.account);
});

module.exports = {
  signup,
  signin,
  signout,
  changeMyPassword,
  updateMyAccount,
  deleteMyAccount,
  forgotMyPassword,
  resetMyPassword,
  pullMyAccount,
};
