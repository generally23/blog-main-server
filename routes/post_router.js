const router = require('express').Router();
const comment_router = require('./comment_route_handlers');

const parent_route = '/posts';
router
  .route(`${parent_route}`)
  .get()
  .post();

router.route(`${parent_route}/:post_name`).get();

router.use(`${parent_route}/:post_name/comments`, comment_router);

module.exports = router;
