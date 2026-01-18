import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred';

      // Handle 401 Unauthorized - Clear token and redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Don't redirect if already on login/register page
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }

      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response (network error, CORS, etc.)
      // Don't throw error for getMe calls during init to prevent hanging
      if (error.config?.url?.includes('/auth/me')) {
        return Promise.reject(new Error('Network error'));
      }
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

// Auth API
export const authAPI = {
  register: (userData) => {
    const isFormData = userData instanceof FormData;
    return api.post('/auth/register', userData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
    });
  },
  login: (userData) => api.post('/auth/login', userData),
  getMe: () => api.get('/auth/me'),
  uploadAvatar: (formData) => api.post('/auth/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Notes API
export const notesAPI = {
  getNotes: (params) => api.get('/notes', { params }),
  getNote: (id) => api.get(`/notes/${id}`),
  createNote: (noteData) => api.post('/notes', noteData),
  updateNote: (id, noteData) => api.put(`/notes/${id}`, noteData),
  deleteNote: (id) => api.delete(`/notes/${id}`),
  togglePin: (id) => api.patch(`/notes/${id}/pin`),
  toggleFavorite: (id) => api.patch(`/notes/${id}/favorite`),
};

export default api;

