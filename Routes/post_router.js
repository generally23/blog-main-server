const router = require("express").Router();
const comment_router = require("./comment_router");
const authenticate = require("../Auth/authentication");
const allowAccessTo = require("../Auth/authorization");

const {
  getPosts,
  getPost,
  createPost,
  updatePost,
} = require("../RouteHandlers/post_route_handlers");

const parent_route = "/posts";

router
  .route(`${parent_route}`)
  .get(getPosts)
  .post(authenticate, allowAccessTo("Admin"), createPost);

router.route(`${parent_route}/:post_title`).get(getPost).patch(updatePost);

router.use(`${parent_route}/:post_title/comments`, comment_router);

module.exports = router;
