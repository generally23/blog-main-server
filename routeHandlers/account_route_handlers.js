const catchAsyncErrors = require('../utils/catch_async_errors');

const signup = catchAsyncErrors((req, res, next) => {});

const signin = catchAsyncErrors((req, res, next) => {});

const signout = catchAsyncErrors((req, res, next) => {});

const changePassword = catchAsyncErrors((req, res, next) => {});

const forgotPassword = catchAsyncErrors((req, res, next) => {});

const updateMyAccount = catchAsyncErrors((req, res, next) => {});

const deleteMyAccount = catchAsyncErrors((req, res, next) => {});

const forgotMyPassword = catchAsyncErrors((req, res, next) => {});

const resetMyPassword = catchAsyncErrors((req, res, next) => {});

const pullMyAccount = catchAsyncErrors((req, res, next) => {});

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
