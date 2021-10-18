const router = require('express').Router();
const comment_router = require('./comment_route_handlers');

router
  .route('/posts')
  .get()
  .post();

router.route('/posts/:post_name').get();

router.use('/posts/:post_name/comments', comment_router);

module.exports = router;
