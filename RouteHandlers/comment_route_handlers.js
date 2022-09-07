const { ServerError } = require("../ErrorHandlers");
const Post = require("../Schemas/post_schema");
const Comment = require("../Schemas/comment-schema");
const { objectAssign, sanitizeToStr, paginateModel } = require("../Utils");
const catchAsyncErrors = require("../Utils/catch_async_errors");
const Like = require("../Schemas/like_schema");

const getPostComments = catchAsyncErrors(async (req, res, next) => {
  const { post_title } = req.params;

  const post = await Post.findOne({ url_encoded_title: post_title });

  console.log(post, post_title);

  const comments = await Comment.find({ post_id: post._id })
    .populate("reply_to")
    .populate("likes");

  res.json(comments);
});

const createPostComment = catchAsyncErrors(async (req, res, next) => {
  // max level
  const maxLevel = 5;
  // get post title from req
  const { post_title } = req.params;
  // get reply_to_id to see if comment is a reply
  const { reply_to_id } = req.body;
  // find post for which comment is being created
  const post = await Post.findOne({ url_encoded_title: post_title });

  // send an error if it does not exist
  if (!post) {
    return next(
      ServerError("The post you are commenting on does not exist", 404)
    );
  }

  // comment is a root comment if reply_to_id does not exist

  if (!reply_to_id) {
    // create a root comment
    const comment = new Comment(req.body);
    // assign post_id and level to comment
    objectAssign({ post_id: post.id, level: 1 }, comment);
    // save comment
    await comment.save();
    // respond to client and acknoledge comment creation
    return res.status(201).json(comment);
  }

  // comment is a reply

  // find parent comment
  const parent = await Comment.findById(reply_to_id);
  // send an error if not found
  if (!parent) {
    return next(
      new ServerError("The comment you are replying to does not exist", 404)
    );
  }

  // since parent is found, create a reply

  const reply = new Comment(req.body);

  // assign post id to reply
  reply.post_id = post.id;

  // check if parent comment's level is less than max level to limit infinite nesting

  if (parent.level < maxLevel) {
    // set reply's reply_to to parent comment
    reply.reply_to_id = parent.id;
    // set reply's level to parent comment's level + 1
    reply.level = parent.level + 1;
  } else {
    // make parent comment and reply to be on the same level (meaning siblings in a tree structure)

    // set reply's reply_to to parent's reply_to
    reply.reply_to_id = parent.reply_to_id;
    // set reply's level to parent's
    reply.level = parent.level;
  }

  // save comment

  await reply.save();

  // respond to client and acknldg reply creation

  res.status(201).json(reply);
});

const updatePostComment = catchAsyncErrors(async (req, res, next) => {});

const deletePostComment = catchAsyncErrors(async (req, res, next) => {});

const likeAndUnlikeComment = catchAsyncErrors(async (req, res, next) => {
  // get comment id
  const { comment_id } = req.params;
  // try finding the comment to like
  const comment = await Comment.findById(comment_id);
  // send an error to the client if comment is missing
  if (!comment) {
    return next(
      ServerError("The comment you are trying to like does not exist")
    );
  }
  // create like
  const like = new Like({ liked: comment_id, liker: req.account._id });

  // try saving it

  try {
    await like.save();
    return res.status(201).json(like);
  } catch (e) {
    console.log(e);
    // error is duplicate key
    if (e.code === process.env.DUP_KEY_ERR || 11000) {
      // delete existing like
      await Like.deleteOne({ _id: comment_id + req.account._id });
      // respond to client
      return res.status(204).json();
    }
    return next(e);
  }
});

const getCommentLikes = catchAsyncErrors(async (req, res, next) => {
  // get comment id
  const { comment_id } = req.params;
  // try finding the likes
  const likes = await Like.find({ liked: comment_id });

  res.json(likes);
});

module.exports = {
  getPostComments,
  createPostComment,
  updatePostComment,
  deletePostComment,
  likeAndUnlikeComment,
  getCommentLikes,
};
