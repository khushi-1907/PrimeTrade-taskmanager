'use client';

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../lib/api';
import { Plus, Search, Filter, Trash2, Edit2, CheckCircle, Clock, AlertCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface Task {
    _id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<Partial<Task> | null>(null);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/tasks?search=${search}&status=${filter}`);
            if (response.data.success) {
                setTasks(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching tasks', error);
        } finally {
            setIsLoading(false);
        }
    }, [search, filter]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchTasks();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [fetchTasks]);

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentTask?.title || !currentTask?.description) return;

        try {
            if (currentTask._id) {
                await api.put(`/tasks/${currentTask._id}`, currentTask);
            } else {
                await api.post('/tasks', currentTask);
            }
            setIsModalOpen(false);
            setCurrentTask(null);
            fetchTasks();
        } catch (error) {
            console.error('Error saving task', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task', error);
        }
    };

    const toggleComplete = async (task: Task) => {
        try {
            await api.put(`/tasks/${task._id}`, { completed: !task.completed });
            fetchTasks();
        } catch (error) {
            console.error('Error toggling task', error);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Task Management</h1>
                    <p className="text-gray-500 mt-2">Manage, filter and track your progress efficiently.</p>
                </div>
                <button
                    onClick={() => {
                        setCurrentTask({ completed: false });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                >
                    <Plus size={24} />
                    <span>Add New Task</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-lg"
                    />
                </div>
                <div className="md:col-span-4 relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-lg font-medium"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-28 bg-white/5 rounded-3xl animate-pulse border border-white/10" />
                    ))}
                </div>
            ) : tasks.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence>
                        {tasks.map((task) => (
                            <motion.div
                                key={task._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={cn(
                                    "group flex items-center gap-6 bg-white/5 border border-white/10 p-6 rounded-3xl transition-all duration-300",
                                    task.completed ? "opacity-60 grayscale-[0.5]" : "hover:border-blue-500/30 hover:bg-white/10"
                                )}
                            >
                                <button
                                    onClick={() => toggleComplete(task)}
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                                        task.completed
                                            ? "bg-green-500 border-green-500 text-white"
                                            : "border-gray-500 hover:border-blue-500"
                                    )}
                                >
                                    {task.completed && <Check size={18} />}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <h3 className={cn(
                                        "text-xl font-bold truncate",
                                        task.completed && "line-through text-gray-500"
                                    )}>
                                        {task.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm truncate max-w-2xl">{task.description}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="hidden md:block text-xs text-gray-600 font-mono">
                                        {new Date(task.createdAt).toLocaleDateString()}
                                    </span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setCurrentTask(task);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-gray-300 transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(task._id)}
                                            className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="text-center py-24 bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-600">
                        <Clock size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No tasks to show</h2>
                    <p className="text-gray-500 max-w-sm mx-auto">Either you are all caught up or your search filters are too specific. Level up your productivity!</p>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-xl bg-[#121214] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl overflow-hidden relative"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                        <h2 className="text-3xl font-black mb-8">{currentTask?._id ? 'Edit Task' : 'New Task'}</h2>
                        <form onSubmit={handleCreateOrUpdate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest text-xs">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={currentTask?.title || ''}
                                    onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder:text-gray-700"
                                    placeholder="E.g. Build authentication flow"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-widest text-xs">Description</label>
                                <textarea
                                    required
                                    value={currentTask?.description || ''}
                                    onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder:text-gray-700"
                                    placeholder="Break down the steps..."
                                />
                            </div>
                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-bold transition-all border border-white/10"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20 active:scale-95 text-white"
                                >
                                    {currentTask?._id ? 'Save Changes' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
