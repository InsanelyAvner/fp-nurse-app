// File: /app/components/JobManagementPageComponent.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  Users2,
} from "lucide-react";
import Link from "next/link";
import CreateJobDialog from "@/components/CreateJobDialog";
import EditJobDialog from "@/components/EditJobDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface Job {
  id: number;
  title: string;
  facility: string;
  department: string;
  shiftType: string;
  status: "ACTIVE" | "CLOSED" | "DRAFT";
  applicants: number;
  date: string;
  time: string;
  payRate: string;
  urgent: boolean;
  requiredSkills: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

const JobManagementPageComponent: React.FC = () => {
  const userRole: "ADMIN" | "USER" = "ADMIN"; // Ensure role matches schema
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState<boolean>(false);
  const [isEditJobOpen, setIsEditJobOpen] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/jobs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data: Job[] = await response.json();
        setJobs(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchJobs();
  }, []);

  const handleCreateJob = async (jobData: Omit<Job, "id" | "status" | "applicants" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error("Failed to create job");
      }

      const newJob: Job = await response.json();
      setJobs([newJob, ...jobs]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditJob = (jobId: number) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      setEditingJob(job);
      setIsEditJobOpen(true);
    }
  };

  const handleUpdateJob = async (updatedJob: Job) => {
    try {
      const response = await fetch(`/api/jobs/${updatedJob.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedJob),
      });

      if (!response.ok) {
        throw new Error("Failed to update job");
      }

      const data: Job = await response.json();
      setJobs(jobs.map((job) => (job.id === data.id ? data : job)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteJob = (job: Job) => {
    setJobToDelete(job);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      const response = await fetch(`/api/jobs/${jobToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      setJobs(jobs.filter((job) => job.id !== jobToDelete.id));
      setIsDeleteDialogOpen(false);
      setJobToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewApplicants = (jobId: number) => {
    router.push(`/admin/job/${jobId}/applicants`);
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
                  className="hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between bg-white rounded-lg relative overflow-hidden"
                >
                  {job.urgent && (
                    <div className="absolute top-0 left-0 w-full bg-red-600 text-white text-center text-sm py-1 font-medium">
                      Urgent Position
                    </div>
                  )}
                  <div className={job.urgent ? "pt-8" : ""}>
                    <CardHeader className="flex flex-col space-y-2 p-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-semibold">
                          {job.title}
                        </CardTitle>
                        <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                          <Users2 className="h-4 w-4 text-[#9d2235] mr-1" />
                          <span className="font-medium">{job.applicants}</span>
                        </div>
                      </div>
                      <p className="text-gray-600">{job.facility}</p>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="text-sm text-gray-600 space-y-2">
                        <p className="flex items-center">
                          <Briefcase className="mr-2 h-4 w-4 text-[#9d2235]" />
                          {job.department}
                        </p>
                        <p className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-[#9d2235]" />
                          {job.shiftType} Shift
                        </p>
                        <p className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 text-[#9d2235]" />
                          {format(new Date(job.date), "PPP")}
                        </p>
                        <p className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-[#9d2235]" />
                          {job.time}
                        </p>
                        <div className="mt-4 mb-4">
                          <span className="text-lg font-semibold text-[#9d2235]">
                            {job.payRate}
                          </span>
                        </div>
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
                        job.status === "ACTIVE"
                          ? "default"
                          : job.status === "CLOSED"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
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
      <CreateJobDialog
        open={isCreateJobOpen}
        onOpenChange={setIsCreateJobOpen}
        onCreate={handleCreateJob}
      />

      {/* Edit Job Dialog */}
      <EditJobDialog
        open={isEditJobOpen}
        onOpenChange={setIsEditJobOpen}
        job={editingJob}
        onUpdate={handleUpdateJob}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-red-600">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="mt-2 text-gray-600">
              Are you sure you want to delete the job posting "
              <span className="font-medium">{jobToDelete?.title}</span>"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteJob}
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
