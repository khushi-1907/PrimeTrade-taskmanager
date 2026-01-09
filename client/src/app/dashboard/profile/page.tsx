'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import { User, Mail, Shield, Save, Loader2, Key } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { motion } from 'framer-motion';

export default function ProfilePage() {
    const { user, login } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', text: '' });

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: '', text: '' });
        try {
            const response = await api.put('/auth/profile', formData);
            if (response.data.success) {
                login(response.data);
                setStatus({ type: 'success', text: 'Profile updated successfully' });
                setFormData(prev => ({ ...prev, password: '' }));
            }
        } catch (error: any) {
            setStatus({ type: 'error', text: error.response?.data?.message || 'Update failed' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-10 py-6">
            <div className="flex flex-col md:flex-row items-center gap-8 bg-white/5 border border-white/10 p-10 rounded-[3rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full" />

                <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-5xl font-black shadow-2xl shadow-blue-500/40 relative z-10">
                    {user?.name.charAt(0).toUpperCase()}
                </div>

                <div className="text-center md:text-left relative z-10">
                    <h1 className="text-4xl font-black">{user?.name}</h1>
                    <p className="text-gray-500 text-lg">{user?.email}</p>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                        <span className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-blue-500/20">Active Session</span>
                        <span className="bg-white/5 text-gray-500 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/10">Member since 2026</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl"
                >
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                        <Settings className="text-blue-500" /> Account Settings
                    </h2>

                    {status.text && (
                        <div className={`mb-8 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                            {status.text}
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-[0.2em] px-2">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white font-medium"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-[0.2em] px-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white font-medium"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-[0.2em] px-2">Change Password</label>
                            <div className="relative max-w-md">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white font-medium"
                                    placeholder="Leave blank to keep current"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-6 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black transition-all shadow-2xl shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                            Update Changes
                        </button>
                    </form>
                </motion.div>

                <div className="bg-red-500/5 border border-red-500/10 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-red-400">Danger Zone</h3>
                        <p className="text-gray-500 text-sm">Permanently delete your account and all its data.</p>
                    </div>
                    <button className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-xl border border-red-500/20 transition-all">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}

// Helper icons/components
function Settings({ className }: { className?: string }) {
    return (
        <div className={cn("p-2 bg-blue-500/10 rounded-xl", className)}>
            <Shield size={20} />
        </div>
    )
}
