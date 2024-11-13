// components/Topbar.tsx

'use client'

import React, { useContext } from 'react';
import { Bell, LogOut, Settings, User, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import IndeterminateProgressBar from './ui/indeterminateProgress';

import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { UserContext } from "@/app/context/UserContext";
import { LoadingContext } from '@/app/context/LoadingContext';

interface TopbarProps {
  role: 'admin' | 'nurse';
  toggleSidebar: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ role, toggleSidebar }) => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { isLoading, startLoading, stopLoading } = useContext(LoadingContext);

  const handleLogout = async () => {
    try {
      startLoading(); // Start loading

      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/login');
      } else {
        throw new Error('Failed to logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      stopLoading(); // End loading
    }
  };

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

        {/* Notifications and User Dropdown */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          {/* <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="sr-only">Notifications</span>
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#9d2235] text-xs font-semibold text-white flex items-center justify-center">
              3
            </span>
          </Button> */}
          <NotificationButton />

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {!user ? (
                    <AvatarFallback>?</AvatarFallback>
                  ) : (
                    <>
                      <AvatarImage src={`/avatars/${user.id}.png`} alt={`${user.firstName} Avatar`} />
                      <AvatarFallback>{user.firstName.charAt(0).toUpperCase()}</AvatarFallback>
                    </>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                {!user ? (
                  <div className="flex flex-col space-y-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs leading-none text-gray-500">
                      {user.email}
                    </p>
                  </div>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/nurse/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/nurse/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4 text-red-500" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {isLoading && <IndeterminateProgressBar />}
    </header>
  );
};

const NotificationButton = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
        <Button variant="ghost" size="icon" onClick={togglePopup}>
            <Bell size={20} />
            <span className="sr-only">Notifications</span>
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#9d2235] text-xs font-semibold text-white flex items-center justify-center">
                3
            </span>
        </Button>
        {isOpen && <NotificationPopup />}
    </div>
  )
};

const NotificationPopup = () => {
  return (
      <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-4">
              <h3 className="font-bold">Notifications</h3>
              <ul>
                  <li>Notification 1</li>
                  <li>Notification 2</li>
                  <li>Notification 3</li>
              </ul>
          </div>
      </div>
  );
};


export default Topbar;
