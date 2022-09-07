const { verify } = require("jsonwebtoken");
const { ServerError } = require("../ErrorHandlers");
const Account = require("../Schemas/account_schema");
const catchAsyncErrors = require("../Utils/catch_async_errors");

const authenticate = catchAsyncErrors(async (req, res, next) => {
  const unauthMessage = new ServerError("You are not authenticated", 401);
  // get token
  const token = req.headers["authorization"];

  // check availability of token
  if (!token) {
    return next(unauthMessage);
  } // error

  // verify token
  const isTokenValid = verify(token, process.env.JWT_SECRET_KEY || "secret");

  if (!isTokenValid) {
    return next(unauthMessage);
  } // error

  // find account
  const account = await Account.findOne({ auth_token: token });

  if (!account) {
    return next(unauthMessage);
  } // error

  req.account = account;

  return next();
});

module.exports = authenticate;
