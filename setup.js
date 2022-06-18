const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const postRouter = require('./Routes/post_router');
const accountRouter = require('./Routes/account_router');

const setuptDotenv = () => dotenv.config();

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('sucessfull connection to db');
  } catch (error) {
    console.log('failed db connection');
  }
};

const setupExpressMiddleware = server => {

  // parse json
  server.use(express.json());

  // server.use(express.static())
  server.use('/blog/v1', accountRouter);
  server.use('/blog/v1', postRouter);
};

const listen = async (server, port = process.env.PORT || 8080) => {

  try {
    await server.listen(port);
    console.log('listening on port 80');
  } catch (error) {
    console.log('failing to listen on port 80');
  }
  
};

module.exports = {
  connectToDb,
  setupExpressMiddleware,
  setuptDotenv,
  listen
};
