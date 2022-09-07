class ServerError extends Error {
  constructor(
    message = "Internal server error",
    statusCode = 500,
    details = {}
  ) {
    super(message);
    this.statusCode = statusCode;
    this.operational = true;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

const unroutable = (req, res, next) => {
  next(new ServerError(`The route ${req.originalUrl} is not found`, 404));
};

const globalErrorHandler = (err, req, res, next) => {
  console.clear();
  console.error(err);

  const { ENVIRONMENT = "dev" } = process.env;

  if (ENVIRONMENT === "dev") {
    // known error
    if (err.operational) {
      res.status(err.statusCode).json({ ...err, message: err.message });
      // send error
    } else {
      // send error
      res.status(500).json({ err, message: err.message, stack: err.stack });
    }
  } else if (ENVIRONMENT === "prod") {
    let error = { ...err, message: err.message };

    // duplicate key errors
    if (error.code === 11000) {
      const { keyValue } = error;
      let message = "";
      for (let key in keyValue) message += `wrong ${key}! `;
      error = new ServerError(message, 400);
    }

    console.clear();

    // cast errors
    if (err.name === "CastError") {
      error = new ServerError(`Invalid ${error.path}: ${error.value}`, 400);
    }

    // validation errors
    if (err.name === "ValidationError") {
      const details = {};

      for (let key in error.errors) {
        details[key] = error.errors[key].properties.message;
      }

      error = new ServerError("Validation error", 400, details);
    }

    if (error.operational) {
      res.status(error.statusCode).json({ message: error.message, ...error });
    } else {
      res
        .status(500)
        .json({ message: "Something went wrong", statusCode: 500 });
    }
  }
};

module.exports = {
  ServerError,
  unroutable,
  globalErrorHandler,
};
