const mongoose = require("mongoose");

const User = mongoose.model("User", {
  username: {
    type: String,
    required: true,
    minLength: 1,
  },

  password: {
    type: String,
    required: true,
    minLength: 1,
  },

  role: {
    type: String,
    enum: ["admin", "regular"],
    required: true,
  },

  name: {
    type: String,
    required: true,
    minLength: 1,
  },

    gender: {
        type: String,
        enum: ['Male', 'Female', 'Non-binary'],
        required: true
    },

  location: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

    picture: {
        type: String,
	},

  followingTrails: {
    type: Array,
  },

  createdTrails: {
    type: Array,
  },
});

module.exports = { User };
