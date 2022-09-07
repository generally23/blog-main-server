const Post = require("../Schemas/post_schema");
const catchAsyncErrors = require("../Utils/catch_async_errors");
const { objectAssign, sanitizeToStr, paginateModel } = require("../Utils");
const { ServerError } = require("../ErrorHandlers");

const getPosts = catchAsyncErrors(async (req, res, next) => {
  // store paging info
  const paging = ({ page = 1, results_per_page: limit = 10 } = req.query);

  // create a filter object
  const filterObject = {};

  // make sure category and sortBy are strings
  const category = sanitizeToStr(req.query.category);
  let sortBy = sanitizeToStr(req.query.sort_by);

  // modify sortby value to match sort proerties
  if (sortBy === "-date") sortBy = "-createdAt";
  if (sortBy === "date" || sortBy === "+date") sortBy = "createdAt";

  // assign category to filterObject
  objectAssign({ category }, filterObject);

  // paginate posts
  const paginatedRes = await paginateModel(Post, filterObject, sortBy, paging);

  // respond to client
  res.json(paginatedRes);
});

const createPost = catchAsyncErrors(async (req, res, next) => {
  // create and retieve the post back
  const post = new Post(req.body);
  // associate the post to it's auhtor
  post.author_id = req.account.id;
  // save post to DB
  await post.save();
  // respond to client with post
  res.status(201).json(post);
});

const getPost = catchAsyncErrors(async (req, res, next) => {
  // store post title
  const { post_title } = req.params;
  // find  post
  const post = await Post.findOne({
    url_encoded_title: post_title.toLowerCase(),
  });
  // send an error if post is not found
  if (!post) {
    return next(new ServerError("This post does not exist on our server", 404));
  }
  // respond to client with the post
  res.json(post);
});

const updatePost = catchAsyncErrors(async (req, res, next) => {
  // store post title
  const { post_title } = req.params;
  // find  post
  const post = await Post.findOne({
    url_encoded_title: post_title.toLowerCase(),
  });
  // send an error if post is not found
  if (!post) {
    return next(new ServerError("This post does not exist on our server", 404));
  }

  objectAssign(req.body, post);

  await post.save();

  res.json(post);
});

module.exports = {
  getPost,
  getPosts,
  createPost,
  updatePost,
};

// category = undefined, ('', string(any), frontend, backend, it, other)

// sortBy = (undefined, '', string(any), title, -title, date, -date, category, -category)
