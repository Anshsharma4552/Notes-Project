const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
  toggleFavorite
} = require('../controllers/noteController');
const auth = require('../middleware/auth');

/**
 * All routes require authentication
 */
router.use(auth);

/**
 * @route   GET /api/notes
 * @desc    Get all notes
 * @access  Private
 * @query   sort, search, tag, isFavorite, isPinned
 */
router.get('/', getNotes);

/**
 * @route   GET /api/notes/:id
 * @desc    Get single note
 * @access  Private
 */
router.get('/:id', getNote);

/**
 * @route   POST /api/notes
 * @desc    Create new note
 * @access  Private
 */
router.post(
  '/',
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('content')
      .notEmpty()
      .withMessage('Content is required')
      .isLength({ max: 50000 })
      .withMessage('Content cannot exceed 50000 characters'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    body('color')
      .optional()
      .matches(/^#[0-9A-F]{6}$/i)
      .withMessage('Color must be a valid hex code')
  ],
  createNote
);

/**
 * @route   PUT /api/notes/:id
 * @desc    Update note
 * @access  Private
 */
router.put(
  '/:id',
  [
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Title cannot be empty')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('content')
      .optional()
      .notEmpty()
      .withMessage('Content cannot be empty')
      .isLength({ max: 50000 })
      .withMessage('Content cannot exceed 50000 characters'),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    body('color')
      .optional()
      .matches(/^#[0-9A-F]{6}$/i)
      .withMessage('Color must be a valid hex code')
  ],
  updateNote
);

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete note
 * @access  Private
 */
router.delete('/:id', deleteNote);

/**
 * @route   PATCH /api/notes/:id/pin
 * @desc    Toggle pin status
 * @access  Private
 */
router.patch('/:id/pin', togglePin);

/**
 * @route   PATCH /api/notes/:id/favorite
 * @desc    Toggle favorite status
 * @access  Private
 */
router.patch('/:id/favorite', toggleFavorite);

module.exports = router;

