import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookmark, FiStar, FiTrash2, FiCheckSquare, FiCalendar } from 'react-icons/fi';
import { formatDistanceToNow, format } from 'date-fns';
import { useCursor } from '../context/CursorContext';

const NoteCard = ({ note, onDelete, onTogglePin, onToggleFavorite }) => {
  const { cardCursor, pointerCursor } = useCursor();

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
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/notes/${note._id}`}
        className="block card p-6 h-full card-hover bg-card group relative overflow-hidden text-primary"
        {...cardCursor}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2 flex-1">
            {note.isPinned && (
              <FiBookmark className="w-4 h-4 text-white" />
            )}
            <h3 className="font-semibold text-white group-hover:text-primary-muted transition-colors line-clamp-2 flex-1 text-lg">
              {note.title}
            </h3>
          </div>
          <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleTogglePin}
              className={`p-2 rounded hover:bg-surface transition-colors ${note.isPinned ? 'text-white' : 'text-primary-muted'
                }`}
              title={note.isPinned ? 'Unpin' : 'Pin'}
              {...pointerCursor}
            >
              <FiBookmark className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded hover:bg-surface transition-colors ${note.isFavorite ? 'text-white' : 'text-primary-muted'
                }`}
              title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              {...pointerCursor}
            >
              <FiStar className={`w-4 h-4 ${note.isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {note.type === 'checklist' ? (
          <div className="space-y-2 mb-4">
            {note.checklist.slice(0, 4).map((item, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <FiCheckSquare className={`w-4 h-4 ${item.isComplete ? 'text-white' : 'text-primary-muted'}`} />
                <span className={`line-clamp-1 ${item.isComplete ? 'line-through text-primary-dim' : 'text-primary-100'}`}>
                  {item.text}
                </span>
              </div>
            ))}
            {note.checklist.length > 4 && (
              <p className="text-xs text-primary-dim italic pl-6">
                + {note.checklist.length - 4} more items
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-primary-100 line-clamp-3 mb-4 leading-relaxed font-light">
            {note.content}
          </p>
        )}

        {note.reminder && (
          <div className="flex items-center space-x-1.5 mb-4 text-xs text-primary-muted border border-border rounded px-2 py-1 w-fit group-hover:border-primary-muted transition-colors">
            <FiCalendar className="w-3 h-3" />
            <span>{format(new Date(note.reminder), 'MMM d, h:mm a')}</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border group-hover:border-primary-dim transition-colors">
          <div className="flex gap-2">
            {note.tags && note.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="text-xs text-primary-dim bg-surface px-2 py-0.5 rounded border border-border">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-primary-dim">
              {formatDistanceToNow(new Date(note.updatedAt))} ago
            </span>
            <button
              onClick={handleDelete}
              className="p-1.5 text-primary-dim hover:text-white hover:bg-red-500/20 rounded transition-colors opacity-0 group-hover:opacity-100"
              title="Delete note"
              {...pointerCursor}
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

