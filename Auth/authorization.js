const { ServerError } = require("../ErrorHandlers");

const allowAccessTo = (...roles) => {
  return (req, res, next) => {
    console.log(roles, req.account.type);
    if (!roles.includes(req.account.type)) {
      return next(
        new ServerError(
          "You do not have enough credentials to access or perform these actions",
          403
        )
      );
    }
    next();
  };
};

module.exports = allowAccessTo;
