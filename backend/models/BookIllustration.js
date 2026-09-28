const mongoose = require('mongoose');

const BookIllustrationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: false,
  },
  image: { // Primary cover image
    type: String,
    required: true,
  },
  images: { // All images including cover (optional extra images)
    type: [String],
    default: [],
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('BookIllustration', BookIllustrationSchema);
