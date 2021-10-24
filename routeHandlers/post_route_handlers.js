const Post = require('../schemas/post_schema');
const catchAsyncErrors = require('../utils/catch_async_errors');
const { filterFalsyValues } = require('../utils');

const getPosts = catchAsyncErrors(async (req, res, next) => {
  const { category, sort_by, page, results_per_page: limit } = req.query;

  console.log(req.query);

  // title,
  const filterObject = filterFalsyValues({ category });

  console.log(filterObject);

  const sortObject = {};
  const paginationInstructions = {};
  const posts = await Post.find();

  res.json(posts);
});

const createPost = catchAsyncErrors(async (req, res, next) => {});

const getPost = catchAsyncErrors(async (req, res, next) => {
  const { url_encoded_title } = req.params;
  const post = await Post.findOne({ url_encoded_title });

  if (!post) {
    return; // error
  }

  res.json({ post });
});

module.exports = {
  getPost,
  getPosts,
  createPost
};

// category = undefined, ('', string(any), frontend, backend, it, other)

// sortBy = (undefined, '', string(any), title, -title, date, -date, category, -category)
