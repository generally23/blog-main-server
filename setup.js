const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const postRouter = require("./Routes/post_router");
const accountRouter = require("./Routes/account_router");
const { resolve } = require("path");
const { unroutable, globalErrorHandler } = require("./ErrorHandlers");
const cors = require("cors");
const compress = require("compression");
const { default: helmet } = require("helmet");

// configure .env
const setuptDotenv = () => dotenv.config();

// start db connection
const connectToDb = async () => {
  try {
    await mongoose.connect(
      process.env.DATABASE_URL || "mongodb://localhost/blog"
    );
    console.log("sucessfull connection to db");
    console.clear();
  } catch (error) {
    console.log("failed db connection");
  }
};

const setupExpressMiddleware = (server) => {
  // parse json
  server.use(express.json());
  // setup cors
  server.use(cors());
  // setup compression
  server.use(compress());
  // setup helmet to protect server
  server.use(helmet());

  // serve static files
  server.use(express.static(resolve(__dirname, "Public")));
  server.use(express.static(resolve(__dirname, "Uploads")));

  // server main routes
  server.use("/blog/v1", accountRouter);
  server.use("/blog/v1", postRouter);

  // handles all unmacthing routes
  server.all("*", unroutable);

  // error handler
  server.use(globalErrorHandler);
};

// port listeners
const listen = async (server, port = process.env.PORT || 8080) => {
  try {
    await server.listen(port);
    console.log("listening on port 80");
    console.clear();
  } catch (error) {
    console.log("failing to listen on port 80");
  }
};

module.exports = {
  connectToDb,
  setupExpressMiddleware,
  setuptDotenv,
  listen,
};
