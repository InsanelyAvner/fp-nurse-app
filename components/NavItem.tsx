// components/NavItem.tsx

import React from 'react';
import Link from 'next/link';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  isActive?: boolean;
  href: string;
}

export default function NavItem({ icon, label, isOpen, isActive = false, href }: NavItemProps) {
  return (
    <Link href={href} passHref legacyBehavior>
      <a
        className={`flex items-center py-2 px-4 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors ${
          isActive ? 'bg-gray-100 text-gray-900' : ''
        }`}
      >
        {icon}
        <span className={`ml-3 ${isOpen ? 'block' : 'hidden md:block'}`}>
          {label}
        </span>
      </a>
    </Link>
  );
}
