const express = require("express");
const {
  connectToDb,
  setupExpressMiddleware,
  setuptDotenv,
  listen,
} = require("./setup");

// express server
const server = express();
// setup .env to import environment variables
setuptDotenv();
// connect to mongodb
connectToDb();
// setup express middlewares
setupExpressMiddleware(server);
// listen on determined port
listen(server);

console.clear();
