const router = require('express').Router();

module.exports = router;

router
  .route('/')
  .get()
  .post();

router
  .route('/:comment_id/replies')
  .get()
  .post();
