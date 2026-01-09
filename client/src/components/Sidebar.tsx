'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    CheckSquare,
    User,
    LogOut,
    CreditCard,
    Settings,
    Menu,
    X
} from 'lucide-react';
import { cn } from '../lib/utils';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: CheckSquare, label: 'Tasks', href: '/dashboard/tasks' },
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-blue-600 rounded-full text-white shadow-xl"
            >
                {isOpen ? <X /> : <Menu />}
            </button>

            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 bg-[#121214] border-r border-white/10 transition-transform duration-300 transform lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    <div className="p-6">
                        <Link href="/dashboard" className="text-2xl font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                            PrimeTrade
                        </Link>
                    </div>

                    <nav className="flex-1 px-4 space-y-2">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                        isActive
                                            ? "bg-blue-600/10 text-blue-500 border border-blue-500/20"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center gap-3 p-4 mb-4 rounded-2xl bg-white/5">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white">
                                {user?.name.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-sm truncate">{user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
