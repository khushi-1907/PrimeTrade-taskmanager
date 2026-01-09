'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="border-b border-white/10 bg-[#0a0a0b]/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    PrimeTrade
                </Link>

                {user && (
                    <div className="flex items-center space-x-6">
                        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                            <LayoutDashboard size={18} />
                            <span className="hidden sm:inline">Dashboard</span>
                        </Link>
                        <Link href="/profile" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                            <UserIcon size={18} />
                            <span className="hidden sm:inline">Profile</span>
                        </Link>
                        <button
                            onClick={logout}
                            className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                        <div className="flex items-center gap-2 pl-4 border-l border-white/10">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                                {user.name.charAt(0)}
                            </div>
                            <span className="text-sm text-gray-300 hidden md:inline">{user.name}</span>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
