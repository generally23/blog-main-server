const router = require("express").Router();
const { uploader } = require("../Utils/index");
const authenticate = require("../Auth/authentication");

//console.log(uploader);

const {
  signup,
  signin,
  signout,
  changeMyPassword,
  updateMyAccount,
  deleteMyAccount,
  forgotMyPassword,
  resetMyPassword,
  pullMyAccount,
} = require("../RouteHandlers/account_route_handlers");

const parent_route = "/accounts";

router.post(`${parent_route}/signup`, signup);

/** AUTHENTICATED */

router.post(`${parent_route}/signout`, authenticate, signout);

router.get(`${parent_route}/my-account`, authenticate, pullMyAccount);

/** NOT AUTHENTICATED */

router.post(`${parent_route}/signin`, signin);

router.post(`${parent_route}/forgot-my-password`, forgotMyPassword);

router.patch(`${parent_route}/reset-password/:resetToken`, resetMyPassword);

/** AUTHENTICATED */

router.patch(
  `${parent_route}/change-my-password`,
  authenticate,
  changeMyPassword
);

router.patch(
  `${parent_route}/update-my-account`,
  authenticate,
  uploader().any(),
  updateMyAccount
);

router.delete(
  `${parent_route}/delete-my-account`,
  authenticate,
  deleteMyAccount
);

module.exports = router;
