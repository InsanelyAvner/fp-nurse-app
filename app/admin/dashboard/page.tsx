// JobManagementPageComponent.tsx

"use client";

import React, { useState, useEffect, KeyboardEvent } from "react";
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
  X,
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

const predefinedSkills = [
  "Critical Care",
  "Ventilator Management",
  "Patient Monitoring",
  "Emergency Response",
  "Trauma Care",
  "Pediatric Care",
  "Patient Education",
  "Oncology",
  "Geriatrics",
  "Wound Care",
  "ACLS",
  "BLS",
  "PALS",
  "TNCC",
  "ENPC",
  "CPN",
  // Add more skills as needed
];

const JobManagementPageComponent: React.FC = () => {
  const userRole: "admin" | "nurse" = "admin"; // Change to 'nurse' to test nurse dashboard
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [jobs, setJobs] = useState<Job[]>(jobListings);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState<boolean>(false);
  const [isEditJobOpen, setIsEditJobOpen] = useState<boolean>(false);

  // State for Create Job
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

  const [skillInput, setSkillInput] = useState("");
  const [filteredSkills, setFilteredSkills] = useState<string[]>(predefinedSkills);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // State for Edit Job
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editSkillInput, setEditSkillInput] = useState("");
  const [editFilteredSkills, setEditFilteredSkills] =
    useState<string[]>(predefinedSkills);
  const [editSelectedSkills, setEditSelectedSkills] = useState<string[]>([]);

  // State variables for delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  // Handlers for Create Job
  const handleCreateJob = () => {
    // Basic validation
    if (
      !newJob.title ||
      !newJob.facility ||
      !newJob.department ||
      !newJob.shiftType ||
      !newJob.date ||
      !newJob.time ||
      !newJob.payRate ||
      selectedSkills.length === 0 ||
      !newJob.description
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    const jobId = jobs.length > 0 ? Math.max(...jobs.map((j) => j.id)) + 1 : 1;
    const createdJob: Job = {
      ...newJob,
      id: jobId,
      status: "Active",
      applicants: 0,
      requiredSkills: selectedSkills,
    };
    setJobs([...jobs, createdJob]);
    setIsCreateJobOpen(false);
    setNewJob({
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
    setSelectedSkills([]);
    setSkillInput("");
    setFilteredSkills(predefinedSkills);
    alert("Job created successfully!");
  };

  const handleSkillInputChange = (value: string) => {
    setSkillInput(value);
    if (value === "") {
      setFilteredSkills(predefinedSkills.filter((s) => !selectedSkills.includes(s)));
    } else {
      setFilteredSkills(
        predefinedSkills
          .filter((s) => s.toLowerCase().includes(value.toLowerCase()))
          .filter((s) => !selectedSkills.includes(s))
      );
    }
  };

  const handleSkillSelect = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setSkillInput("");
    setFilteredSkills(predefinedSkills.filter((s) => !selectedSkills.includes(s)));
  };

  const handleSkillRemove = (skill: string) => {
    const updatedSkills = selectedSkills.filter((s) => s !== skill);
    setSelectedSkills(updatedSkills);
    setFilteredSkills(predefinedSkills.filter((s) => !updatedSkills.includes(s)));
  };

  // Handler to add custom skill on Enter key
  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      e.preventDefault();
      const skill = skillInput.trim();
      if (!selectedSkills.includes(skill)) {
        setSelectedSkills([...selectedSkills, skill]);
      }
      setSkillInput("");
      setFilteredSkills(predefinedSkills.filter((s) => !selectedSkills.includes(s)));
    }
  };

  // Handlers for Edit Job
  const handleEditJob = (jobId: number) => {
    const jobToEdit = jobs.find((job) => job.id === jobId);
    if (jobToEdit) {
      setEditingJob(jobToEdit);
      setEditSelectedSkills(jobToEdit.requiredSkills);
      setEditFilteredSkills(
        predefinedSkills.filter((s) => !jobToEdit.requiredSkills.includes(s))
      );
      setEditSkillInput("");
      setIsEditJobOpen(true);
    }
  };

  const handleEditSkillInputChange = (value: string) => {
    setEditSkillInput(value);
    if (value === "") {
      setEditFilteredSkills(predefinedSkills.filter((s) => !editSelectedSkills.includes(s)));
    } else {
      setEditFilteredSkills(
        predefinedSkills
          .filter((s) => s.toLowerCase().includes(value.toLowerCase()))
          .filter((s) => !editSelectedSkills.includes(s))
      );
    }
  };

  const handleEditSkillSelect = (skill: string) => {
    if (!editSelectedSkills.includes(skill)) {
      setEditSelectedSkills([...editSelectedSkills, skill]);
    }
    setEditSkillInput("");
    setEditFilteredSkills(predefinedSkills.filter((s) => !editSelectedSkills.includes(s)));
  };

  const handleEditSkillRemove = (skill: string) => {
    const updatedSkills = editSelectedSkills.filter((s) => s !== skill);
    setEditSelectedSkills(updatedSkills);
    setEditFilteredSkills(predefinedSkills.filter((s) => !updatedSkills.includes(s)));
  };

  // Handler to add custom skill on Enter key in Edit form
  const handleEditSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && editSkillInput.trim() !== "") {
      e.preventDefault();
      const skill = editSkillInput.trim();
      if (!editSelectedSkills.includes(skill)) {
        setEditSelectedSkills([...editSelectedSkills, skill]);
      }
      setEditSkillInput("");
      setEditFilteredSkills(predefinedSkills.filter((s) => !editSelectedSkills.includes(s)));
    }
  };

  const handleUpdateJob = () => {
    if (!editingJob) return;

    // Basic validation
    if (
      !editingJob.title ||
      !editingJob.facility ||
      !editingJob.department ||
      !editingJob.shiftType ||
      !editingJob.date ||
      !editingJob.time ||
      !editingJob.payRate ||
      editSelectedSkills.length === 0 ||
      !editingJob.description
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    const updatedJob = { ...editingJob, requiredSkills: editSelectedSkills };
    setJobs(jobs.map((job) => (job.id === editingJob.id ? updatedJob : job)));
    setIsEditJobOpen(false);
    setEditingJob(null);
    setEditSelectedSkills([]);
    setEditSkillInput("");
    setEditFilteredSkills(predefinedSkills);
    alert("Job updated successfully!");
  };

  // Handlers for Delete Job
  const handleDeleteJob = (job: Job) => {
    setJobToDelete(job);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteJob = () => {
    if (jobToDelete) {
      setJobs(jobs.filter((job) => job.id !== jobToDelete.id));
      setIsDeleteDialogOpen(false);
      setJobToDelete(null);
      alert("Job deleted successfully!");
    }
  };

  const handleViewApplicants = (jobId: number) => {
    // Navigate to the applicants page or open a modal
    alert(`View applicants for job ID: ${jobId}`);
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
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Create New Job
            </DialogTitle>
            <DialogDescription className="mt-2 text-gray-600">
              Fill in the details for the new job posting.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-6 mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateJob();
            }}
          >
            {/* Job Title */}
            <div>
              <Label htmlFor="title" className="block font-medium text-gray-700">
                Job Title
              </Label>
              <Input
                id="title"
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                placeholder="Enter job title"
                required
                className="mt-1"
              />
            </div>

            {/* Facility */}
            <div>
              <Label htmlFor="facility" className="block font-medium text-gray-700">
                Facility
              </Label>
              <Input
                id="facility"
                value={newJob.facility}
                onChange={(e) => setNewJob({ ...newJob, facility: e.target.value })}
                placeholder="Enter facility name"
                required
                className="mt-1"
              />
            </div>

            {/* Department */}
            <div>
              <Label htmlFor="department" className="block font-medium text-gray-700">
                Department
              </Label>
              <Select
                onValueChange={(value) => setNewJob({ ...newJob, department: value })}
                defaultValue=""
                required
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Intensive Care">Intensive Care</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="Surgery">Surgery</SelectItem>
                  {/* Add more departments as needed */}
                </SelectContent>
              </Select>
            </div>

            {/* Shift Type */}
            <div>
              <Label htmlFor="shiftType" className="block font-medium text-gray-700">
                Shift Type
              </Label>
              <Select
                onValueChange={(value) => setNewJob({ ...newJob, shiftType: value })}
                defaultValue=""
                required
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select shift type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Day">Day</SelectItem>
                  <SelectItem value="Night">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date and Time */}
            <div className="flex flex-col sm:flex-row sm:space-x-6">
              {/* Date */}
              <div className="flex-1">
                <Label htmlFor="date" className="block font-medium text-gray-700">
                  Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !newJob.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-5 w-5 text-gray-500" />
                      {newJob.date ? format(newJob.date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newJob.date}
                      onSelect={(date) => date && setNewJob({ ...newJob, date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time */}
              <div className="flex-1 mt-4 sm:mt-0">
                <Label htmlFor="time" className="block font-medium text-gray-700">
                  Time
                </Label>
                <Input
                  id="time"
                  value={newJob.time}
                  onChange={(e) => setNewJob({ ...newJob, time: e.target.value })}
                  placeholder="e.g., 9:00 AM - 5:00 PM"
                  required
                  className="mt-1"
                />
              </div>
            </div>

            {/* Pay Rate */}
            <div>
              <Label htmlFor="payRate" className="block font-medium text-gray-700">
                Pay Rate
              </Label>
              <Input
                id="payRate"
                value={newJob.payRate}
                onChange={(e) => setNewJob({ ...newJob, payRate: e.target.value })}
                placeholder="e.g., $30/hr"
                required
                className="mt-1"
              />
            </div>

            {/* Required Skills with Autocomplete and Custom Input */}
            <div>
              <Label
                htmlFor="requiredSkills"
                className="block font-medium text-gray-700"
              >
                Required Skills
              </Label>
              <div className="relative mt-1">
                <Input
                  id="requiredSkills"
                  type="text"
                  value={skillInput}
                  onChange={(e) => handleSkillInputChange(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type to add skills or press Enter to add custom skill"
                  autoComplete="off"
                  className="pr-10"
                />
                {/* Suggestions Dropdown */}
                {skillInput && filteredSkills.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {filteredSkills.map((skill) => (
                      <li
                        key={skill}
                        onClick={() => handleSkillSelect(skill)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                )}
                {/* Add Button for Custom Skills */}
                {skillInput.trim() !== "" && !predefinedSkills.includes(skillInput.trim()) && (
                  <button
                    type="button"
                    onClick={() => {
                      const skill = skillInput.trim();
                      if (skill !== "" && !selectedSkills.includes(skill)) {
                        setSelectedSkills([...selectedSkills, skill]);
                      }
                      setSkillInput("");
                      setFilteredSkills(predefinedSkills.filter((s) => !selectedSkills.includes(s)));
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#9d2235] text-white px-2 py-1 rounded-md text-sm hover:bg-[#7a172f]"
                  >
                    Add
                  </button>
                )}
              </div>
              {/* Display Selected Skills */}
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="flex items-center text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleSkillRemove(skill)}
                      className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Job Description */}
            <div>
              <Label
                htmlFor="description"
                className="block font-medium text-gray-700"
              >
                Job Description
              </Label>
              <Textarea
                id="description"
                value={newJob.description}
                onChange={(e) =>
                  setNewJob({ ...newJob, description: e.target.value })
                }
                placeholder="Enter job description..."
                required
                className="mt-1"
                rows={4}
              />
            </div>

            {/* Urgent Switch */}
            <div className="flex items-center">
              <Switch
                id="urgent"
                checked={newJob.urgent}
                onCheckedChange={(checked) =>
                  setNewJob({ ...newJob, urgent: checked })
                }
              />
              <Label htmlFor="urgent" className="ml-2 text-gray-700">
                Mark as Urgent
              </Label>
            </div>

            {/* Submit Button */}
            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-[#9d2235] hover:bg-[#7a172f] text-white py-2"
              >
                Create Job
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Job Dialog */}
      <Dialog open={isEditJobOpen} onOpenChange={setIsEditJobOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Edit Job
            </DialogTitle>
            <DialogDescription className="mt-2 text-gray-600">
              Update the details for the selected job posting.
            </DialogDescription>
          </DialogHeader>
          {editingJob && (
            <form
              className="space-y-6 mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateJob();
              }}
            >
              {/* Job Title */}
              <div>
                <Label
                  htmlFor="edit-title"
                  className="block font-medium text-gray-700"
                >
                  Job Title
                </Label>
                <Input
                  id="edit-title"
                  value={editingJob.title}
                  onChange={(e) =>
                    setEditingJob({ ...editingJob, title: e.target.value })
                  }
                  placeholder="Enter job title"
                  required
                  className="mt-1"
                />
              </div>

              {/* Facility */}
              <div>
                <Label
                  htmlFor="edit-facility"
                  className="block font-medium text-gray-700"
                >
                  Facility
                </Label>
                <Input
                  id="edit-facility"
                  value={editingJob.facility}
                  onChange={(e) =>
                    setEditingJob({ ...editingJob, facility: e.target.value })
                  }
                  placeholder="Enter facility name"
                  required
                  className="mt-1"
                />
              </div>

              {/* Department */}
              <div>
                <Label
                  htmlFor="edit-department"
                  className="block font-medium text-gray-700"
                >
                  Department
                </Label>
                <Select
                  onValueChange={(value) =>
                    setEditingJob({ ...editingJob, department: value })
                  }
                  defaultValue={editingJob.department}
                  required
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Intensive Care">Intensive Care</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Surgery">Surgery</SelectItem>
                    {/* Add more departments as needed */}
                  </SelectContent>
                </Select>
              </div>

              {/* Shift Type */}
              <div>
                <Label
                  htmlFor="edit-shiftType"
                  className="block font-medium text-gray-700"
                >
                  Shift Type
                </Label>
                <Select
                  onValueChange={(value) =>
                    setEditingJob({ ...editingJob, shiftType: value })
                  }
                  defaultValue={editingJob.shiftType}
                  required
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select shift type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Day">Day</SelectItem>
                    <SelectItem value="Night">Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date and Time */}
              <div className="flex flex-col sm:flex-row sm:space-x-6">
                {/* Date */}
                <div className="flex-1">
                  <Label
                    htmlFor="edit-date"
                    className="block font-medium text-gray-700"
                  >
                    Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !editingJob.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-5 w-5 text-gray-500" />
                        {editingJob.date
                          ? format(editingJob.date, "PPP")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editingJob.date}
                        onSelect={(date) =>
                          date && setEditingJob({ ...editingJob, date })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Time */}
                <div className="flex-1 mt-4 sm:mt-0">
                  <Label
                    htmlFor="edit-time"
                    className="block font-medium text-gray-700"
                  >
                    Time
                  </Label>
                  <Input
                    id="edit-time"
                    value={editingJob.time}
                    onChange={(e) =>
                      setEditingJob({ ...editingJob, time: e.target.value })
                    }
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Pay Rate */}
              <div>
                <Label
                  htmlFor="edit-payRate"
                  className="block font-medium text-gray-700"
                >
                  Pay Rate
                </Label>
                <Input
                  id="edit-payRate"
                  value={editingJob.payRate}
                  onChange={(e) =>
                    setEditingJob({ ...editingJob, payRate: e.target.value })
                  }
                  placeholder="e.g., $30/hr"
                  required
                  className="mt-1"
                />
              </div>

              {/* Required Skills with Autocomplete and Custom Input */}
              <div>
                <Label
                  htmlFor="edit-requiredSkills"
                  className="block font-medium text-gray-700"
                >
                  Required Skills
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="edit-requiredSkills"
                    type="text"
                    value={editSkillInput}
                    onChange={(e) => handleEditSkillInputChange(e.target.value)}
                    onKeyDown={handleEditSkillKeyDown}
                    placeholder="Type to add skills or press Enter to add custom skill"
                    autoComplete="off"
                    className="pr-10"
                  />
                  {/* Suggestions Dropdown */}
                  {editSkillInput && editFilteredSkills.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                      {editFilteredSkills.map((skill) => (
                        <li
                          key={skill}
                          onClick={() => handleEditSkillSelect(skill)}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  )}
                  {/* Add Button for Custom Skills */}
                  {editSkillInput.trim() !== "" &&
                    !predefinedSkills.includes(editSkillInput.trim()) && (
                      <button
                        type="button"
                        onClick={() => {
                          const skill = editSkillInput.trim();
                          if (skill !== "" && !editSelectedSkills.includes(skill)) {
                            setEditSelectedSkills([...editSelectedSkills, skill]);
                          }
                          setEditSkillInput("");
                          setEditFilteredSkills(
                            predefinedSkills.filter((s) => !editSelectedSkills.includes(s))
                          );
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#9d2235] text-white px-2 py-1 rounded-md text-sm hover:bg-[#7a172f]"
                      >
                        Add
                      </button>
                    )}
                </div>
                {/* Display Selected Skills */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {editSelectedSkills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="flex items-center text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleEditSkillRemove(skill)}
                        className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label={`Remove ${skill}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Job Description */}
              <div>
                <Label
                  htmlFor="edit-description"
                  className="block font-medium text-gray-700"
                >
                  Job Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={editingJob.description}
                  onChange={(e) =>
                    setEditingJob({
                      ...editingJob,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter job description..."
                  required
                  className="mt-1"
                  rows={4}
                />
              </div>

              {/* Urgent Switch */}
              <div className="flex items-center">
                <Switch
                  id="edit-urgent"
                  checked={editingJob.urgent}
                  onCheckedChange={(checked) =>
                    setEditingJob({ ...editingJob, urgent: checked })
                  }
                />
                <Label htmlFor="edit-urgent" className="ml-2 text-gray-700">
                  Mark as Urgent
                </Label>
              </div>

              {/* Submit Button */}
              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full bg-[#9d2235] hover:bg-[#7a172f] text-white py-2"
                >
                  Update Job
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

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
