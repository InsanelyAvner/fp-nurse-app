// pages/nurse/applications.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import ApplicationCard from '@/components/ApplicationCard';
import { useRouter } from 'next/navigation';

const MyApplications: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // Fetch nurse's applications from the API
    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/nurse/applications', {
          credentials: 'include',
        });
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, []);

  const handleViewDetails = (jobId: number) => {
    router.push(`/nurse/jobs/${jobId}`);
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
          {applications.length > 0 ? (
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