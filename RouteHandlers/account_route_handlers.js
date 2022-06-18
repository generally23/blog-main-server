const catchAsyncErrors = require('../Utils/catch_async_errors');
const Account = require('../Schemas/account_schema');
const { generateJwt, objectAssign, isSame } = require('../Utils');
const crypto = require('crypto');

const signup = catchAsyncErrors(async (req, res, next) => {
  // try to find if account already exist
  let account = await Account.findOne({ email: req.body.email });

  if (account) {
    // err
    return;
  }

  // create new account
  account = new Account(req.body);

  // assign a temporary confirmation password
  objectAssign(
    { confirmation_password: req.body.confirmation_password },
    account
  );

  console.log(account);
  // try saving newly created account
  await account.save();

  // generate an auth token for this account and save it to our DB
  const authToken = generateJwt(account.id);

  objectAssign({ auth_token: authToken }, account);

  await account.save();

  res.setHeader('auth_token', authToken);

  res.json({ account });
});

const signin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // find account
  const account = await Account.findOne({ email });

  if (!account) {
    // account does not exist err
    return;
  }

  // verify password
  const isPasswordValid = account.validatePassword(password);

  if (!isPasswordValid) {
    // err
    return;
  }

  const authToken = generateJwt(account.id);

  objectAssign({ auth_token: authToken }, account);

  res.setHeader('auth_token', authToken);

  res.json({ account });
});

const signout = catchAsyncErrors(async (req, res, next) => {
  const { account } = req.account;

  objectAssign({ auth_token: undefined }, account);

  await account.save();
});

const changeMyPassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword, newConfirmationPassword } = req.body;

  const { account } = req;

  const isPasswordValid = await account.validatePassword(currentPassword);

  if (!isPasswordValid) {
    // error
    return;
  }

  objectAssign(
    { password: newPassword, confirmation_password: newConfirmationPassword },
    account
  );

  await account.save();

  objectAssign({ auth_token: generateJwt(account.id) }, account);

  await account.save();

  res.setHeader('auth_token', authToken);
  res.status(200).json();
});

const updateMyAccount = catchAsyncErrors(async (req, res, next) => {
  // user account
  const account = req.account;
  // get file if uploaded
  // file might be an img

  const photo = req.files[0];

  const { username } = req.body;
});

const deleteMyAccount = catchAsyncErrors(async (req, res, next) => {
  const { account } = req;

  await Account.deleteOne({ _id: account.id });

  res.status(204).json();
});

const forgotMyPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  const account = await Account.findOne({ email });

  if (!account) {
    // error
    return;
  }

  const resetToken = await account.generateResetToken();

  res.json({ resetToken });
});

const resetMyPassword = catchAsyncErrors(async (req, res, next) => {
  const { reset_token } = req.params;
  const { password, confirmation_password } = req.body;

  console.log(req.params, req.body);

  const hash = crypto
    .createHash('sha256')
    .update(reset_token)
    .digest('hex');

  const account = await Account.findOne({
    reset_token: hash,
    reset_token_expiration_date: { $gt: Date.now() }
  });

  if (!account) {
    // error
    return;
  }

  objectAssign(
    {
      password,
      confirmation_password
    },
    account
  );

  await account.save();

  const authToken = generateJwt(id);

  objectAssign({ auth_token: authToken }, account);

  await account.save();

  res.setHeader('auth_token', authToken);

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
  pullMyAccount
};
