// app/admin/nurses/[id]/page.tsx
"use client";

import React, { useEffect, useState, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { LoadingContext } from "@/app/context/LoadingContext";
import { Skeleton } from "@/components/ui/skeleton";

// Define interfaces based on the updated API response
interface Skill {
  id: number;
  name: string;
}

interface Experience {
  id: number;
  facilityName: string;
  position: string;
  department: string;
  startDate: string | null;
  endDate: string | null;
  responsibilities: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dob: string | null;
  gender: string;
  contactNumber: string;
  postalCode: string;
  citizenship: string;
  race: string;
  role: string;
  specialization: string;
  availableWorkDays: string;
  frequencyOfWork: number;
  preferredFacilityType: string;
  availableWorkTiming: string;
  skills: Skill[];
  experiences: Experience[];
  createdAt: string;
  updatedAt: string;
}

const NurseProfilePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const nurseId = params.id as string;
  const userRole: "admin" | "nurse" = "admin"; // Assume admin role for this page
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Access LoadingContext
  const { isLoading, startLoading, stopLoading } = useContext(LoadingContext);

  const [nurse, setNurse] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch nurse data from the API route
  useEffect(() => {
    const fetchNurse = async () => {
      startLoading(); // Start loading
      setError(null);
      try {
        const response = await fetch(`/api/admin/nurses/${nurseId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch nurse data.");
        }
        const data: User = await response.json();
        setNurse(data);
      } catch (err: any) {
        console.error("Error fetching nurse:", err);
        setError(err.message || "An unexpected error occurred.");
        toast.error(err.message || "An unexpected error occurred.");
      } finally {
        stopLoading(); // Stop loading
      }
    };

    if (nurseId) {
      fetchNurse();
    }
  }, [nurseId, startLoading, stopLoading]);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} role={userRole} />

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
            onClick={toggleSidebar}
            aria-hidden="true"
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Topbar */}
          <Topbar toggleSidebar={toggleSidebar} role={userRole} />

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 animate-pulse">
            <div className="max-w-5xl mx-auto bg-white shadow rounded-lg p-6">
              {/* Back Button Skeleton */}
              <div className="mb-6 flex items-center space-x-2">
                <Skeleton className="h-10 w-24 rounded" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>

              {/* Header Skeleton */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <div className="ml-6 flex-1">
                    <Skeleton className="h-6 w-48 rounded mb-2" />
                    <Skeleton className="h-4 w-64 rounded" />
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-2">
                  <Skeleton className="h-10 w-32 rounded" />
                  <Skeleton className="h-10 w-32 rounded" />
                </div>
              </div>

              {/* Skills Skeleton */}
              <section className="mb-8">
                <Skeleton className="h-6 w-56 rounded mb-4" />
                <div className="flex flex-wrap gap-2 mt-1">
                  <Skeleton className="h-6 w-20 rounded" />
                  <Skeleton className="h-6 w-20 rounded" />
                  {/* Repeat as needed */}
                </div>
              </section>

              {/* Work Experiences Skeleton */}
              <section className="mb-8">
                <Skeleton className="h-6 w-56 rounded mb-4" />
                <div className="space-y-6">
                  <div className="p-4 border rounded-lg shadow-sm">
                    <Skeleton className="h-5 w-64 rounded mb-2" />
                    <Skeleton className="h-4 w-48 rounded mb-2" />
                    <Skeleton className="h-4 w-full rounded" />
                  </div>
                  <div className="p-4 border rounded-lg shadow-sm">
                    <Skeleton className="h-5 w-64 rounded mb-2" />
                    <Skeleton className="h-4 w-48 rounded mb-2" />
                    <Skeleton className="h-4 w-full rounded" />
                  </div>
                  {/* Repeat as needed */}
                </div>
              </section>

              {/* Additional Actions Skeleton */}
              <div className="flex justify-end space-x-4">
                <Skeleton className="h-10 w-32 rounded" />
                <Skeleton className="h-10 w-32 rounded" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Error State
  if (error && !isLoading) {
    return (
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} role={userRole} />

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
            onClick={toggleSidebar}
            aria-hidden="true"
          ></div>
        )}

        <div className="flex-1 flex flex-col">
          <Topbar toggleSidebar={toggleSidebar} role={userRole} />
          <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error || "Nurse not found."}</p>
              <Button
                onClick={() => router.back()}
                className="flex items-center justify-center"
                aria-label="Back to Nurses List"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Nurses List
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Render nurse profile
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} role={userRole} />

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar toggleSidebar={toggleSidebar} role={userRole} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-5xl mx-auto bg-white shadow rounded-lg p-6">
            {/* Back Button */}
            <Button
              variant="ghost"
              className="mb-6 flex items-center text-gray-600 hover:text-gray-800"
              onClick={() => router.back()}
              aria-label="Back to Nurses List"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Nurses List
            </Button>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex items-center">
                <Avatar className="h-24 w-24">
                  {nurse ? (
                    nurse.firstName && nurse.lastName ? (
                      <AvatarImage
                        src={`https://api.dicebear.com/9.x/initials/svg?scale=70&seed=${encodeURIComponent(
                          nurse.firstName + " " + nurse.lastName
                        )}`}
                        alt={`${nurse.firstName} ${nurse.lastName}`}
                      />
                    ) : (
                      <AvatarFallback>
                        {nurse.firstName ? nurse.firstName.charAt(0).toUpperCase() : "N"}
                        {nurse.lastName ? nurse.lastName.charAt(0).toUpperCase() : "A"}
                      </AvatarFallback>
                    )
                  ) : (
                    <AvatarFallback>NA</AvatarFallback>
                  )}
                </Avatar>
                <div className="ml-6">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {nurse?.firstName} {nurse?.lastName}
                  </h1>
                  <p className="text-gray-500">{nurse?.email}</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {nurse?.dob && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                    <p className="text-gray-800">{new Date(nurse.dob).toLocaleDateString()}</p>
                  </div>
                )}
                {nurse?.gender && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Gender</p>
                    <p className="text-gray-800">{nurse.gender}</p>
                  </div>
                )}
                {nurse?.contactNumber && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Contact Number</p>
                    <p className="text-gray-800">{nurse.contactNumber}</p>
                  </div>
                )}
                {nurse?.postalCode && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Postal Code</p>
                    <p className="text-gray-800">{nurse.postalCode}</p>
                  </div>
                )}
                {nurse?.citizenship && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Citizenship</p>
                    <p className="text-gray-800">{nurse.citizenship}</p>
                  </div>
                )}
                {nurse?.race && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Race</p>
                    <p className="text-gray-800">{nurse.race}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Professional Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Professional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {nurse?.specialization && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Specialization</p>
                    <p className="text-gray-800">{nurse.specialization.replace(/_/g, " ")}</p>
                  </div>
                )}
                {nurse?.availableWorkDays && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available Work Days</p>
                    <p className="text-gray-800">{nurse.availableWorkDays}</p>
                  </div>
                )}
                {nurse?.frequencyOfWork !== undefined && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Frequency of Work</p>
                    <p className="text-gray-800">{nurse.frequencyOfWork} times/week</p>
                  </div>
                )}
                {nurse?.preferredFacilityType && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Preferred Facility Type</p>
                    <p className="text-gray-800">{nurse.preferredFacilityType}</p>
                  </div>
                )}
                {nurse?.availableWorkTiming && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available Work Timing</p>
                    <p className="text-gray-800">{nurse.availableWorkTiming}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Skills */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {nurse && nurse.skills.length > 0 ? (
                  nurse.skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="text-sm">
                      {skill.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500">No skills listed.</span>
                )}
              </div>
            </section>

            {/* Work Experiences */}
            {nurse && nurse.experiences.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Work Experience</h2>
                <div className="space-y-6">
                  {nurse.experiences.map((exp) => (
                    <div key={exp.id} className="p-4 border rounded-lg shadow-sm">
                      <h3 className="text-xl font-medium text-gray-800">
                        {exp.position} at {exp.facilityName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : "N/A"} -{" "}
                        {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
                      </p>
                      <p className="mt-2 text-gray-800">{exp.responsibilities}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};


export default NurseProfilePage;
