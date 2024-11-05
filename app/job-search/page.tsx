// JobSearchPageComponent.tsx

"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import JobCard from "@/components/JobCard";
import { Pagination } from "@/components/Pagination";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

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
}

const jobListings: Job[] = [
  {
    id: 1,
    title: "Registered Nurse - ICU",
    facility: "Farrer Park Hospital",
    date: "2023-10-15",
    time: "07:00 - 19:00",
    payRate: "$50/hour",
    urgent: true,
    requiredSkills: ["ICU", "Critical Care"],
    shiftType: "Day Shift",
    department: "Intensive Care Unit",
  },
  // Add more job listings...
];

const JobSearchPageComponent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShift, setSelectedShift] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 9;
  const router = useRouter();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Filter and search jobs
  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch = job.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesShift =
      selectedShift === "all" || job.shiftType === selectedShift;
    const matchesDepartment =
      selectedDepartment === "all" || job.department === selectedDepartment;
    return matchesSearch && matchesShift && matchesDepartment;
  });

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Define the onViewDetails function
  const onViewDetails = (jobId: number) => {
    router.push(`/jobs/${jobId}`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
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

        <main className="flex-1 overflow-y-auto">
          {/* Hero Section */}
          <div className="relative">
            <div className="absolute inset-0">
              <img
                src="/bg.png"
                alt="Job Search Banner"
                className="w-full h-[280px] md:h-[320px] lg:h-[360px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-stone-700 via-transparent opacity-50"></div>
            </div>

            {/* Hero Content */}
            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="pt-12 pb-24 md:pt-16 md:pb-10">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-2xl">
                  Discover Jobs
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mt-4 max-w-2xl">
                  Explore thousands of jobs that match your skills and
                  preferences.
                </p>
              </div>

              {/* Search Card - Positioned to overlap hero section */}
              <Card className="relative -mb-8 bg-white/95 backdrop-blur-lg shadow-lg mx-auto max-w-5xl">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Search Input */}
                    <div className="w-full">
                      <Label
                        htmlFor="search"
                        className="text-gray-700 font-semibold"
                      >
                        Search Jobs
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          id="search"
                          type="text"
                          placeholder="Search by job title..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pr-12"
                        />
                        <Search
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                      </div>
                    </div>

                    {/* Filters Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div>
                        <Label
                          htmlFor="shiftType"
                          className="text-gray-700 font-semibold"
                        >
                          Shift Type
                        </Label>
                        <Select
                          onValueChange={(value) => setSelectedShift(value)}
                          defaultValue="all"
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="All Shifts" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Shifts</SelectItem>
                            <SelectItem value="Day Shift">Day Shift</SelectItem>
                            <SelectItem value="Night Shift">
                              Night Shift
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label
                          htmlFor="department"
                          className="text-gray-700 font-semibold"
                        >
                          Department
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setSelectedDepartment(value)
                          }
                          defaultValue="all"
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="All Departments" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            <SelectItem value="Intensive Care Unit">
                              Intensive Care Unit
                            </SelectItem>
                            <SelectItem value="Emergency Room">
                              Emergency Room
                            </SelectItem>
                            <SelectItem value="Pediatrics">
                              Pediatrics
                            </SelectItem>
                            <SelectItem value="Surgical">Surgical</SelectItem>
                            <SelectItem value="Oncology">Oncology</SelectItem>
                            <SelectItem value="Geriatrics">
                              Geriatrics
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          onClick={() => {
                            setSearchQuery("");
                            setSelectedShift("all");
                            setSelectedDepartment("all");
                          }}
                          variant="outline"
                          className="w-full md:w-auto"
                        >
                          Reset Filters
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Job Listings Section */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {currentJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {currentJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onViewDetails={onViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <p className="text-2xl text-gray-600">No jobs found.</p>
                <p className="text-gray-500 mt-2">
                  Try adjusting your search or filters to find what you're
                  looking for.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobSearchPageComponent;
