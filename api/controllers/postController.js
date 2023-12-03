const Post = require('../models/postModel');
const User = require('../models/userModel');

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'name');
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name')
            .populate({
                path: 'comments',
                populate: { path: 'User', select: 'name' }
            });
        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

exports.createPost = async (req, res) => {
    const { title, news_content } = req.body;
    const author = req.user.userId; 

    try {
        const post = await Post.create({ title, news_content, author });
        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: 'Validation error', errors: error.errors });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, news_content } = req.body;

    try {
        const post = await Post.findByIdAndUpdate(id, { title, news_content }, { new: true });
        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
};

exports.deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findByIdAndDelete(id);
        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
};