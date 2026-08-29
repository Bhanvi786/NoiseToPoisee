const mongoose = require('mongoose');

const StudentWorkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: false,
  },
  mentorshipYear: {
    type: String,
    required: true,
  },
  medium: {
    type: String,
    required: true,
  },
  dimensions: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: true,
  },
  concept: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('StudentWork', StudentWorkSchema);
