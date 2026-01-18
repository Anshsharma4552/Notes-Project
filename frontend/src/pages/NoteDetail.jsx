import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiEdit2, FiTrash2, FiBookmark, FiStar } from 'react-icons/fi';
import { notesAPI } from '../services/api';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import NoteForm from '../components/NoteForm';
import { formatDistanceToNow } from 'date-fns';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      const response = await notesAPI.getNote(id);
      setNote(response.data.data);
    } catch (error) {
      toast.error('Failed to load note');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (noteData) => {
    try {
      const response = await notesAPI.updateNote(id, noteData);
      setNote(response.data.data);
      setIsEditModalOpen(false);
      toast.success('Note updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update note');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await notesAPI.deleteNote(id);
      toast.success('Note deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to delete note');
      setIsDeleting(false);
    }
  };

  const handleTogglePin = async () => {
    try {
      const response = await notesAPI.togglePin(id);
      setNote(response.data.data);
    } catch (error) {
      toast.error('Failed to toggle pin');
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const response = await notesAPI.toggleFavorite(id);
      setNote(response.data.data);
    } catch (error) {
      toast.error('Failed to toggle favorite');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!note) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8"
          style={{ backgroundColor: note.color || '#ffffff' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleTogglePin}
                className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                  note.isPinned ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'
                }`}
                title={note.isPinned ? 'Unpin' : 'Pin'}
              >
                <FiBookmark className="w-5 h-5" />
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                  note.isFavorite ? 'text-yellow-500' : 'text-gray-400'
                }`}
                title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <FiStar className={`w-5 h-5 ${note.isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                title="Edit note"
              >
                <FiEdit2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-colors disabled:opacity-50"
                title="Delete note"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {note.title}
          </h1>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {note.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose dark:prose-invert max-w-none mb-6">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {note.content}
            </p>
          </div>

          {/* Metadata */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
            <p>
              Created {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
            </p>
            {note.updatedAt !== note.createdAt && (
              <p>
                Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Note"
      >
        <NoteForm
          note={note}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default NoteDetail;

