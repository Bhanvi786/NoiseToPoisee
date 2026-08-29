const mongoose = require('mongoose');

const ArtworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  medium: {
    type: String,
    required: true,
  },
  dimensions: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  aspect: {
    type: String,
    default: 'aspect-square',
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Artwork', ArtworkSchema);
