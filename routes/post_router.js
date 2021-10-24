const router = require('express').Router();
const comment_router = require('./comment_router');

const {
  getPosts,
  getPost,
  createPost
} = require('../routeHandlers/post_route_handlers');

const parent_route = '/posts';
router
  .route(`${parent_route}`)
  .get(getPosts)
  .post(createPost);

router.route(`${parent_route}/:post_title`).get(getPost);

router.use(`${parent_route}/:post_title/comments`, comment_router);

module.exports = router;
