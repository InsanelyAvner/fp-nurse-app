// JobDetailsPageComponent.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Briefcase,
  ChevronLeft,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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

const jobListings: Job[] = [
  // Sample job data
  {
    id: 1,
    title: 'Registered Nurse - ICU',
    facility: 'Farrer Park Hospital',
    date: '2023-10-15',
    time: '07:00 - 19:00',
    payRate: '$50/hour',
    urgent: true,
    requiredSkills: ['ICU', 'Critical Care'],
    shiftType: 'Day Shift',
    department: 'Intensive Care Unit',
    description:
      'We are seeking a dedicated ICU Registered Nurse to join our team. The ideal candidate will have experience in critical care and be able to provide high-quality patient care.',
    responsibilities: [
      'Monitor patient vital signs',
      'Administer medications',
      'Collaborate with the healthcare team',
      'Provide emotional support to patients and families',
      'Maintain accurate patient records',
    ],
    facilityInfo: {
      name: 'Farrer Park Hospital',
      address: '1 Farrer Park Station Rd, Singapore 217562',
      image: '/images/farrer-park-hospital.jpg', // Ensure this image exists in the public/images directory
    },
  },
  // Add more job listings...
];

const JobDetailsPageComponent: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [job, setJob] = useState<Job | undefined>();

  useEffect(() => {
    // Fetch job data based on ID
    // For now, we'll use the sample data
    const jobData = jobListings.find((job) => job.id === parseInt(id as string));
    setJob(jobData);
  }, [id]);

  if (!job) {
    // Handle job not found
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl text-gray-600">Job not found.</p>
      </div>
    );
  }

  const toggleSidebar = () => {
    // Implement toggle logic if necessary
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={false}
        toggleSidebar={toggleSidebar}
        role="nurse"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar toggleSidebar={toggleSidebar} role="nurse" />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6 flex items-center text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Job Listings
            </Button>

            {/* Job Details Card */}
            <Card className="shadow-lg rounded-lg overflow-hidden">
              {/* Facility Image */}
              <div className="relative h-56 md:h-36">
                <Image
                  src="/bg.png"
                  alt={job.facilityInfo.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 transform hover:scale-105"
                />
                {job.urgent && (
                  <Badge
                    variant="destructive"
                    className="absolute top-4 left-4"
                  >
                    Urgent
                  </Badge>
                )}
              </div>

              <CardContent className="p-6">
                {/* Job Title and Facility */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      {job.title}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">{job.facility}</p>
                  </div>
                  {job.urgent && (
                    <Badge variant="destructive" className="mt-4 md:mt-0">
                      Urgent Hiring
                    </Badge>
                  )}
                </div>

                {/* Job Details */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span className="font-medium">Date:</span> {job.date}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span className="font-medium">Time:</span> {job.time}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="h-5 w-5 mr-2" />
                    <span className="font-medium">Shift Type:</span>{' '}
                    {job.shiftType}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-5 w-5 mr-2" />
                    <span className="font-medium">Pay Rate:</span> {job.payRate}
                  </div>
                  <div className="flex items-start text-gray-600">
                    <MapPin className="h-5 w-5 mr-2 mt-1" />
                    <div>
                      <span className="font-medium">Location:</span>
                      <p>{job.facilityInfo.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start text-gray-600">
                    <Briefcase className="h-5 w-5 mr-2 mt-1" />
                    <div>
                      <span className="font-medium">Department:</span>
                      <p>{job.department}</p>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Job Description
                  </h3>
                  <p className="text-gray-700">{job.description}</p>
                </div>

                {/* Responsibilities */}
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Responsibilities
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {job.responsibilities.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Required Skills */}
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Required Skills & Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <div className="mt-8">
                  <Button className="w-full md:w-auto bg-[#9d2235] hover:bg-[#7a172f] text-white">
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobDetailsPageComponent;
