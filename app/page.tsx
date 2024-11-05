// NurseDashboardComponent.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import QuickStatCard from '@/components/QuickStatCard';
import JobCard from '@/components/JobCard';
import { Briefcase, ClipboardList, Clock, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Progress from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface Job {
  id: number;
  title: string;
  facility: string;
  date: string;
  time: string;
  payRate: string;
  urgent: boolean;
  requiredSkills: string[];
  matchingScore: number;
}

interface Notification {
  id: number;
  message: string;
  timestamp: string;
}

interface Shift {
  id: number;
  facility: string;
  date: string;
  time: string;
}

const jobMatches: Job[] = [
  {
    id: 1,
    title: "ICU Nurse",
    facility: "Farrer Park Hospital",
    date: "2023-06-15",
    time: "7:00 AM - 7:00 PM",
    payRate: "$45/hr",
    urgent: true,
    matchingScore: 92,
    requiredSkills: ["Critical Care", "Advanced Life Support", "test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8", "test9", "test10", "test11", "test12", "test13", "test14"],
    // This is for testing how it reacts to long elements.
  },
  {
    id: 2,
    title: "ER Nurse",
    facility: "Farrer Park Hospital",
    date: "2023-06-16",
    time: "8:00 AM - 8:00 PM",
    payRate: "$50/hr",
    urgent: false,
    matchingScore: 85,
    requiredSkills: ["Emergency Care", "Triage"],
  },
  {
    id: 3,
    title: "Pediatric Nurse",
    facility: "Farrer Park Hospital",
    date: "2023-06-17",
    time: "9:00 AM - 5:00 PM",
    payRate: "$40/hr",
    urgent: true,
    matchingScore: 78,
    requiredSkills: ["Childcare", "Pediatric Advanced Life Support"],
  },
  {
    id: 4,
    title: "Surgical Nurse",
    facility: "Farrer Park Hospital",
    date: "2023-06-18",
    time: "6:00 AM - 2:00 PM",
    payRate: "$55/hr",
    urgent: false,
    matchingScore: 88,
    requiredSkills: ["Operating Room", "Sterile Techniques"],
  },
];

const notifications: Notification[] = [
  {
    id: 1,
    message: "New job match: ICU Nurse at Farrer Park Hospital",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    message: "Your application for ER Nurse position has been viewed",
    timestamp: "1 day ago",
  },
  {
    id: 3,
    message: "Reminder: Upcoming shift tomorrow at 8:00 AM",
    timestamp: "3 hours ago",
  },
];

const upcomingShifts: Shift[] = [
  {
    id: 1,
    facility: "Farrer Park Hospital",
    date: "2023-06-15",
    time: "7:00 AM - 7:00 PM",
  },
  {
    id: 2,
    facility: "Farrer Park Hospital",
    date: "2023-06-18",
    time: "8:00 AM - 8:00 PM",
  },
];

const NurseDashboardComponent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(60); // Example value
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleViewDetails = (jobId: number) => {
    // Navigate to the job details page
    router.push(`/jobs/${jobId}`);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} role="nurse" />

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar toggleSidebar={toggleSidebar} role="nurse" />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Message */}
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Welcome back, <span className="text-[#9d2235]">Sarah</span>!
            </h1>

            {/* Enhanced Profile Completion Prompt */}
            {profileCompletion < 100 && (
              <div className="mb-6">
                <Card className="bg-[#9d2235] text-white">
                  <CardContent className="flex flex-col md:flex-row md:items-center p-6">
                    {/* Icon */}
                    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                      <Lightbulb size={48} />
                    </div>

                    {/* Text and Button Wrapper */}
                    <div className="flex-1">
                      {/* Text Content */}
                      <h2 className="text-lg font-semibold mb-2">Complete Your Profile</h2>
                      <p className="text-sm mb-4">
                        Your profile is <strong>{profileCompletion}%</strong> complete. Completing
                        your profile helps us match you with the best job opportunities!
                      </p>
                      <Progress
                        value={profileCompletion}
                        accentColor="#fff"
                        trackColor="rgba(255,255,255,0.3)"
                      />
                    </div>

                    {/* Button */}
                    <div className="mt-4 md:mt-0 md:ml-6 w-full md:w-auto">
                      <Button
                        variant="default"
                        className="w-full md:w-auto"
                        style={{ backgroundColor: '#fff', color: '#9d2235' }}
                        onClick={() => router.push('/profile')}
                      >
                        Complete Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <QuickStatCard
                icon={<Briefcase size={24} color="#9d2235" />}
                title="New Job Matches"
                value={jobMatches.length.toString()}
                accentColor="#9d2235"
              />
              <QuickStatCard
                icon={<ClipboardList size={24} color="#9d2235" />}
                title="Pending Applications"
                value="2"
                accentColor="#9d2235"
              />
              <QuickStatCard
                icon={<Clock size={24} color="#9d2235" />}
                title="Upcoming Shifts"
                value={upcomingShifts.length.toString()}
                accentColor="#9d2235"
              />
            </div>

            {/* Job Matches */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Recommended Jobs for You</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[325px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobMatches.map((job) => (
                      <JobCard key={job.id} job={job} onViewDetails={handleViewDetails} />
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
                        <p className="text-xs text-grays-500">
                          {shift.date} • {shift.time}
                        </p>
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
  );
};

export default NurseDashboardComponent;
