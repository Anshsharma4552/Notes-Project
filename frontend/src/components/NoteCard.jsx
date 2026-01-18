import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookmark, FiStar, FiTrash2 } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const NoteCard = ({ note, onDelete, onTogglePin, onToggleFavorite }) => {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note._id);
    }
  };

  const handleTogglePin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onTogglePin(note._id);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(note._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={`/notes/${note._id}`}
        className="block card p-4 h-full hover:shadow-xl transition-all duration-200"
        style={{ backgroundColor: note.color || '#ffffff' }}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2 flex-1">
            {note.isPinned && (
              <FiBookmark className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            )}
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 flex-1">
              {note.title}
            </h3>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <button
              onClick={handleTogglePin}
              className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                note.isPinned ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'
              }`}
              title={note.isPinned ? 'Unpin' : 'Pin'}
            >
              <FiBookmark className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                note.isFavorite ? 'text-yellow-500' : 'text-gray-400'
              }`}
              title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <FiStar className={`w-4 h-4 ${note.isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
          {note.content}
        </p>

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full"
              >
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
          <span>
            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDelete}
              className="p-1 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Delete note"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default NoteCard;

