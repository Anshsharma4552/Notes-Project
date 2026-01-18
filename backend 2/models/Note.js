const mongoose = require('mongoose');

/**
 * Note Schema
 * Handles all note-related data including content, tags, and metadata
 */
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [50000, 'Content cannot exceed 50000 characters']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  isPinned: {
    type: Boolean,
    default: false
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#ffffff',
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex code']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Index for faster queries
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes for better query performance
noteSchema.index({ userId: 1, createdAt: -1 }); // User's notes sorted by date
noteSchema.index({ userId: 1, isPinned: -1, createdAt: -1 }); // Pinned notes first
noteSchema.index({ userId: 1, isFavorite: -1, createdAt: -1 }); // Favorite notes
noteSchema.index({ userId: 1, tags: 1 }); // Filter by tags
noteSchema.index({ title: 'text', content: 'text' }); // Text search

/**
 * Remove userId from JSON output (optional, for cleaner API responses)
 */
noteSchema.methods.toJSON = function() {
  const obj = this.toObject();
  // Keep userId for frontend use, but you can remove it if needed
  return obj;
};

module.exports = mongoose.model('Note', noteSchema);

