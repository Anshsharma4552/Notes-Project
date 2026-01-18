import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCursor } from '../context/CursorContext';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ProfileModal from './ProfileModal';

const Header = () => {
  const { user, logout } = useAuth();
  const { pointerCursor } = useCursor();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 group"
              {...pointerCursor}
            >
              <div className="w-8 h-8 bg-surface border border-border rounded flex items-center justify-center group-hover:bg-white group-hover:border-white transition-colors duration-300">
                <span className="text-white group-hover:text-black font-bold text-lg transition-colors">N</span>
              </div>
              <span className="text-xl font-medium text-primary tracking-tight group-hover:text-primary-muted transition-colors">
                Notes
              </span>
            </Link>

            <div className="flex items-center space-x-6">
              {user && (
                <>
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="flex items-center space-x-2 text-sm text-primary-muted hover:text-white transition-colors"
                    {...pointerCursor}
                  >
                    {user.avatar ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${user.avatar}`}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center">
                        <FiUser className="w-4 h-4" />
                      </div>
                    )}
                    <span className="hidden md:inline font-medium">{user.name}</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 bg-surface hover:bg-white hover:text-black border border-border hover:border-white text-primary rounded-lg transition-all duration-300"
                    {...pointerCursor}
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
};

export default Header;

