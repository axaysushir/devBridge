const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route POST api/posts
// @desc Create a post
// @access private
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @router GEt api/posts
// @desc Get all post
//@access private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route get api/posts/:id
// @desc GET post by ID
// @access private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check for Objectid format and post
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route DELETE api/posts/:id
// @desc DELETE post by ID
// @access private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check for objectId format and post
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.remove();
    res.json({ msg: "Post removed" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route PUT api/posts/like/:id
// @desc Like post
// @access private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if post has already been liked by someone
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "post already liked" });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route PUT api/posts/unlike/:id
// @desc Like post
// @access private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // check if post has already liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    // get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route PUT api/posts/comment/:id
// @desc comment on post
// @access private
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await (await User.findById(req.user.id)).select("-password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (error) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    // make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }
    // check usre
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    //get remove index
    const removeIndex = post.comments
      .map((comment) => comment.id)
      .indexOf(req.params.comment_id);

    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;