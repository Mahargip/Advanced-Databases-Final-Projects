require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authenticationMiddleware = require('./api/middleware/authentication');
const authenticationRouter = require('./api/routes/authentication');
const postRouter = require('./api/routes/post');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authenticationRouter);
app.use('/post', postRouter);

dotenv.config();

//CONNECTION to MongoDB has been hide.

// IMPORT CONTROLLER
const userController = require('./api/controllers/userController');
const postController = require('./api/controllers/postController');
const commentController = require('./api/controllers/commentController');
const authenticationController = require('./api/controllers/authentication');

// ROUTES
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

app.post('/register', authenticationController.register);
app.post('/login', authenticationController.login);
app.post('/logout', authenticationController.logout);
app.get('/me', authenticationMiddleware, authenticationController.me);
app.get('/users', userController.getAllUsers);

app.get('/posts', postController.getAllPosts);
app.get('/posts/:id', postController.getPostById);
app.post('/posts', authenticationMiddleware, postController.createPost);
app.patch('/posts/:id', authenticationMiddleware, postController.updatePost);
app.delete('/posts/:id', authenticationMiddleware, postController.deletePost);

app.post('/comments', authenticationMiddleware, commentController.createComment);
app.patch('/comments/:id', authenticationMiddleware, commentController.updateComment);
app.delete('/comments/:id', authenticationMiddleware, commentController.deleteComment);


app.use((req, res, next) => {
    res.status(404).send('Route not found');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
