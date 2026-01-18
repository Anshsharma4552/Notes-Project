const Note = require('../models/Note');
const { validationResult } = require('express-validator');

/**
 * @route   GET /api/notes
 * @desc    Get all notes for authenticated user
 * @access  Private
 * @query   sort, search, tag, isFavorite, isPinned
 */
exports.getNotes = async (req, res, next) => {
  try {
    const { sort = 'newest', search, tag, isFavorite, isPinned } = req.query;
    
    // Build query
    const query = { userId: req.user.id };
    
    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag.toLowerCase()] };
    }
    
    // Filter by favorite
    if (isFavorite === 'true') {
      query.isFavorite = true;
    }
    
    // Filter by pinned
    if (isPinned === 'true') {
      query.isPinned = true;
    }
    
    // Search in title and content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      case 'alphabetical':
        sortObj = { title: 1 };
        break;
      case 'updated':
        sortObj = { updatedAt: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }
    
    // Always show pinned notes first
    if (sort === 'newest' || sort === 'oldest') {
      sortObj = { isPinned: -1, ...sortObj };
    }
    
    const notes = await Note.find(query).sort(sortObj);
    
    res.json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/notes/:id
 * @desc    Get single note by ID
 * @access  Private
 */
exports.getNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/notes
 * @desc    Create new note
 * @access  Private
 */
exports.createNote = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { title, content, tags, color, isPinned, isFavorite } = req.body;
    
    const note = new Note({
      title,
      content,
      tags: tags || [],
      color: color || '#ffffff',
      isPinned: isPinned || false,
      isFavorite: isFavorite || false,
      userId: req.user.id
    });
    
    await note.save();
    
    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: note
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/notes/:id
 * @desc    Update note
 * @access  Private
 */
exports.updateNote = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { title, content, tags, color, isPinned, isFavorite } = req.body;
    
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        title,
        content,
        tags: tags || [],
        color: color || '#ffffff',
        isPinned: isPinned !== undefined ? isPinned : false,
        isFavorite: isFavorite !== undefined ? isFavorite : false
      },
      { new: true, runValidators: true }
    );
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Note updated successfully',
      data: note
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete note
 * @access  Private
 */
exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Note deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/notes/:id/pin
 * @desc    Toggle pin status
 * @access  Private
 */
exports.togglePin = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    note.isPinned = !note.isPinned;
    await note.save();
    
    res.json({
      success: true,
      message: `Note ${note.isPinned ? 'pinned' : 'unpinned'} successfully`,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/notes/:id/favorite
 * @desc    Toggle favorite status
 * @access  Private
 */
exports.toggleFavorite = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    note.isFavorite = !note.isFavorite;
    await note.save();
    
    res.json({
      success: true,
      message: `Note ${note.isFavorite ? 'marked as favorite' : 'removed from favorites'}`,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

