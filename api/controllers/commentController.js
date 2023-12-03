const Comment = require('../models/commentModel');
const User = require('../models/userModel');

exports.createComment = async (req, res) => {
    const { post_id, comments_content } = req.body;
    const user_id = req.user.userId;

    try {
        const comment = await Comment.create({ post_id, user_id, comments_content });
        res.status(201).json(comment);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
};

exports.updateComment = async (req, res) => {
    const { id } = req.params;
    const { comments_content } = req.body;
    const user_id = req.user.userId;

    try {
        const comment = await Comment.findOneAndUpdate({ _id: id, user_id }, { comments_content }, { new: true });

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found or unauthorized' });
        }

        res.json(comment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


exports.deleteComment = async (req, res) => {
    const { id } = req.params;

    try {
        const comment = await Comment.findByIdAndDelete(id);
        res.json(comment);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
};