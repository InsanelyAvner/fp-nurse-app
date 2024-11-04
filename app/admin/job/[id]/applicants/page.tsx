// components/ViewApplicantsPageComponent.tsx

"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Briefcase,
  Star,
  CheckCircle,
  XCircle,
  SortAsc,
  SortDesc,
  ChevronLeft,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface Applicant {
  id: number;
  name: string;
  profileImage: string;
  matchingScore: number;
  keySkills: string[];
  experience: number; // in years
  certifications: string[];
  bio: string;
}

const applicantsData: Applicant[] = [
  {
    id: 1,
    name: "Emily Johnson",
    profileImage: "/applicants/emily.jpg",
    matchingScore: 95,
    keySkills: ["Critical Care", "Ventilator Management", "Patient Monitoring"],
    experience: 5,
    certifications: ["ACLS", "BLS"],
    bio: "Experienced ICU nurse with a passion for patient care.",
  },
  {
    id: 2,
    name: "Michael Smith",
    profileImage: "/applicants/michael.jpg",
    matchingScore: 88,
    keySkills: ["Emergency Response", "Trauma Care"],
    experience: 4,
    certifications: ["TNCC", "ENPC"],
    bio: "Dedicated ER nurse with expertise in trauma situations.",
  },
  {
    id: 3,
    name: "Sarah Williams",
    profileImage: "/applicants/sarah.jpg",
    matchingScore: 92,
    keySkills: ["Pediatric Care", "Patient Education"],
    experience: 6,
    certifications: ["PALS", "CPN"],
    bio: "Compassionate pediatric nurse focused on child health.",
  },
  // Add more applicants as needed
];

const ViewApplicantsPageComponent: React.FC = () => {
  const userRole: "admin" | "nurse" = "admin"; // Assume admin role for this page
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [applicants, setApplicants] = useState<Applicant[]>(applicantsData);
  const [sortOption, setSortOption] = useState<"score" | "experience">("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const router = useRouter();

  // State for Confirmation Dialog
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(
    null
  );
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );

  // Sorting logic
  const sortedApplicants = [...applicants].sort((a, b) => {
    const key = sortOption === "score" ? "matchingScore" : "experience";
    if (sortOrder === "asc") {
      return a[key] - b[key];
    } else {
      return b[key] - a[key];
    }
  });

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
  const handleConfirmAction = () => {
    if (selectedApplicant && actionType) {
      if (actionType === "accept") {
        // Implement accept logic (e.g., update status, notify applicant)
        alert(`Accepted applicant: ${selectedApplicant.name}`);
      } else if (actionType === "reject") {
        // Implement reject logic (e.g., remove applicant, notify applicant)
        alert(`Rejected applicant: ${selectedApplicant.name}`);
      }

      // For prototype, remove the applicant from the list
      setApplicants(
        applicants.filter((app) => app.id !== selectedApplicant.id)
      );

      // Reset dialog state
      setIsConfirmOpen(false);
      setActionType(null);
      setSelectedApplicant(null);
    }
  };

  const handleCancelAction = () => {
    setIsConfirmOpen(false);
    setActionType(null);
    setSelectedApplicant(null);
  };

  const handleViewProfile = (applicantId: number) => {
    // Navigate to applicant's full profile or open a modal
    alert(`View profile for applicant ID: ${applicantId}`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
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
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar toggleSidebar={toggleSidebar} role={userRole} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6 flex items-center text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Job Listings
            </Button>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <h2 className="text-3xl font-semibold text-gray-800">
                Applicants for ICU Nurse Position
              </h2>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                {/* Sort Options */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      <SortAsc className="mr-2 h-5 w-5" />
                      Sort
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60 p-4">
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold mb-2">Sort By:</p>
                        <label className="flex items-center space-x-2 mb-1">
                          <input
                            type="radio"
                            name="sortOption"
                            value="score"
                            checked={sortOption === "score"}
                            onChange={() => setSortOption("score")}
                          />
                          <span>Matching Score</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="sortOption"
                            value="experience"
                            checked={sortOption === "experience"}
                            onChange={() => setSortOption("experience")}
                          />
                          <span>Experience</span>
                        </label>
                      </div>
                      <div>
                        <p className="font-semibold mb-2">Order:</p>
                        <label className="flex items-center space-x-2 mb-1">
                          <input
                            type="radio"
                            name="sortOrder"
                            value="desc"
                            checked={sortOrder === "desc"}
                            onChange={() => setSortOrder("desc")}
                          />
                          <span>Descending</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="sortOrder"
                            value="asc"
                            checked={sortOrder === "asc"}
                            onChange={() => setSortOrder("asc")}
                          />
                          <span>Ascending</span>
                        </label>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Applicants List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedApplicants.map((applicant) => (
                <Card
                  key={applicant.id}
                  className="hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between bg-white rounded-lg"
                >
                  <div>
                    <CardHeader className="flex items-center space-x-4 p-6">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={applicant.profileImage}
                          alt={applicant.name}
                        />
                        <AvatarFallback>
                          {applicant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl font-semibold">
                          {applicant.name}
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          {applicant.experience}{" "}
                          {applicant.experience === 1 ? "year" : "years"}{" "}
                          experience
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Star className="mr-2 h-5 w-5 text-yellow-500" />
                          <span className="text-sm font-medium">
                            Matching Score:{" "}
                            <span className="text-gray-800">
                              {applicant.matchingScore}%
                            </span>
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">
                            Key Skills:
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {applicant.keySkills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">
                            Certifications:
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {applicant.certifications.map((cert) => (
                              <Badge
                                key={cert}
                                variant="secondary"
                                className="text-xs"
                              >
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Bio:</p>
                          <p className="text-gray-600 mt-1 line-clamp-3">
                            {applicant.bio}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                  <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="flex space-x-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewProfile(applicant.id)}
                        className="flex items-center text-sm px-3 py-1"
                      >
                        <User className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openConfirmDialog(applicant, "accept")}
                        aria-label="Accept Applicant"
                        className="text-green-600 hover:text-green-800"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openConfirmDialog(applicant, "reject")}
                        aria-label="Reject Applicant"
                        className="text-red-600 hover:text-red-800"
                      >
                        <XCircle className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
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
              <Button variant="outline" onClick={handleCancelAction}>
                Cancel
              </Button>
              <Button
                className={cn(
                  actionType === "accept"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                )}
                onClick={handleConfirmAction}
              >
                {actionType === "accept" ? "Accept" : "Reject"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ViewApplicantsPageComponent;
