import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiMail, FiLock } from 'react-icons/fi';
import { useCursor } from '../context/CursorContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { textCursor, pointerCursor } = useCursor();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="card p-10 bg-surface border border-border mt-10">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3 hover:rotate-6 transition-transform duration-300">
              <span className="text-black font-bold text-3xl tracking-tighter">N.</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-primary-muted font-light">
              Enter your details to access your workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-primary-dim uppercase tracking-wider mb-1">
                Email Address
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
                  {...textCursor}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-3.5 rounded-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
              disabled={loading}
              {...pointerCursor}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-primary-muted">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-white font-medium hover:underline decoration-white/50 underline-offset-4"
              {...pointerCursor}
            >
              Start here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

