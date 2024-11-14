"use client";

import React, { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CalendarIcon, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { TimePicker } from "@/components/ui/time-picker";
import MultiSelectCombobox from "@/components/MultiSelectCombobox";

interface Skill {
  id: number;
  name: string;
}

interface Job {
  title: string;
  facility: string;
  department: string;
  shiftType: string;
  date: string;
  time: string; // Combined time field
  payRate: string;
  requiredSkills: string[];
  description: string;
  urgent: boolean;
}

interface CreateJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (
    job: Omit<Job, "id" | "status" | "applicants" | "createdAt" | "updatedAt">
  ) => void;
}

const CreateJobDialog: React.FC<CreateJobDialogProps> = ({
  open,
  onOpenChange,
  onCreate,
}) => {
  const [newJob, setNewJob] = useState<
    Omit<Job, "id" | "status" | "applicants">
  >({
    title: "",
    facility: "",
    department: "",
    shiftType: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "",
    payRate: "",
    requiredSkills: [],
    description: "",
    urgent: false,
  });

  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

  // State variables for TimePicker
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("/api/skills", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch skills");
        }

        const data: Skill[] = await response.json();
        setAllSkills(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (open) {
      fetchSkills();
      // Initialize start and end times if not already set
      if (!startTime) {
        const now = new Date();
        setStartTime(now);
      }
      if (!endTime) {
        const later = new Date();
        later.setHours(later.getHours() + 1);
        setEndTime(later);
      }
    }
  }, [open]);

  const handleCreateJob = () => {
    if (
      !newJob.title ||
      !newJob.facility ||
      !newJob.department ||
      !newJob.shiftType ||
      !newJob.date ||
      !startTime ||
      !endTime ||
      !newJob.payRate ||
      selectedSkills.length === 0 ||
      !newJob.description
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    // Validate that start time is before end time
    if (startTime >= endTime) {
      alert("Start time must be before end time.");
      return;
    }

    // Format the times to "HH:MM AM/PM"
    const formatTime = (date: Date) => {
      return format(date, "hh:mm aa");
    };

    const timeString = `${formatTime(startTime)} - ${formatTime(endTime)}`;

    const jobData: Omit<Job, "id" | "status" | "applicants"> = {
      ...newJob,
      time: timeString,
      requiredSkills: selectedSkills.map((skill) => skill.name),
    };

    onCreate(jobData);
    onOpenChange(false);
    setNewJob({
      title: "",
      facility: "",
      department: "",
      shiftType: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "",
      payRate: "",
      requiredSkills: [],
      description: "",
      urgent: false,
    });
    setSelectedSkills([]);
    alert("Job created successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Label
              htmlFor="facility"
              className="block font-medium text-gray-700"
            >
              Facility
            </Label>
            <Input
              id="facility"
              value={newJob.facility}
              onChange={(e) =>
                setNewJob({ ...newJob, facility: e.target.value })
              }
              placeholder="Enter facility name"
              required
              className="mt-1"
            />
          </div>

          {/* Department */}
          <div>
            <Label
              htmlFor="department"
              className="block font-medium text-gray-700"
            >
              Department
            </Label>
            <Select
              onValueChange={(value) =>
                setNewJob({ ...newJob, department: value })
              }
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
                <SelectItem value="Oncology">Oncology</SelectItem>
                <SelectItem value="Geriatrics">Geriatrics</SelectItem>
                <SelectItem value="Neonatal">Neonatal</SelectItem>
                <SelectItem value="Cardiology">Cardiology</SelectItem>
                <SelectItem value="Neurology">Neurology</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Shift Type */}
          <div>
            <Label
              htmlFor="shiftType"
              className="block font-medium text-gray-700"
            >
              Shift Type
            </Label>
            <Select
              onValueChange={(value) =>
                setNewJob({ ...newJob, shiftType: value })
              }
              defaultValue=""
              required
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select shift type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Day">Day</SelectItem>
                <SelectItem value="Night">Night</SelectItem>
                <SelectItem value="Swing">Swing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Picker */}
          <div>
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
                  {newJob.date
                    ? format(new Date(newJob.date), "PPP")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <input
                  type="date"
                  value={newJob.date}
                  onChange={(e) =>
                    setNewJob({ ...newJob, date: e.target.value })
                  }
                  className="w-full p-2"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Picker */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              {/* Start Time */}
              <div className="flex-1">
                <Label
                  htmlFor="startTime"
                  className="block text-sm text-gray-600"
                >
                  Start Time
                </Label>
                <TimePicker
                  setDate={setStartTime}
                  date={startTime}
                  // id="startTime"
                />
              </div>

              {/* End Time */}
              <div className="flex-1">
                <Label
                  htmlFor="endTime"
                  className="block text-sm text-gray-600"
                >
                  End Time
                </Label>
                <TimePicker
                  setDate={setEndTime}
                  date={endTime}
                  // id="endTime"
                />
              </div>
            </div>
          </div>

          {/* Pay Rate */}
          <div>
            <Label
              htmlFor="payRate"
              className="block font-medium text-gray-700"
            >
              Pay Rate
            </Label>
            <Input
              id="payRate"
              value={newJob.payRate}
              onChange={(e) =>
                setNewJob({ ...newJob, payRate: e.target.value })
              }
              placeholder="e.g., $30/hr"
              required
              className="mt-1"
            />
          </div>

          {/* Required Skills with Multi-Select Combobox */}
          <div>
            <Label
              htmlFor="requiredSkills"
              className="block font-medium text-gray-700 mb-1"
            >
              Required Skills
            </Label>
            <MultiSelectCombobox
              allSkills={allSkills}
              selectedSkills={selectedSkills}
              setSelectedSkills={setSelectedSkills}
            />
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
  );
};

export default CreateJobDialog;
