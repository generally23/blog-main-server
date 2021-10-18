const router = require('express').Router();

const parent_route = '/accounts';

router.post(`${parent_route}/signup`);

router.post(`${parent_route}/signin`);

router.post(`${parent_route}/signout`);

router.get(`${parent_route}/my-account`);

router.post(`${parent_route}/forgot-my-password`);

router.post(`${parent_route}/reset-password/:reset_token`);

router.post(`${parent_route}/change-my-password`);

router.post(`${parent_route}/update-my-account`);

router.delete(`${parent_route}/delete-my-account`);
