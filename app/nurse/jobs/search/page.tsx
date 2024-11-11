// File: /components/JobSearchPageComponent.tsx

"use client";

import React, { useState, useCallback, useContext } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import JobCard from "@/components/JobCard";
import { Pagination } from "@/components/Pagination";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import useJobSearch, { Job } from "@/hooks/useJobSearch";

const JobSearchPageComponent: React.FC = () => {
  const JOBS_PER_PAGE = 100;
  const {
    searchQuery,
    setSearchQuery,
    selectedShift,
    setSelectedShift,
    selectedDepartment,
    setSelectedDepartment,
    selectedPayRate,
    setSelectedPayRate,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedJobs,
    isLoading,
    resetFilters,
  } = useJobSearch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);

  // Navigate to job details page
  const onViewDetails = useCallback(
    (jobId: number) => {
      router.push(`/nurse/jobs/${jobId}`);
    },
    [router]
  );

  // Handle Reset Filters with notification
  const handleResetFilters = useCallback(() => {
    resetFilters();
  }, [resetFilters]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} role="nurse" />

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
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
                src="/images/bg.png"
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
                  Explore thousands of jobs that match your skills and preferences.
                </p>
              </div>

              {/* Search Card - Positioned to overlap hero section */}
              <Card className="relative -mb-8 bg-white/95 backdrop-blur-lg shadow-lg mx-auto max-w-5xl">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Search Input */}
                    <div className="w-full">
                      <Label htmlFor="search" className="text-gray-700 font-semibold">
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      {/* Shift Type Filter */}
                      <div>
                        <Label htmlFor="shiftType" className="text-gray-700 font-semibold">
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
                            <SelectItem value="Day">Day Shift</SelectItem>
                            <SelectItem value="Night">Night Shift</SelectItem>
                            <SelectItem value="Swing">Swing Shift</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Department Filter */}
                      <div>
                        <Label htmlFor="department" className="text-gray-700 font-semibold">
                          Department
                        </Label>
                        <Select
                          onValueChange={(value) => setSelectedDepartment(value)}
                          defaultValue="all"
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="All Departments" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            <SelectItem value="Intensive Care">Intensive Care</SelectItem>
                            <SelectItem value="Emergency Room">Emergency Room</SelectItem>
                            <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="Surgery">Surgery</SelectItem>
                            <SelectItem value="Oncology">Oncology</SelectItem>
                            <SelectItem value="Geriatrics">Geriatrics</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Pay Rate Filter */}
                      <div>
                        <Label htmlFor="payRate" className="text-gray-700 font-semibold">
                          Pay Rate
                        </Label>
                        <Select
                          onValueChange={(value) => setSelectedPayRate(value)}
                          defaultValue="all"
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="All Pay Rates" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Pay Rates</SelectItem>
                            <SelectItem value="above$30/hr">Above $30/hr</SelectItem>
                            <SelectItem value="below$30/hr">Below $30/hr</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Reset Button */}
                      <div className="flex justify-end">
                        <Button
                          onClick={handleResetFilters}
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
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {Array.from({ length: JOBS_PER_PAGE }, (_, index) => (
                  <Card key={index} className="flex flex-col max-h-80 shadow-sm">
                    <CardContent>
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-4 mb-2" />
                      <Skeleton className="h-4 w-2/4 mb-2" />
                      <Skeleton className="h-4 w-1/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : paginatedJobs && paginatedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {paginatedJobs.map((job) => (
                  <JobCard key={job.id} job={job} onViewDetails={onViewDetails} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <p className="text-2xl text-gray-600">No jobs found.</p>
                <p className="text-gray-500 mt-2">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
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
