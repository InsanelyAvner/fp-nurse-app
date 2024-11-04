// components/Topbar.js

'use client'

import React from 'react'
import { Bell, LogOut, Mail, Menu, Settings, User } from 'lucide-react'
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

export default function Topbar({ toggleSidebar }) {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 md:hidden"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 ml-4 md:ml-0">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="relative mr-2">
            <Bell size={20} />
            <span className="sr-only">Notifications</span>
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-[#9d2235] text-[10px] font-medium text-white flex items-center justify-center">
              3
            </span>
          </Button>
          <Button variant="ghost" size="icon" className="relative mr-4">
            <Mail size={20} />
            <span className="sr-only">Messages</span>
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-[#9d2235] text-[10px] font-medium text-white flex items-center justify-center">
              2
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.png" alt="Sarah Johnson" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Sarah Johnson
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    sarah.johnson@example.com
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
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
