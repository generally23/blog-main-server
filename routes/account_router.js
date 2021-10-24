const router = require('express').Router();

const {
  signup,
  signin,
  signout,
  changeMyPassword,
  updateMyAccount,
  deleteMyAccount,
  forgotMyPassword,
  resetMyPassword,
  pullMyAccount
} = require('../routeHandlers/account_route_handlers');

const parent_route = '/accounts';

router.post(`${parent_route}/signup`, signup);

router.post(`${parent_route}/signin`, signin);

router.post(`${parent_route}/signout`, signout);

router.get(`${parent_route}/my-account`, pullMyAccount);

router.post(`${parent_route}/forgot-my-password`, forgotMyPassword);

router.patch(`${parent_route}/reset-password/:reset_token`, resetMyPassword);

router.patch(`${parent_route}/change-my-password`, changeMyPassword);

router.post(`${parent_route}/update-my-account`, updateMyAccount);

router.delete(`${parent_route}/delete-my-account`, deleteMyAccount);

module.exports = router;
