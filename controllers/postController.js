const Post = require("../models/postsModel")

const getAllPosts = async (req, res,next) => {
    try {
        const posts = await Post.find()
        res.status(200).json({
            status: 'success',
            results: posts.length,
            data: {
                posts
            }
        })
    } catch(e) {
        res.status(400).json({status: "fail"})
    }
}

const getOnePost = async (req, res,next) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json({
            status: 'success',
            results: post.length,
            data: {
                post
            }
        })
    } catch(e) {
        res.status(400).json({status: "fail"})
    }
}

const createPost = async (req, res,next) => {
    try {
        const post = await Post.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                post
            }
        })
    } catch(e) {
        res.status(400).json({status: "fail"})
    }
}

const updatePost = async (req, res,next) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true, //to get the updated post,
            runValidators: true // check the schema requiements
        })
        res.status(200).json({
            status: 'success',
            data: {
                post
            }
        })
    } catch(e) {
        res.status(400).json({status: "fail"})
    }
}

const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: 'success',
        })
    } catch(e) {
        res.status(400).json({status: "fail"})
    }
}

module.exports = {
    getAllPosts,
    getOnePost,
    createPost,
    updatePost,
    deletePost
}