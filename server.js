const express = require('express');
const {
  connectToDb,
  setupExpressMiddleware,
  setuptDotenv,
  listen
} = require('./setup');

const server = express();

setuptDotenv();
connectToDb();
setupExpressMiddleware(server);
listen(server);
