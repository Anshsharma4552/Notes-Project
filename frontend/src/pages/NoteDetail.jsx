import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiEdit2, FiTrash2, FiBookmark, FiStar, FiCheckSquare } from 'react-icons/fi';
import { notesAPI } from '../services/api';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import NoteForm from '../components/NoteForm';
import { formatDistanceToNow } from 'date-fns';
import { useCursor } from '../context/CursorContext';

const NoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pointerCursor } = useCursor();

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

  const handleToggleChecklistItem = async (index) => {
    try {
      const updatedChecklist = note.checklist.map((item, i) =>
        i === index ? { ...item, isComplete: !item.isComplete } : item
      );

      const response = await notesAPI.updateNote(id, {
        ...note,
        checklist: updatedChecklist
      });
      setNote(response.data.data);
    } catch (error) {
      toast.error('Failed to update checklist item');
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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
      </div>
    );
  }

  if (!note) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-border rounded-xl p-8 backdrop-blur-sm bg-card"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-8 border-b border-border pb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-primary-muted hover:text-white transition-all transform hover:-translate-x-1"
              {...pointerCursor}
            >
              <FiArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleTogglePin}
                className={`p-2.5 rounded-lg border transition-all ${note.isPinned
                  ? 'bg-white text-black border-white'
                  : 'bg-surface border-border text-primary-muted hover:text-white hover:border-white'
                  }`}
                title={note.isPinned ? 'Unpin' : 'Pin'}
                {...pointerCursor}
              >
                <FiBookmark className="w-5 h-5" />
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`p-2.5 rounded-lg border transition-all ${note.isFavorite
                  ? 'bg-white text-black border-white'
                  : 'bg-surface border-border text-primary-muted hover:text-white hover:border-white'
                  }`}
                title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                {...pointerCursor}
              >
                <FiStar className={`w-5 h-5 ${note.isFavorite ? 'fill-current' : ''}`} />
              </button>
              <div className="h-6 w-px bg-border mx-2"></div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="p-2.5 rounded-lg bg-surface border border-border text-primary-muted hover:text-white hover:border-white transition-all"
                title="Edit note"
                {...pointerCursor}
              >
                <FiEdit2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2.5 rounded-lg bg-surface border border-border text-primary-muted hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 transition-all disabled:opacity-50"
                title="Delete note"
                {...pointerCursor}
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
            {note.title}
          </h1>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {note.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-surface border border-border text-primary-muted rounded-full text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none mb-8">
            {note.type === 'checklist' ? (
              <div className="space-y-4">
                {note.checklist.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 hover:bg-white/5 rounded-lg transition-colors cursor-pointer group" onClick={() => handleToggleChecklistItem(index)} {...pointerCursor}>
                    <div className={`p-1 rounded border overflow-hidden transition-all ${item.isComplete ? 'bg-white border-white' : 'border-primary-muted group-hover:border-white'}`}>
                      {item.isComplete ? (
                        <FiCheckSquare className="w-5 h-5 text-black" />
                      ) : (
                        <div className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`text-xl transition-all duration-300 ${item.isComplete ? 'line-through text-primary-dim decoration-primary-dim' : 'text-primary-100'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
                {note.checklist.length === 0 && (
                  <p className="text-primary-dim italic pl-2">Empty checklist</p>
                )}
              </div>
            ) : (
              <p className="text-primary-100 whitespace-pre-wrap leading-relaxed text-lg font-light">
                {note.content}
              </p>
            )}
          </div>

          {/* Metadata */}
          <div className="pt-8 border-t border-border text-sm text-primary-dim flex justify-between items-center font-mono">
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
