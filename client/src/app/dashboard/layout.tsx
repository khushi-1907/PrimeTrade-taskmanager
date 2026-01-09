'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white">
            <Sidebar />
            <main className="lg:pl-64 min-h-screen transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 py-10 lg:px-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
