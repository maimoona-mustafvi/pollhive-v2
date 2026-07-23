'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, Home, BookOpen, BarChart3, History, Settings } from 'lucide-react';

const navItems = [
  { key: 'home', label: 'Home', href: '/dashboard', icon: Home },
  { key: 'practice', label: 'Practice', href: '/practice', icon: BookOpen },
  { key: 'content', label: 'My Content', href: '/my-content', icon: BarChart3 },
  { key: 'history', label: 'History', href: '/history', icon: History },
  { key: 'settings', label: 'Settings', href: '/settings', icon: Settings },
];

export function LearnerSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-navy text-white transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && <h1 className="text-xl font-bold">Auxilio</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
