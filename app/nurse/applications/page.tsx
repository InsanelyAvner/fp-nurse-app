// pages/nurse/applications.tsx

'use client';

import React, { useState, useEffect, useContext } from 'react';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import ApplicationCard from '@/components/ApplicationCard';
import { useRouter } from 'next/navigation';
import { LoadingContext } from '@/app/context/LoadingContext';
import { Skeleton } from '@/components/ui/skeleton'; // Optional: For skeleton loaders

const MyApplications: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const router = useRouter();

  const { isLoading, startLoading, stopLoading } = useContext(LoadingContext);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchApplications = async () => {
      startLoading(); // Start loading

      try {
        const response = await fetch('/api/nurse/applications', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch applications');
        }
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setApplications([]); // Optionally, set to empty array on error
      } finally {
        stopLoading(); // End loading
      }
    };

    fetchApplications();
  }, [startLoading, stopLoading]);

  const handleViewDetails = async (jobId: number) => {
    try {
      await router.push(`/nurse/jobs/${jobId}`);
      // Note: In Next.js App Router, router.push() is async and can be awaited
      // The new page should handle its own loading state
    } catch (error) {
      console.error('Navigation error:', error);
      stopLoading(); // Stop loading in case of error
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        role="nurse"
      />
      <div className="flex-1 flex flex-col">
        <Topbar role="nurse" toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            My Applications
          </h1>
          {isLoading ? (
            // Optional: Display skeleton loaders while loading
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 mb-2" />
                  <Skeleton className="h-4 w-2/4" />
                </div>
              ))}
            </div>
          ) : applications.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {applications.map((application: any) => (
                <ApplicationCard
                  key={application.id}
                  job={application}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-600 text-lg">
                You haven't applied to any jobs yet.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyApplications;
