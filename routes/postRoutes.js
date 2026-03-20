const express = require("express")
const postCtr = require("../controllers/postController")
const router = express.Router()

router.route("/").get(postCtr.getAllPosts).post(postCtr.createPost)
router.route("/:id").get(postCtr.getOnePost).put(postCtr.updatePost).delete(postCtr.deletePost)

module.exports = router