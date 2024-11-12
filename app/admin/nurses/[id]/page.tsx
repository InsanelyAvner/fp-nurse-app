// app/admin/nurses/[id]/page.tsx
"use client";

import React, { useEffect, useState, useContext } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { LoadingContext } from "@/app/context/LoadingContext"; // Import LoadingContext
import { Skeleton } from "@/components/ui/skeleton";

// Define interfaces based on Prisma schema
interface Document {
  id: number;
  type: string;
  fileUrl: string;
  uploadedAt: string;
}

interface Experience {
  id: number;
  position: string;
  facilityName: string;
  startDate: string | null;
  endDate: string | null;
  responsibilities: string;
}

interface Skill {
  id: number;
  name: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  address: string;
  dob: string | null;
  gender: string;
  yearsOfExperience: number | null;
  education: string | null;
  specializations: string[];
  languages: string[];
  shiftPreferences: string[];
  skills: Skill[];
  experiences: Experience[];
  documents: Document[];
  certifications: string[];
  bio: string | null;
  profilePictureUrl: string | null;
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
        const response = await fetch(`/api/admin/nurses/${nurseId}`);
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

    fetchNurse();
  }, [nurseId, startLoading, stopLoading]);

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

              {/* Personal Information Skeleton */}
              <section className="mb-8">
                <Skeleton className="h-6 w-40 rounded mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Skeleton className="h-4 w-32 rounded mb-1" />
                    <Skeleton className="h-4 w-48 rounded" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-32 rounded mb-1" />
                    <Skeleton className="h-4 w-48 rounded" />
                  </div>
                  {/* Repeat for other personal info fields */}
                </div>
              </section>

              {/* Professional Information Skeleton */}
              <section className="mb-8">
                <Skeleton className="h-6 w-56 rounded mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Skeleton className="h-4 w-40 rounded mb-1" />
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Skeleton className="h-6 w-20 rounded" />
                      <Skeleton className="h-6 w-20 rounded" />
                      {/* Repeat as needed */}
                    </div>
                  </div>
                  {/* Repeat for other professional info fields */}
                </div>
              </section>

              {/* Certifications Skeleton */}
              <section className="mb-8">
                <Skeleton className="h-6 w-40 rounded mb-4" />
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <Skeleton className="h-4 w-3/4 rounded" />
                  </li>
                  <li>
                    <Skeleton className="h-4 w-3/4 rounded" />
                  </li>
                  {/* Repeat as needed */}
                </ul>
              </section>

              {/* Bio Skeleton */}
              <section className="mb-8">
                <Skeleton className="h-6 w-20 rounded mb-4" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded mt-2" />
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

              {/* Documents Skeleton */}
              <section className="mb-8">
                <Skeleton className="h-6 w-40 rounded mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
                    <div>
                      <Skeleton className="h-4 w-32 rounded mb-1" />
                      <Skeleton className="h-3 w-24 rounded" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded" />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
                    <div>
                      <Skeleton className="h-4 w-32 rounded mb-1" />
                      <Skeleton className="h-3 w-24 rounded" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded" />
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

  // Render error state
  if (!nurse && !isLoading) {
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
          {/* <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error || "Nurse not found."}</p>
              <Button onClick={() => router.back()} className="flex items-center">
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Nurses List
              </Button>
            </div>
          </main> */}
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
              aria-label="Back to Applicant List"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Applicant List
            </Button>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex items-center">
                <Avatar className="h-24 w-24">
                  {nurse && nurse.profilePictureUrl ? (
                    <AvatarImage
                      src={nurse.profilePictureUrl}
                      alt={`${nurse.firstName} ${nurse.lastName}`}
                    />
                  ) : (
                    <AvatarFallback>
                      {nurse ? nurse.firstName[0] : ""}
                      {nurse ? nurse.lastName[0] : ""}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="ml-6">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {nurse?.firstName} {nurse?.lastName}
                  </h1>
                  <p className="text-gray-500">{nurse?.email}</p>
                </div>
              </div>
              {/* Action Buttons (Optional) */}
              <div className="mt-4 sm:mt-0 flex space-x-2">
                {/* Example: Edit Profile Button */}
                {/* <Button variant="primary">Edit Profile</Button> */}
              </div>
            </div>

            {/* Personal Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contact Number</p>
                  <p className="text-gray-800">{nurse?.contactNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Address</p>
                  <p className="text-gray-800">{nurse?.address}</p>
                </div>
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
                {nurse?.yearsOfExperience !== null && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Years of Experience</p>
                    <p className="text-gray-800">{nurse?.yearsOfExperience} years</p>
                  </div>
                )}
                {nurse?.education && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Education</p>
                    <p className="text-gray-800">{nurse.education}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Professional Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Professional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600">Specializations</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {nurse && nurse.specializations.length > 0 ? (
                      nurse.specializations.map((spec, idx) => (
                        <Badge key={idx} variant="secondary" className="text-sm">
                          {spec}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Languages</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {nurse && nurse.languages.length > 0 ? (
                      nurse.languages.map((lang, idx) => (
                        <Badge key={idx} variant="secondary" className="text-sm">
                          {lang}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Shift Preferences</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {nurse && nurse.shiftPreferences.length > 0 ? (
                      nurse.shiftPreferences.map((shift, idx) => (
                        <Badge key={idx} variant="secondary" className="text-sm">
                          {shift}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Skills</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {nurse && nurse.skills.length > 0 ? (
                      nurse.skills.map((skill) => (
                        <Badge key={skill.id} variant="secondary" className="text-sm">
                          {skill.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Certifications */}
            {nurse && nurse.certifications.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Certifications</h2>
                <ul className="list-disc list-inside">
                  {nurse.certifications.map((cert, idx) => (
                    <li key={idx} className="text-gray-800">
                      {cert}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Bio */}
            {nurse && nurse.bio && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Bio</h2>
                <p className="text-gray-800">{nurse.bio}</p>
              </section>
            )}

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

            {/* Documents */}
            {nurse && nurse.documents.length > 0 && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Documents</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {nurse.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:underline"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Bio (Duplicate Section - Optional) */}
            {/* If you intended to have another Bio section, ensure it's necessary. Otherwise, you can remove it. */}
            {/* {nurse.bio && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Bio</h2>
                <p className="text-gray-800">{nurse.bio}</p>
              </section>
            )} */}

            {/* Additional Actions */}
            <div className="flex justify-end space-x-4">
              {/* Example: Edit Profile Button */}
              {/* <Button variant="primary">Edit Profile</Button> */}
              {/* Example: Delete Profile Button */}
              {/* <Button variant="destructive">Delete Profile</Button> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NurseProfilePage;
