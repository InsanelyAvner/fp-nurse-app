// components/ViewApplicantsPageComponent.tsx
"use client";

import React, { useState, useEffect, useMemo, useContext } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  CheckCircle,
  XCircle,
  SortAsc,
  ChevronLeft,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoadingContext } from '@/app/context/LoadingContext'; // Import LoadingContext
import Spinner from '@/components/Spinner'; // Import Spinner
import ApplicantCard from "@/components/ApplicantCard";
import Link from 'next/link';

// Define Applicant interface
interface Applicant {
  id: number;
  name: string;
  email: string;
  profileImage: string;
  matchingScore: number;
  keySkills: string[];
  experience: number; // in years
  certifications: string[];
  bio: string;
}

// Define Job interface
interface Job {
  id: number;
  title: string;
  // Add other relevant fields if needed
}

// Sort Options Component (unchanged)
const SortOptions: React.FC<{
  sortOption: "score" | "experience";
  sortOrder: "asc" | "desc";
  setSortOption: React.Dispatch<
    React.SetStateAction<"score" | "experience">
  >;
  setSortOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
}> = ({ sortOption, sortOrder, setSortOption, setSortOrder }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" className="flex items-center text-sm px-3 py-1">
        <SortAsc className="mr-2 h-5 w-5" />
        Sort
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-60 p-4">
      <div className="space-y-4">
        <div>
          <p className="font-semibold mb-2 text-sm">Sort By:</p>
          <label className="flex items-center space-x-2 mb-1">
            <input
              type="radio"
              name="sortOption"
              value="score"
              checked={sortOption === "score"}
              onChange={() => setSortOption("score")}
            />
            <span className="text-sm">Matching Score</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="sortOption"
              value="experience"
              checked={sortOption === "experience"}
              onChange={() => setSortOption("experience")}
            />
            <span className="text-sm">Experience</span>
          </label>
        </div>
        <div>
          <p className="font-semibold mb-2 text-sm">Order:</p>
          <label className="flex items-center space-x-2 mb-1">
            <input
              type="radio"
              name="sortOrder"
              value="desc"
              checked={sortOrder === "desc"}
              onChange={() => setSortOrder("desc")}
            />
            <span className="text-sm">Descending</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="sortOrder"
              value="asc"
              checked={sortOrder === "asc"}
              onChange={() => setSortOrder("asc")}
            />
            <span className="text-sm">Ascending</span>
          </label>
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

// Applicant Row for Desktop View (unchanged)
const ApplicantRow: React.FC<{
  applicant: Applicant;
  onAccept: (applicant: Applicant) => void;
  onReject: (applicant: Applicant) => void;
  onViewProfile: (applicantId: number) => void;
}> = ({ applicant, onAccept, onReject, onViewProfile }) => (
  <TableRow
    className="hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
    onClick={() => onViewProfile(applicant.id)}
  >
    
    <TableCell className="px-4 py-2 whitespace-nowrap">
      <div className="flex items-center">
        <Avatar className="h-8 w-8">
          <AvatarImage src={applicant.profileImage} alt={applicant.name} />
          <AvatarFallback>
            {applicant.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <div className="text-sm font-medium text-gray-900">
            {applicant.name}
          </div>
          <div className="text-xs text-gray-500">{applicant.email}</div>
        </div>
      </div>
    </TableCell>
    <TableCell className="px-4 py-2 whitespace-nowrap w-1/12">
      <div className="text-sm text-gray-900">
        {applicant.experience}{" "}
        {applicant.experience === 1 ? "year" : "years"}
      </div>
    </TableCell>
    <TableCell className="px-4 py-2 whitespace-nowrap w-1/12">
      <div className="flex items-center">
        <Star className="mr-1 h-4 w-4 text-yellow-500" />
        <span className="text-sm text-gray-900">
          {applicant.matchingScore}%
        </span>
      </div>
    </TableCell>
    <TableCell className="px-4 py-2 whitespace-nowrap">
      <div className="flex flex-wrap gap-1">
        {applicant.keySkills.map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="text-[0.625rem] px-2 py-0.5"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </TableCell>
    <TableCell className="px-4 py-2 whitespace-nowrap text-center w-1/6">
      <div className="flex justify-center space-x-2">
        <Button
          size="sm"
          variant="success"
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click
            onAccept(applicant);
          }}
          className="flex items-center text-sm px-3 py-1"
        >
          <CheckCircle className="mr-1 h-4 w-4" />
          Accept
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click
            onReject(applicant);
          }}
          className="flex items-center text-sm px-3 py-1"
        >
          <XCircle className="mr-1 h-4 w-4" />
          Reject
        </Button>
      </div>
    </TableCell>
  </TableRow>
);

// Applicant Card for Mobile View (unchanged)

// Main Component
const ViewApplicantsPageComponent: React.FC = () => {
  const userRole: "admin" | "nurse" = "admin"; // Assume admin role for this page
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [sortOption, setSortOption] = useState<"score" | "experience">(
    "score"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const params = useParams(); // Assuming the job ID is part of the route

  // State for Confirmation Dialog
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(
    null
  );
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );

  // Access LoadingContext
  const { startLoading, stopLoading, isLoading } = useContext(LoadingContext);

  // State for Job Details
  const [job, setJob] = useState<Job | null>(null);
  const [isJobLoading, setIsJobLoading] = useState<boolean>(true);

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      startLoading(); // Start loading for job details
      try {
        const jobId = params?.id;
        if (!jobId) {
          toast.error("Job ID not found.");
          return;
        }

        const response = await fetch(`/api/jobs/${jobId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch job details.");
        }
        const data: Job = await response.json();
        setJob(data);
      } catch (error: any) {
        console.error("Error fetching job details:", error);
        toast.error(error.message || "Error fetching job details.");
      } finally {
        setIsJobLoading(false);
        stopLoading(); // Stop loading for job details
      }
    };

    fetchJobDetails();
  }, [params, startLoading, stopLoading]);

  // Fetch applicants from the API
  useEffect(() => {
    const fetchApplicants = async () => {
      startLoading(); // Start loading for applicants
      try {
        const jobId = params?.id;
        if (!jobId) {
          toast.error("Job ID not found.");
          return;
        }

        const response = await fetch(`/api/jobs/${jobId}/applicants`);
        if (!response.ok) {
          throw new Error("Failed to fetch applicants.");
        }
        const data: Applicant[] = await response.json();
        setApplicants(data);
      } catch (error: any) {
        console.error("Error fetching applicants:", error);
        toast.error(error.message || "Error fetching applicants.");
      } finally {
        stopLoading(); // Stop loading for applicants
      }
    };

    fetchApplicants();
  }, [params, startLoading, stopLoading]);

  // Sorting and Filtering logic with useMemo for optimization
  const sortedApplicants = useMemo(() => {
    return applicants
      .filter(
        (applicant) =>
          applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          applicant.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const key = sortOption === "score" ? "matchingScore" : "experience";
        if (sortOrder === "asc") {
          return a[key] - b[key];
        } else {
          return b[key] - a[key];
        }
      });
  }, [applicants, searchQuery, sortOption, sortOrder]);

  // Handlers for opening confirmation dialog
  const openConfirmDialog = (
    applicant: Applicant,
    type: "accept" | "reject"
  ) => {
    setSelectedApplicant(applicant);
    setActionType(type);
    setIsConfirmOpen(true);
  };

  // Handlers for accepting/rejecting applicants
  const handleConfirmAction = async () => {
    if (selectedApplicant && actionType) {
      startLoading(); // Start loading for action
      try {
        const jobId = params?.id;
        if (!jobId) {
          throw new Error("Job ID not found.");
        }

        const response = await fetch(
          `/api/jobs/${jobId}/applicants/${selectedApplicant.id}/action`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ action: actionType }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Action failed.");
        }

        // Update the applicants list locally
        setApplicants((prev) =>
          prev.filter((app) => app.id !== selectedApplicant.id)
        );

        // Show success toast
        toast.success(
          `${actionType === "accept" ? "Accepted" : "Rejected"} ${
            selectedApplicant.name
          }`
        );

        // Reset dialog state
        setIsConfirmOpen(false);
        setActionType(null);
        setSelectedApplicant(null);
      } catch (error: any) {
        console.error("Error performing action:", error);
        toast.error(error.message || "Error performing action.");
      } finally {
        stopLoading(); // Stop loading for action
      }
    }
  };

  const handleCancelAction = () => {
    setIsConfirmOpen(false);
    setActionType(null);
    setSelectedApplicant(null);
  };

  const handleViewProfile = (applicantId: number) => {
    // Navigate to applicant's full profile or open a modal
    router.push(`/admin/nurses/${applicantId}`);
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        role={userRole}
      />

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Topbar */}
        <Topbar toggleSidebar={toggleSidebar} role={userRole} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 relative">
          {/* Spinner Overlay */}
          {isLoading && <Spinner />}

          <div className="max-w-7xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4 sm:mb-6 flex items-center text-gray-600 hover:text-gray-800"
              aria-label="Back to Job Listings"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Job Listings
            </Button>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                {isJobLoading ? (
                  "Loading Job Details..."
                ) : job ? (
                  `Applicants for ${job.title}`
                ) : (
                  "Applicants"
                )}
              </h2>
              <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                {/* Search Input */}
                <Input
                  placeholder="Search applicants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 mb-2 sm:mb-0 text-sm"
                  aria-label="Search applicants"
                />
                {/* Sort Options */}
                <SortOptions
                  sortOption={sortOption}
                  sortOrder={sortOrder}
                  setSortOption={setSortOption}
                  setSortOrder={setSortOrder}
                />
              </div>
            </div>

            {/* Applicants List for Mobile */}
            <div className="sm:hidden">
              <div className="space-y-4">
                {sortedApplicants.length > 0 ? (
                  sortedApplicants.map((applicant) => (
                    <ApplicantCard
                      key={applicant.id}
                      applicant={applicant}
                      onAccept={() => openConfirmDialog(applicant, "accept")}
                      onReject={() => openConfirmDialog(applicant, "reject")}
                      onViewProfile={handleViewProfile}
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-500">
                    No applicants found.
                  </div>
                )}
                {/* Mobile Footer */}
                <div className="text-center text-sm text-gray-500 mt-4">
                  Showing {sortedApplicants.length}{" "}
                  {sortedApplicants.length === 1 ? "applicant" : "applicants"}
                </div>
              </div>
            </div>

            {/* Applicants Table for Desktop */}
            <div className="hidden sm:block">
              <div className="overflow-x-auto">
                <div className="max-w-5xl mx-auto overflow-hidden shadow rounded-lg">
                  <Table className="w-full divide-y divide-gray-200">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </TableHead>
                        <TableHead className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                          Experience
                        </TableHead>
                        <TableHead className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                          Matching Score
                        </TableHead>
                        <TableHead className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Key Skills
                        </TableHead>
                        <TableHead className="px-4 py-2 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white divide-y divide-gray-200">
                      {sortedApplicants.length > 0 ? (
                        sortedApplicants.map((applicant) => (
                          <ApplicantRow
                            key={applicant.id}
                            applicant={applicant}
                            onAccept={() => openConfirmDialog(applicant, "accept")}
                            onReject={() => openConfirmDialog(applicant, "reject")}
                            onViewProfile={handleViewProfile}
                          />
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="px-4 py-2 whitespace-nowrap text-center text-gray-500"
                          >
                            No applicants found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  {/* Table Footer */}
                  <div className="px-4 py-2 bg-gray-50 text-right text-sm text-gray-500">
                    Showing {sortedApplicants.length}{" "}
                    {sortedApplicants.length === 1 ? "applicant" : "applicants"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Confirmation Dialog */}
        <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {actionType === "accept"
                  ? "Accept Applicant"
                  : "Reject Applicant"}
              </DialogTitle>
              <DialogDescription>
                {selectedApplicant && (
                  <>
                    Are you sure you want to{" "}
                    {actionType === "accept" ? "accept" : "reject"}{" "}
                    <span className="font-semibold">
                      {selectedApplicant.name}
                    </span>
                    ?
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelAction} className="text-sm px-4 py-2">
                Cancel
              </Button>
              <Button
                className={cn(
                  actionType === "accept"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700",
                  "text-sm px-4 py-2"
                )}
                onClick={handleConfirmAction}
                aria-label={
                  actionType === "accept" ? "Confirm Accept" : "Confirm Reject"
                }
              >
                {actionType === "accept" ? "Accept" : "Reject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};

export default ViewApplicantsPageComponent;
