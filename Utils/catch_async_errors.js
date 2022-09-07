const catchAsyncErrors = (f) => {
  return (req, res, next) => f(req, res, next).catch(next);
};

module.exports = catchAsyncErrors;
