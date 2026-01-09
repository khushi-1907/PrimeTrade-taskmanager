'use client';

import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import {
    CheckCircle,
    Clock,
    List,
    TrendingUp,
    Calendar,
    Layers
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export default function OverviewPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/tasks');
                if (response.data.success) {
                    const tasks = response.data.data;
                    setStats({
                        total: tasks.length,
                        completed: tasks.filter((t: any) => t.completed).length,
                        pending: tasks.filter((t: any) => !t.completed).length
                    });
                }
            } catch (error) {
                console.error('Error fetching stats', error);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { label: 'Total Tasks', value: stats.total, icon: List, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    ];

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-black">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
                <p className="text-gray-500 mt-2 text-lg">Here&apos;s an overview of your productivity today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, idx) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/5 border border-white/10 p-8 rounded-[2rem] relative overflow-hidden group"
                    >
                        <div className={cn("inline-flex p-3 rounded-2xl mb-6", card.bg, card.color)}>
                            <card.icon size={24} />
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{card.label}</p>
                        <h3 className="text-5xl font-black mt-2">{card.value}</h3>

                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <card.icon size={120} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <TrendingUp className="text-purple-500" /> Recent Activity
                        </h2>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full">Coming Soon</span>
                    </div>
                    <div className="space-y-4 opacity-40 select-none">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5">
                                <div className="w-10 h-10 rounded-full bg-white/10" />
                                <div className="h-4 w-32 bg-white/10 rounded-full" />
                                <div className="h-4 w-12 bg-white/10 rounded-full ml-auto" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-8 rounded-[2rem] text-white flex flex-col justify-between overflow-hidden relative group">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-4">Pro Plan</h2>
                        <p className="text-blue-100 mb-8 max-w-xs">Unlock advanced task automation, team collaboration and detailed analytics.</p>
                        <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-900/40 hover:scale-105 transition-transform active:scale-95">
                            Upgrade Now
                        </button>
                    </div>

                    <div className="absolute bottom-[-20%] right-[-10%] opacity-20 group-hover:scale-110 transition-transform duration-700">
                        <Layers size={300} />
                    </div>
                </div>
            </div>
        </div>
    );
}
