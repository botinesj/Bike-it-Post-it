const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  creator: String,
  text: String,
});

const Post = mongoose.model("Post", {
  title: {
    type: String,
    required: true,
    minlegth: 1,
    trim: true,
  },
  author: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
    minlegth: 1,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    minlegth: 1,
    trim: true,
  },
  picture: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    // required: true,
    default: 0,
  },
  comments: {
    type: [commentSchema],
    // required: true
  },
  date: {
    type: String,
    required: true,
  },
});

module.exports = { Post };
