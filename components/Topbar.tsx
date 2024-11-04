// components/Topbar.tsx

'use client'

import React from 'react'
import { Bell, LogOut, Mail, Settings, User, Menu } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TopbarProps {
  role: 'admin' | 'nurse';
  toggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ role, toggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
        
        {/* Sidebar Toggle and Title */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-3 md:hidden"
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">
            {role === 'admin' ? 'Admin Dashboard' : 'Nurse Dashboard'}
          </h1>
        </div>

        {/* Notifications, Messages, and User Dropdown */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="sr-only">Notifications</span>
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#9d2235] text-xs font-semibold text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Messages */}
          <Button variant="ghost" size="icon" className="relative">
            <Mail size={20} />
            <span className="sr-only">Messages</span>
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#9d2235] text-xs font-semibold text-white flex items-center justify-center">
              2
            </span>
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.png" alt="User Avatar" />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">
                    John Doe
                  </p>
                  <p className="text-xs leading-none text-gray-500">
                    john.doe@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4 text-red-500" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export default Topbar
