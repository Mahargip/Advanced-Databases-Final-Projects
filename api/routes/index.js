const express = require('express');
const authenticationRouter = require('./authentication');
const postRouter = require('./post');

const router = express.Router();

router.use('/auth', authenticationRouter);
router.use('/posts', postRouter);

module.exports = router;
