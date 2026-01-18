import { useState, useEffect } from 'react';
import { notesAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useNotes = (filters = {}) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notesAPI.getNotes(filters);
      setNotes(response.data.data || []);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [JSON.stringify(filters)]);

  const createNote = async (noteData) => {
    try {
      const response = await notesAPI.createNote(noteData);
      setNotes((prev) => [response.data.data, ...prev]);
      toast.success('Note created successfully');
      return response.data.data;
    } catch (err) {
      toast.error(err.message || 'Failed to create note');
      throw err;
    }
  };

  const updateNote = async (id, noteData) => {
    try {
      const response = await notesAPI.updateNote(id, noteData);
      setNotes((prev) =>
        prev.map((note) => (note._id === id ? response.data.data : note))
      );
      toast.success('Note updated successfully');
      return response.data.data;
    } catch (err) {
      toast.error(err.message || 'Failed to update note');
      throw err;
    }
  };

  const deleteNote = async (id) => {
    try {
      await notesAPI.deleteNote(id);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success('Note deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete note');
      throw err;
    }
  };

  const togglePin = async (id) => {
    try {
      const response = await notesAPI.togglePin(id);
      setNotes((prev) =>
        prev.map((note) => (note._id === id ? response.data.data : note))
      );
    } catch (err) {
      toast.error(err.message || 'Failed to toggle pin');
      throw err;
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const response = await notesAPI.toggleFavorite(id);
      setNotes((prev) =>
        prev.map((note) => (note._id === id ? response.data.data : note))
      );
    } catch (err) {
      toast.error(err.message || 'Failed to toggle favorite');
      throw err;
    }
  };

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleFavorite,
    refetch: fetchNotes,
  };
};

