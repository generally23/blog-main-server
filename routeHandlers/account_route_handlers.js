const catchAsyncErrors = require('../utils/catch_async_errors');
const Account = require('../schemas/account_schema');
const { generateJwt } = require('../utils');

const signup = catchAsyncErrors(async (req, res, next) => {
  // try to find if account already exist
  let account = await Account.findOne({ email: req.body.email });

  if (account) {
    return;
  }

  // create new account
  const account = new Account(req.body);
  // try saving newly created account
  await account.save();

  // generate an auth token for this account and save it to our DB
  const authToken = generateJwt(account.id);

  account.auth_token = authToken;

  await account.save();

  res.setHeader('auth_token', authToken);

  res.json({ account });
});

const signin = catchAsyncErrors(async (req, res, next) => {});

const signout = catchAsyncErrors(async (req, res, next) => {});

const changePassword = catchAsyncErrors(async (req, res, next) => {});

const forgotPassword = catchAsyncErrors(async (req, res, next) => {});

const updateMyAccount = catchAsyncErrors(async (req, res, next) => {});

const deleteMyAccount = catchAsyncErrors(async (req, res, next) => {});

const forgotMyPassword = catchAsyncErrors(async (req, res, next) => {});

const resetMyPassword = catchAsyncErrors(async (req, res, next) => {});

const pullMyAccount = catchAsyncErrors(async (req, res, next) => {});

module.exports = {
  signup,
  signin,
  signout,
  changePassword,
  forgotPassword,
  updateMyAccount,
  deleteMyAccount,
  forgotMyPassword,
  resetMyPassword,
  pullMyAccount
};
