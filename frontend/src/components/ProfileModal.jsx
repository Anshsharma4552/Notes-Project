import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCamera, FiUser, FiMail, FiUpload } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCursor } from '../context/CursorContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const ProfileModal = ({ isOpen, onClose }) => {
    const { user, updateUser } = useAuth();
    const { pointerCursor } = useCursor();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        setIsUploading(true);
        try {
            const response = await authAPI.uploadAvatar(formData);
            updateUser(response.data.user);
            toast.success('Profile picture updated!');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.message || 'Failed to upload profile picture');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
                        >
                            {/* Header Background */}
                            <div className="h-32 bg-surface border-b border-border w-full relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors border border-white/10"
                                    {...pointerCursor}
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Profile Content */}
                            <div className="px-6 pb-8">
                                {/* Avatar */}
                                <div className="relative -mt-16 mb-6 flex justify-center">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-full border-4 border-card bg-surface overflow-hidden shadow-xl" {...pointerCursor}>
                                            {user?.avatar ? (
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${user.avatar}`}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-primary-dim">
                                                    <FiUser className="w-12 h-12" />
                                                </div>
                                            )}

                                            {/* Upload Overlay */}
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm"
                                            >
                                                <FiCamera className="w-8 h-8 text-white" />
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-1 right-1 p-2.5 bg-white text-black rounded-full shadow-lg transition-transform hover:scale-110 border-2 border-card"
                                            title="Upload photo"
                                            {...pointerCursor}
                                        >
                                            {isUploading ? (
                                                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <FiUpload className="w-4 h-4" />
                                            )}
                                        </button>

                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileSelect}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="text-center space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white tracking-tight">
                                            {user?.name}
                                        </h2>
                                        <p className="text-primary-muted flex items-center justify-center gap-2 mt-1.5 font-light">
                                            <FiMail className="w-4 h-4" />
                                            {user?.email}
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-border">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl bg-surface border border-border group hover:border-white/20 transition-colors">
                                                <p className="text-xs text-primary-dim uppercase tracking-wider font-semibold mb-1">Member Since</p>
                                                <p className="font-mono text-white text-sm">
                                                    {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-surface border border-border group hover:border-white/20 transition-colors">
                                                <p className="text-xs text-primary-dim uppercase tracking-wider font-semibold mb-1">Status</p>
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                    <p className="font-medium text-white text-sm">Active</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProfileModal;
