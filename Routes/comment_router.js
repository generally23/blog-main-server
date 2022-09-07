const {
  getPostComments,
  createPostComment,
  likeAndUnlikeComment,
  getCommentLikes,
} = require("../RouteHandlers/comment_route_handlers");
const authenticate = require("../Auth/authentication");

const router = require("express").Router({ mergeParams: true });

module.exports = router;

router.route("/").get(getPostComments).post(createPostComment);

router.post("/:comment_id/like", authenticate, likeAndUnlikeComment);

router.get("/:comment_id/likes", getCommentLikes);

// router.route("/:comment_id/replies").get().post();
