// components/Sidebar.tsx

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  Calendar,
  ClipboardList,
  FileText,
  Home,
  MessageSquare,
  Search,
  Settings,
  User,
} from 'lucide-react';
import NavItem from './NavItem';

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  role: 'admin' | 'nurse';
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar, role }) => {
  const pathname = usePathname();

  // Define navigation items based on role
  const adminNavItems = [
    { label: 'Dashboard', icon: <Home size={20} />, href: '/admin/dashboard' },
    { label: 'Settings', icon: <Settings size={20} />, href: '/#' },
    { label: 'Support', icon: <FileText size={20} />, href: '/#' },
  ];

  const nurseNavItems = [
    { label: 'Dashboard', icon: <Home size={20} />, href: '/' },
    { label: 'Job Matches', icon: <Briefcase size={20} />, href: '/#' },
    { label: 'Job Search', icon: <Search size={20} />, href: '/job-search' },
    { label: 'My Applications', icon: <ClipboardList size={20} />, href: '/#' },
    // { label: 'Schedule', icon: <Calendar size={20} />, href: '/schedule' },
    // { label: 'Messages', icon: <MessageSquare size={20} />, href: '/messages' },
    { label: 'Profile', icon: <User size={20} />, href: '/profile' },
    { label: 'Settings', icon: <Settings size={20} />, href: '/#' },
  ];

  const navItems = role === 'admin' ? adminNavItems : nurseNavItems;

  return (
    <aside
      className={`bg-white shadow-md transition-transform duration-300 ease-in-out fixed inset-y-0 left-0 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:static md:inset-0 z-30 w-64`}
    >
      {/* Close button for mobile view */}
      <button
        onClick={toggleSidebar}
        className="md:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-800"
      >
        ✕
      </button>

      <div className="p-4">
        <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
      </div>
      <nav className="mt-4">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            isOpen={isSidebarOpen}
            isActive={pathname === item.href}
            href={item.href}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
