import { useState, useEffect } from 'react';
import { FiTag, FiDroplet, FiCheckSquare, FiList, FiCalendar, FiX, FiPlus } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useCursor } from '../context/CursorContext';

const NoteForm = ({ note, onSubmit, onCancel, loading = false }) => {
  const { textCursor, pointerCursor } = useCursor();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    color: '#1A1A1A',
    isPinned: false,
    isFavorite: false,
    type: 'text',
    checklist: [],
    reminder: null
  });
  const [tagInput, setTagInput] = useState('');
  const [checklistItemInput, setChecklistItemInput] = useState('');

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || '',
        content: note.content || '',
        tags: note.tags || [],
        color: note.color || '#1A1A1A',
        isPinned: note.isPinned || false,
        isFavorite: note.isFavorite || false,
        type: note.type || 'text',
        checklist: note.checklist || [],
        reminder: note.reminder ? new Date(note.reminder) : null,
      });
    }
  }, [note]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddChecklistItem = (e) => {
    e.preventDefault();
    if (checklistItemInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        checklist: [...prev.checklist, { text: checklistItemInput.trim(), isComplete: false }]
      }));
      setChecklistItemInput('');
    }
  };

  const handleRemoveChecklistItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      checklist: prev.checklist.filter((_, i) => i !== index)
    }));
  };

  const handleToggleChecklistItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item, i) =>
        i === index ? { ...item, isComplete: !item.isComplete } : item
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Modern monochrome-compatible colors
  const colors = [
    '#1A1A1A', // Default Card
    '#262626', // Neutral
    '#1F2937', // Blue-ish Gray
    '#374151', // Lighter Blue-ish Gray
    '#1C1917', // Stone
    '#292524', // Lighter Stone
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center bg-surface border border-border p-2 rounded-xl">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type: 'text' }))}
            className={`p-2 rounded-lg transition-all ${formData.type === 'text'
              ? 'bg-white text-black shadow-sm'
              : 'text-primary-muted hover:text-white hover:bg-white/10'
              }`}
            title="Text Note"
            {...pointerCursor}
          >
            <FiList className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, type: 'checklist' }))}
            className={`p-2 rounded-lg transition-all ${formData.type === 'checklist'
              ? 'bg-white text-black shadow-sm'
              : 'text-primary-muted hover:text-white hover:bg-white/10'
              }`}
            title="Checklist"
            {...pointerCursor}
          >
            <FiCheckSquare className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg shadow-sm">
          <FiCalendar className="w-4 h-4 text-black" />
          <DatePicker
            selected={formData.reminder}
            onChange={(date) => setFormData(prev => ({ ...prev, reminder: date }))}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMM d, h:mm aa"
            placeholderText="Set reminder..."
            className="bg-transparent border-none text-sm font-medium focus:ring-0 w-36 text-black placeholder-gray-500 cursor-pointer p-0"
            calendarClassName="!bg-white !border-gray-200 !text-black !font-['Inter'] !shadow-xl"
          />
          {formData.reminder && (
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, reminder: null }))}
              className="text-gray-500 hover:text-red-500 transition-colors"
              {...pointerCursor}
            >
              <FiX className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="relative group">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Note Title"
          className="w-full bg-transparent text-4xl font-bold text-white placeholder-primary-dim focus:outline-none border-none p-0"
          required
          {...textCursor}
        />
        <div className="h-0.5 w-0 group-focus-within:w-full bg-white/20 transition-all duration-300 absolute bottom-0 left-0" />
      </div>

      {formData.type === 'text' ? (
        <div className="min-h-[200px]">
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Start typing..."
            rows="10"
            className="w-full bg-transparent text-primary-100 placeholder-primary-dim resize-none focus:outline-none border-none p-0 text-lg leading-relaxed font-light"
            required={formData.type === 'text'}
            {...textCursor}
          />
        </div>
      ) : (
        <div className="space-y-3 min-h-[200px]">
          <div className="space-y-2">
            {formData.checklist.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 group bg-surface/50 p-2 rounded-lg hover:bg-surface transition-colors">
                <div
                  onClick={() => handleToggleChecklistItem(index)}
                  className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${item.isComplete ? 'bg-white border-white' : 'border-primary-dim hover:border-white'
                    }`}
                  {...pointerCursor}
                >
                  {item.isComplete && <FiCheckSquare className="w-3.5 h-3.5 text-black" />}
                </div>
                <span
                  onClick={() => handleToggleChecklistItem(index)}
                  className={`flex-1 text-lg cursor-pointer transition-all ${item.isComplete ? 'line-through text-primary-dim' : 'text-white'
                    }`}
                  {...pointerCursor}
                >
                  {item.text}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveChecklistItem(index)}
                  className="p-1 text-primary-dim opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                  {...pointerCursor}
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-3 bg-surface p-2 rounded-lg border border-transparent focus-within:border-border transition-colors">
            <FiPlus className="w-5 h-5 text-primary-dim" />
            <input
              type="text"
              value={checklistItemInput}
              onChange={(e) => setChecklistItemInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem(e)}
              placeholder="Add item..."
              className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-white placeholder-primary-dim"
              {...textCursor}
            />
            <button
              type="button"
              onClick={handleAddChecklistItem}
              disabled={!checklistItemInput.trim()}
              className="text-sm font-medium text-white disabled:opacity-50 px-3 py-1 bg-white/10 rounded-md hover:bg-white/20 transition-colors"
              {...pointerCursor}
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-4 pt-6 border-t border-border">
        {/* Tags */}
        <div>
          <div className="flex items-center space-x-2 text-primary-dim mb-3 text-sm uppercase tracking-wider font-medium">
            <FiTag className="w-4 h-4" />
            <span>Tags</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-surface border border-border text-white rounded-full text-sm flex items-center space-x-2 group hover:border-white/50 transition-colors"
              >
                <span>#{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-primary-dim hover:text-white transition-colors"
                  {...pointerCursor}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
              placeholder="Type tag & press enter"
              className="px-3 py-1 bg-transparent border-none focus:ring-0 text-primary-muted placeholder-primary-dim text-sm"
              {...textCursor}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.isPinned ? 'bg-white border-white' : 'border-primary-dim group-hover:border-white'
                }`}>
                {formData.isPinned && <div className="w-3 h-3 bg-black rounded-sm" />}
                <input
                  type="checkbox"
                  name="isPinned"
                  checked={formData.isPinned}
                  onChange={handleChange}
                  className="hidden"
                />
              </div>
              <span className="text-sm text-primary-muted group-hover:text-white transition-colors">Pin to top</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.isFavorite ? 'bg-white border-white' : 'border-primary-dim group-hover:border-white'
                }`}>
                {formData.isFavorite && <div className="w-3 h-3 bg-black rounded-sm" />}
                <input
                  type="checkbox"
                  name="isFavorite"
                  checked={formData.isFavorite}
                  onChange={handleChange}
                  className="hidden"
                />
              </div>
              <span className="text-sm text-primary-muted group-hover:text-white transition-colors">Mark as favorite</span>
            </label>
          </div>

          <div className="flex items-center space-x-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-primary-muted hover:text-white transition-colors font-medium"
                disabled={loading}
                {...pointerCursor}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all transform hover:-translate-y-0.5"
              disabled={loading}
              {...pointerCursor}
            >
              {loading ? 'Saving...' : note ? 'Save Changes' : 'Create Note'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default NoteForm;
