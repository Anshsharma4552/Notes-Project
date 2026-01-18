import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCamera, FiUser, FiMail, FiUpload } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const ProfileModal = ({ isOpen, onClose }) => {
    const { user, updateUser } = useAuth();
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
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            {/* Header */}
                            <div className="relative h-32 bg-gradient-to-r from-primary-500 to-primary-600">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Profile Content */}
                            <div className="px-6 pb-8">
                                {/* Avatar */}
                                <div className="relative -mt-16 mb-6 flex justify-center">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 overflow-hidden shadow-lg">
                                            {user?.avatar ? (
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${user.avatar}`}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                                    <FiUser className="w-16 h-16" />
                                                </div>
                                            )}

                                            {/* Upload Overlay */}
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                            >
                                                <FiCamera className="w-8 h-8 text-white" />
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-0 right-0 p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg transition-colors border-2 border-white dark:border-gray-800"
                                        >
                                            {isUploading ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                                <div className="text-center space-y-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {user?.name}
                                        </h2>
                                        <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2 mt-1">
                                            <FiMail className="w-4 h-4" />
                                            {user?.email}
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Account Status</p>
                                                <p className="font-semibold text-green-500">Active</p>
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
