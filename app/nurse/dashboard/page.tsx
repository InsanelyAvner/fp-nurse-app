// components/NurseDashboardComponent.tsx

"use client";

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import QuickStatCard from "@/components/QuickStatCard";
import JobCard from "@/components/JobCard";
import { Briefcase, ClipboardList, Clock, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Progress from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserContext } from "@/app/context/UserContext";

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

const NurseDashboardComponent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(60); // Example value
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [jobMatches, setJobMatches] = useState<Job[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [upcomingShifts, setUpcomingShifts] = useState<Shift[]>([]);

  // Use user from UserContext
  const { user } = useContext(UserContext);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch data from API routes when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch jobs, notifications, and shifts in parallel
        const [jobsResponse, notificationsResponse, shiftsResponse] =
          await Promise.all([
            fetch("/api/nurse/jobs", {
              method: "GET",
              credentials: "include",
            }),
            fetch("/api/nurse/notifications", {
              method: "GET",
              credentials: "include",
            }),
            fetch("/api/nurse/shifts", {
              method: "GET",
              credentials: "include",
            }),
          ]);

        if (
          !jobsResponse.ok ||
          !notificationsResponse.ok ||
          !shiftsResponse.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const [jobsData, notificationsData, shiftsData] = await Promise.all([
          jobsResponse.json(),
          notificationsResponse.json(),
          shiftsResponse.json(),
        ]);

        setJobMatches(jobsData);
        setNotifications(notificationsData);
        setUpcomingShifts(shiftsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleViewDetails = (jobId: number) => {
    router.push(`/nurse/jobs/${jobId}`);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        role="nurse"
      />

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
            {loading || !user ? (
              <Skeleton className="h-8 w-48 mb-4" />
            ) : (
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                Welcome back,{" "}
                <span className="text-[#9d2235]">{user.firstName}</span>!
              </h1>
            )}

            {/* Enhanced Profile Completion Prompt */}
            {!loading && profileCompletion < 100 && (
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
                      <h2 className="text-lg font-semibold mb-2">
                        Complete Your Profile
                      </h2>
                      <p className="text-sm">
                        Completing your profile helps us match you
                        with the best job opportunities!
                      </p>
                    </div>

                    {/* Button */}
                    <div className="mt-4 md:mt-0 md:ml-6 w-full md:w-auto">
                      <Button
                        variant="default"
                        className="w-full md:w-auto"
                        style={{ backgroundColor: "#fff", color: "#9d2235" }}
                        onClick={() => router.push("/nurse/profile")}
                      >
                        Complete Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {loading ? (
              // Loading Skeletons
              <div>
                {/* Quick Stats Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>

                {/* Job Matches Skeleton */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>
                      <Skeleton className="h-6 w-1/2" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[325px]">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Notifications and Upcoming Shifts Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <Skeleton className="h-6 w-1/2" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[200px]">
                        <Skeleton className="h-8 w-full mb-4" />
                        <Skeleton className="h-8 w-full mb-4" />
                        <Skeleton className="h-8 w-full mb-4" />
                      </ScrollArea>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <Skeleton className="h-6 w-1/2" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[200px]">
                        <Skeleton className="h-8 w-full mb-4" />
                        <Skeleton className="h-8 w-full mb-4" />
                        <Skeleton className="h-8 w-full mb-4" />
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              // Main Content
              <div>
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
                    value="2" // You can replace "2" with actual data when available
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
                    {jobMatches.length > 0 ? (
                      <ScrollArea className="h-[325px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {jobMatches.map((job) => (
                            <JobCard
                              key={job.id}
                              job={job}
                              onViewDetails={handleViewDetails}
                            />
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No job matches found.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Notifications and Upcoming Shifts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {notifications.length > 0 ? (
                        <ScrollArea className="h-[200px]">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className="mb-4 last:mb-0"
                            >
                              <p className="text-sm font-medium">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(
                                  notification.timestamp
                                ).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </ScrollArea>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No notifications.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Shifts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {upcomingShifts.length > 0 ? (
                        <ScrollArea className="h-[200px]">
                          {upcomingShifts.map((shift) => (
                            <div key={shift.id} className="mb-4 last:mb-0">
                              <p className="text-sm font-medium">
                                {shift.facility}
                              </p>
                              <p className="text-xs text-gray-500">
                                {shift.date} • {shift.time}
                              </p>
                            </div>
                          ))}
                        </ScrollArea>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No upcoming shifts.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NurseDashboardComponent;
