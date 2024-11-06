// JobDetailsPageComponent.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, DollarSign, MapPin, Briefcase, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

interface Job {
  id: number;
  title: string;
  facility: string;
  date: string;
  time: string;
  payRate: string;
  urgent: boolean;
  requiredSkills: string[];
  shiftType: string;
  department: string;
  description: string;
  responsibilities: string[];
  facilityInfo: {
    name: string;
    address: string;
    image: string;
  };
}

const JobDetailsPageComponent: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/jobs/${id}`);
        if (response.ok) {
          const jobData: Job = await response.json();
          setJob(jobData);
        } else {
          setJob(null);
        }
      } catch (error) {
        console.error("Failed to fetch job listing:", error);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  const toggleSidebar = () => {
    // Implement toggle logic if necessary
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={false} toggleSidebar={toggleSidebar} role="nurse" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar toggleSidebar={toggleSidebar} role="nurse" />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.push('/nurse/jobs/search')}
              className="mb-6 flex items-center text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Job Listings
            </Button>

            {/* Conditional rendering for loading, job not found, or job details */}
            {loading ? (
              <Card className="shadow-lg rounded-lg overflow-hidden">
                <CardHeader className="p-6">
                  <Skeleton className="h-10 w-1/2 mb-4" />
                  <Skeleton className="h-6 w-1/3" />
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                </CardContent>
              </Card>
            ) : job ? (
              <Card className="shadow-lg rounded-lg overflow-hidden">
                <div className="relative h-56 md:h-36">
                  <Image
                    src="/images/bg.png"
                    alt={job.facilityInfo.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 transform hover:scale-105"
                  />
                  {job.urgent && (
                    <Badge variant="destructive" className="absolute top-4 left-4">
                      Urgent
                    </Badge>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-800">{job.title}</CardTitle>
                      <p className="text-gray-600 mt-1">{job.facility}</p>
                    </div>
                    {job.urgent && <Badge variant="destructive" className="mt-4 md:mt-0">Urgent Hiring</Badge>}
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span className="font-medium">Date:&nbsp;</span> {job.date}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-2" />
                      <span className="font-medium">Time:&nbsp;</span> {job.time}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="h-5 w-5 mr-2" />
                      <span className="font-medium">Shift Type:&nbsp;</span> {job.shiftType}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-5 w-5 mr-2" />
                      <span className="font-medium">Pay Rate:&nbsp;</span> {job.payRate}
                    </div>
                    <div className="flex items-start text-gray-600">
                      <MapPin className="h-5 w-5 mr-2 mt-1" />
                      <div>
                        <span className="font-medium">Location:&nbsp;</span>
                        <p>{job.facilityInfo.address == '' ? "Farrer Park Hospital" : job.facilityInfo.address }</p>
                      </div>
                    </div>
                    <div className="flex items-start text-gray-600">
                      <Briefcase className="h-5 w-5 mr-2 mt-1" />
                      <div>
                        <span className="font-medium">Department:&nbsp;</span>
                        <p>{job.department}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Job Description</h3>
                    <p className="text-gray-700">{job.description}</p>
                  </div>

                  {/* <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Responsibilities</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {job.responsibilities.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div> */}

                  <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Required Skills & Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button className="w-full md:w-auto bg-[#9d2235] hover:bg-[#7a172f] text-white">Apply Now</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <p className="text-2xl text-gray-600">Job not found.</p>
                <p className="text-gray-500 mt-2">Try checking the job ID or returning to the job listings.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobDetailsPageComponent;