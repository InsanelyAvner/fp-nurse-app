"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { format } from "date-fns";
import {
  Briefcase,
  Calendar as CalendarIcon,
  Clock,
  Edit,
  Eye,
  Plus,
  Trash,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Mock data for job listings
interface Job {
  id: number;
  title: string;
  facility: string;
  department: string;
  shiftType: string;
  status: "Active" | "Closed" | "Draft";
  applicants: number;
  date: Date;
  time: string;
  payRate: string;
  urgent: boolean;
  requiredSkills: string[];
  description: string;
}

const jobListings: Job[] = [
  {
    id: 1,
    title: "ICU Nurse",
    facility: "Central Hospital",
    department: "Intensive Care",
    shiftType: "Night",
    status: "Active",
    applicants: 5,
    date: new Date("2023-06-15"),
    time: "7:00 PM - 7:00 AM",
    payRate: "$45/hr",
    urgent: true,
    requiredSkills: ["Critical Care", "Ventilator Management"],
    description:
      "Looking for experienced ICU nurses to join our night shift team.",
  },
  {
    id: 2,
    title: "ER Nurse",
    facility: "City Medical Center",
    department: "Emergency",
    shiftType: "Day",
    status: "Active",
    applicants: 3,
    date: new Date("2023-06-16"),
    time: "8:00 AM - 8:00 PM",
    payRate: "$40/hr",
    urgent: false,
    requiredSkills: ["Triage", "Trauma Care"],
    description:
      "Seeking dedicated ER nurses to handle high-pressure situations efficiently.",
  },
  {
    id: 3,
    title: "Pediatric Nurse",
    facility: "Children's Hospital",
    department: "Pediatrics",
    shiftType: "Day",
    status: "Closed",
    applicants: 7,
    date: new Date("2023-06-17"),
    time: "9:00 AM - 5:00 PM",
    payRate: "$35/hr",
    urgent: false,
    requiredSkills: ["Pediatric Care", "Patient Education"],
    description:
      "Pediatric nurses needed to provide compassionate care to young patients.",
  },
  {
    id: 4,
    title: "Surgical Nurse",
    facility: "University Hospital",
    department: "Surgery",
    shiftType: "Day",
    status: "Draft",
    applicants: 0,
    date: new Date("2023-06-18"),
    time: "6:00 AM - 2:00 PM",
    payRate: "$50/hr",
    urgent: true,
    requiredSkills: ["Perioperative Care", "Sterilization Techniques"],
    description:
      "Join our surgical team to assist in various surgical procedures.",
  },
];

const JobManagementPageComponent: React.FC = () => {
  // For demonstration, set role here. In a real app, fetch from auth context or similar.
  const userRole: "admin" | "nurse" = "admin"; // Change to 'nurse' to test nurse dashboard
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [jobs, setJobs] = useState<Job[]>(jobListings);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState<boolean>(false);
  const [isEditJobOpen, setIsEditJobOpen] = useState<boolean>(false);
  const [newJob, setNewJob] = useState<
    Omit<Job, "id" | "status" | "applicants">
  >({
    title: "",
    facility: "",
    department: "",
    shiftType: "",
    date: new Date(),
    time: "",
    payRate: "",
    requiredSkills: [],
    description: "",
    urgent: false,
  });
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // New state variables for delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const handleCreateJob = () => {
    // ... (your existing create job logic)
  };

  const handleDeleteJob = (job: Job) => {
    setJobToDelete(job);
    setIsDeleteDialogOpen(true);
  };

  const handleViewApplicants = (jobId: number) => {
    // ... (your existing view applicants logic)
  };

  const handleEditJob = (jobId: number) => {
    // ... (your existing edit job logic)
  };

  const handleUpdateJob = () => {
    // ... (your existing update job logic)
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
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <h2 className="text-3xl font-semibold text-gray-800">
                Job Postings
              </h2>
              <Button
                onClick={() => setIsCreateJobOpen(true)}
                className="mt-4 md:mt-0 flex items-center bg-[#9d2235] hover:bg-[#7a172f] text-white px-4 py-2"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create New Job
              </Button>
            </div>

            {/* Job Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between bg-white rounded-lg"
                >
                  <div>
                    <CardHeader className="flex flex-col space-y-2 p-4">
                      <CardTitle className="text-xl font-semibold flex items-center justify-between">
                        <span>{job.title}</span>
                        {job.urgent && (
                          <Badge variant="destructive">Urgent</Badge>
                        )}
                      </CardTitle>
                      <p className="text-gray-600">{job.facility}</p>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="text-sm text-gray-600 space-y-2">
                        <p className="flex items-center">
                          <Briefcase className="mr-2 h-4 w-4 text-gray-500" />
                          {job.department}
                        </p>
                        <p className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-gray-500" />
                          {job.shiftType} Shift
                        </p>
                        <p className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                          {format(job.date, "PPP")}
                        </p>
                        <p className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-gray-500" />
                          {job.time}
                        </p>
                        <p className="font-medium text-gray-800">
                          Pay Rate: {job.payRate}
                        </p>
                        <p className="flex items-center">
                          <Eye className="mr-2 h-4 w-4 text-gray-500" />
                          Applicants: {job.applicants}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {job.requiredSkills.slice(0, 3).map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {job.requiredSkills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{job.requiredSkills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                    <Badge
                      variant={
                        job.status === "Active"
                          ? "default"
                          : job.status === "Closed"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {job.status}
                    </Badge>
                    <div className="flex space-x-3">
                      <Link href={`/admin/job/${job.id}/applicants`}>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="View Applicants"
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditJob(job.id)}
                        aria-label="Edit Job"
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteJob(job)}
                        aria-label="Delete Job"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Create Job Dialog */}
      <Dialog open={isCreateJobOpen} onOpenChange={setIsCreateJobOpen}>
        {/* ... (your existing create job dialog code) */}
      </Dialog>

      {/* Edit Job Dialog */}
      <Dialog open={isEditJobOpen} onOpenChange={setIsEditJobOpen}>
        {/* ... (your existing edit job dialog code) */}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="mt-2 text-gray-600">
              Are you sure you want to delete the job posting "
              <span className="font-medium">{jobToDelete?.title}</span>"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (jobToDelete) {
                  setJobs(jobs.filter((job) => job.id !== jobToDelete.id));
                  setIsDeleteDialogOpen(false);
                  setJobToDelete(null);
                  // Optionally, show a success message using a toast or similar
                }
              }}
              className="px-4 py-2"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobManagementPageComponent;
