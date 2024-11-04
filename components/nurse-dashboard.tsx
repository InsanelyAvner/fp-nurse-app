'use client'

import React, { useState } from 'react'
import { Bell, Briefcase, Calendar, ChevronRight, ClipboardList, Clock, FileText, Home, LogOut, Mail, MessageSquare, Search, Settings, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

const jobMatches = [
  { id: 1, title: "ICU Nurse", facility: "Central Hospital", location: "Downtown", date: "2023-06-15", time: "7:00 AM - 7:00 PM", payRate: "$45/hr", urgent: true },
  { id: 2, title: "ER Nurse", facility: "City Medical Center", location: "Uptown", date: "2023-06-16", time: "8:00 AM - 8:00 PM", payRate: "$50/hr", urgent: false },
  { id: 3, title: "Pediatric Nurse", facility: "Children's Hospital", location: "Midtown", date: "2023-06-17", time: "9:00 AM - 5:00 PM", payRate: "$40/hr", urgent: true },
  { id: 4, title: "Surgical Nurse", facility: "University Hospital", location: "East Side", date: "2023-06-18", time: "6:00 AM - 2:00 PM", payRate: "$55/hr", urgent: false },
]

const notifications = [
  { id: 1, message: "New job match: ICU Nurse at Central Hospital", timestamp: "2 hours ago" },
  { id: 2, message: "Your application for ER Nurse position has been viewed", timestamp: "1 day ago" },
  { id: 3, message: "Reminder: Upcoming shift tomorrow at 8:00 AM", timestamp: "3 hours ago" },
]

const upcomingShifts = [
  { id: 1, facility: "Central Hospital", date: "2023-06-15", time: "7:00 AM - 7:00 PM" },
  { id: 2, facility: "City Medical Center", date: "2023-06-18", time: "8:00 AM - 8:00 PM" },
]

export function NurseDashboardComponent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white shadow-md transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4">
          <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
        </div>
        <nav className="mt-8">
          <NavItem icon={<Home size={20} />} label="Dashboard" isOpen={isSidebarOpen} isActive />
          <NavItem icon={<Briefcase size={20} />} label="Job Matches" isOpen={isSidebarOpen} />
          <NavItem icon={<Search size={20} />} label="Job Search" isOpen={isSidebarOpen} />
          <NavItem icon={<ClipboardList size={20} />} label="My Applications" isOpen={isSidebarOpen} />
          <NavItem icon={<Calendar size={20} />} label="Schedule" isOpen={isSidebarOpen} />
          <NavItem icon={<MessageSquare size={20} />} label="Messages" isOpen={isSidebarOpen} />
          <NavItem icon={<User size={20} />} label="Profile" isOpen={isSidebarOpen} />
          <NavItem icon={<Settings size={20} />} label="Settings" isOpen={isSidebarOpen} />
          <NavItem icon={<FileText size={20} />} label="Support" isOpen={isSidebarOpen} />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="mr-2">
                  <Bell size={20} />
                  <span className="sr-only">Notifications</span>
                  <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-[#9d2235] text-[10px] font-medium text-white flex items-center justify-center">3</span>
                </Button>
                <Button variant="ghost" size="icon" className="mr-4">
                  <Mail size={20} />
                  <span className="sr-only">Messages</span>
                  <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-[#9d2235] text-[10px] font-medium text-white flex items-center justify-center">2</span>
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
                        <p className="text-sm font-medium leading-none">Sarah Johnson</p>
                        <p className="text-xs leading-none text-muted-foreground">sarah.johnson@example.com</p>
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
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Welcome back, Sarah!</h1>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <QuickStatCard icon={<Briefcase size={24} />} title="New Job Matches" value="5" />
              <QuickStatCard icon={<ClipboardList size={24} />} title="Pending Applications" value="2" />
              <QuickStatCard icon={<Clock size={24} />} title="Upcoming Shifts" value="3" />
            </div>

            {/* Job Matches */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Recommended Jobs for You</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobMatches.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Notifications and Upcoming Shifts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="mb-4 last:mb-0">
                        <p className="text-sm font-medium">{notification.message}</p>
                        <p className="text-xs text-gray-500">{notification.timestamp}</p>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Shifts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    {upcomingShifts.map((shift) => (
                      <div key={shift.id} className="mb-4 last:mb-0">
                        <p className="text-sm font-medium">{shift.facility}</p>
                        <p className="text-xs text-gray-500">{shift.date} • {shift.time}</p>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function NavItem({ icon, label, isOpen, isActive = false }) {
  return (
    <a
      href="#"
      className={`flex items-center py-2 px-4 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg ${
        isActive ? 'bg-gray-100 text-gray-900' : ''
      }`}
    >
      {icon}
      {isOpen && <span className="ml-3">{label}</span>}
    </a>
  )
}

function QuickStatCard({ icon, title, value }) {
  return (
    <Card>
      <CardContent className="flex items-center p-6">
        <div className="rounded-full p-3 bg-[#9d2235] bg-opacity-10 mr-4">{icon}</div>
        <div>
          <CardDescription>{title}</CardDescription>
          <CardTitle>{value}</CardTitle>
        </div>
      </CardContent>
    </Card>
  )
}

function JobCard({ job }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{job.title}</CardTitle>
        <CardDescription>{job.facility}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2"><Clock size={16} className="inline mr-1" /> {job.date} • {job.time}</p>
        <p className="text-sm mb-2"><MapPin size={16} className="inline mr-1" /> {job.location}</p>
        <p className="text-sm font-semibold mb-4">{job.payRate}</p>
        {job.urgent && (
          <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
            Urgent
          </span>
        )}
        <Button className="w-full mt-2">View Details</Button>
      </CardContent>
    </Card>
  )
}