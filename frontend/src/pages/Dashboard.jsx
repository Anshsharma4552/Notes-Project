import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { useNotes } from '../hooks/useNotes';
import NoteCard from '../components/NoteCard';
import Modal from '../components/Modal';
import NoteForm from '../components/NoteForm';
import { NoteCardSkeleton } from '../components/Skeleton';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterTag, setFilterTag] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showPinned, setShowPinned] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const navigate = useNavigate();

  const filters = {
    sort: sortBy,
    search: searchQuery || undefined,
    tag: filterTag || undefined,
    isFavorite: showFavorites || undefined,
    isPinned: showPinned || undefined,
  };

  const { notes, loading, createNote, updateNote, deleteNote, togglePin, toggleFavorite } =
    useNotes(filters);

  const handleCreateNote = async (noteData) => {
    try {
      await createNote(noteData);
      setIsModalOpen(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleUpdateNote = async (noteData) => {
    try {
      await updateNote(editingNote._id, noteData);
      setIsModalOpen(false);
      setEditingNote(null);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
  };

  // Get all unique tags
  const allTags = [...new Set(notes.flatMap((note) => note.tags || []))];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="input-field pl-10"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="updated">Recently Updated</option>
            </select>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowPinned(!showPinned)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showPinned
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Pinned
            </button>
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showFavorites
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Favorites
            </button>
            {filterTag && (
              <button
                onClick={() => setFilterTag('')}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white flex items-center space-x-1"
              >
                <span>{filterTag}</span>
                <FiX className="w-4 h-4" />
              </button>
            )}
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterTag === tag
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <NoteCardSkeleton key={i} />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No notes yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery || filterTag || showFavorites || showPinned
                ? 'Try adjusting your filters'
                : 'Create your first note to get started'}
            </p>
            {!searchQuery && !filterTag && !showFavorites && !showPinned && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary"
              >
                Create Note
              </button>
            )}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {notes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onDelete={deleteNote}
                  onTogglePin={togglePin}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Floating Add Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center z-40 transition-colors"
        aria-label="Add new note"
      >
        <FiPlus className="w-6 h-6" />
      </motion.button>

      {/* Create/Edit Note Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingNote ? 'Edit Note' : 'Create New Note'}
      >
        <NoteForm
          note={editingNote}
          onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;

