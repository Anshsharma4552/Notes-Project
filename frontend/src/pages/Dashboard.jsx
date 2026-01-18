import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiX } from 'react-icons/fi';
import { useNotes } from '../hooks/useNotes';
import NoteCard from '../components/NoteCard';
import Modal from '../components/Modal';
import NoteForm from '../components/NoteForm';
import { NoteCardSkeleton } from '../components/Skeleton';
import { useCursor } from '../context/CursorContext';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterTag, setFilterTag] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showPinned, setShowPinned] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const navigate = useNavigate();
  const { textCursor, pointerCursor } = useCursor();

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
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-10 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black w-5 h-5 group-hover:scale-110 transition-transform" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full bg-white border-2 border-transparent focus:border-white shadow-[0_0_15px_rgba(255,255,255,0.1)] rounded-xl px-12 py-3 text-black placeholder-gray-500 focus:outline-none focus:ring-0 transition-all duration-300 font-medium"
                {...textCursor}
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border-2 border-transparent focus:border-white shadow-[0_0_15px_rgba(255,255,255,0.1)] rounded-xl px-6 py-3 text-black font-medium focus:outline-none focus:ring-0 appearance-none cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all min-w-[160px]"
              {...pointerCursor}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="updated">Recently Updated</option>
            </select>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-primary-dim mr-2 font-medium">Filters:</span>
            <button
              onClick={() => setShowPinned(!showPinned)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${showPinned
                ? 'bg-white text-black border-white'
                : 'bg-surface border-border text-primary-muted hover:border-white hover:text-white'
                }`}
              {...pointerCursor}
            >
              Pinned
            </button>
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${showFavorites
                ? 'bg-white text-black border-white'
                : 'bg-surface border-border text-primary-muted hover:border-white hover:text-white'
                }`}
              {...pointerCursor}
            >
              Favorites
            </button>
            {filterTag && (
              <button
                onClick={() => setFilterTag('')}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white text-black border border-white flex items-center space-x-1 hover:bg-gray-200 transition-colors"
                {...pointerCursor}
              >
                <span>{filterTag}</span>
                <FiX className="w-4 h-4" />
              </button>
            )}
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${filterTag === tag
                  ? 'bg-white text-black border-white'
                  : 'bg-surface border-border text-primary-muted hover:border-white hover:text-white'
                  }`}
                {...pointerCursor}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <NoteCardSkeleton key={i} />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-32 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-surface border border-border rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <span className="text-6xl font-bold text-white">N</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              No notes yet
            </h2>
            <p className="text-primary-muted mb-8 max-w-sm">
              {searchQuery || filterTag || showFavorites || showPinned
                ? 'Try adjusting your filters to find what you are looking for.'
                : 'Capture your thoughts, ideas, and reminders. Create your first note to get started.'}
            </p>
            {!searchQuery && !filterTag && !showFavorites && !showPinned && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                {...pointerCursor}
              >
                Create Note
              </button>
            )}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr"
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
        className="fixed bottom-10 right-10 w-16 h-16 bg-white text-black rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center z-40 transition-all hover:bg-gray-100"
        aria-label="Add new note"
        {...pointerCursor}
      >
        <FiPlus className="w-8 h-8" />
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
