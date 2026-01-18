import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiUpload } from 'react-icons/fi';
import { useCursor } from '../context/CursorContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { textCursor, pointerCursor } = useCursor();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      if (avatar) {
        data.append('avatar', avatar);
      }

      await register(data);
      navigate('/dashboard');
    } catch (error) {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="card p-10 bg-surface border border-border">
          <div className="text-center mb-8">
            <div
              className="w-24 h-24 bg-card border-2 border-dashed border-border rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden group cursor-pointer hover:border-white transition-all duration-300"
              {...pointerCursor}
            >
              {avatar ? (
                <img
                  src={URL.createObjectURL(avatar)}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-primary-dim group-hover:text-white transition-colors">
                  <FiUpload className="w-6 h-6 mb-1" />
                  <span className="text-xs">Upload</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Create Account
            </h1>
            <p className="text-primary-muted font-light">
              Join us to organize your thoughts
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-primary-dim uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-dim w-5 h-5 group-hover:text-white transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-border rounded-lg px-12 py-3 text-white placeholder-primary-dim focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200"
                  placeholder="John Doe"
                  required
                  minLength={2}
                  {...textCursor}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-primary-dim uppercase tracking-wider mb-1">
                Email
              </label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-dim w-5 h-5 group-hover:text-white transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-border rounded-lg px-12 py-3 text-white placeholder-primary-dim focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200"
                  placeholder="name@example.com"
                  required
                  {...textCursor}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-primary-dim uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-dim w-5 h-5 group-hover:text-white transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-border rounded-lg px-12 py-3 text-white placeholder-primary-dim focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all duration-200"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  {...textCursor}
                />
              </div>
              <p className="text-xs text-primary-dim pt-1 text-right">
                Must be at least 6 characters
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-3.5 rounded-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
              disabled={loading}
              {...pointerCursor}
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-primary-muted">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-white font-medium hover:underline decoration-white/50 underline-offset-4"
              {...pointerCursor}
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

