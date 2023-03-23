const express = require('express');
const userRouter = require('./userRouter');
const apiRouter = express.Router();

apiRouter.use('/user', userRouter);

module.exports = apiRouter;
