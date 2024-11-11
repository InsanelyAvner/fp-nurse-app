// File: /app/components/EditJobDialog.tsx

"use client";

import React, { useState, KeyboardEvent, useEffect, useMemo } from "react";
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
import { CalendarIcon, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { TimePicker } from "@/components/ui/time-picker";
import { Job } from "@/app/types"; 

interface Skill {
  id: number;
  name: string;
}

interface EditJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
  onUpdate: (updatedJob: Job) => Promise<void>;
}


const EditJobDialog: React.FC<EditJobDialogProps> = ({
  open,
  onOpenChange,
  job,
  onUpdate,
}) => {
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);

  // State variables for TimePicker
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);

  // Fetch all skills when the dialog opens
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
          throw new Error(`Failed to fetch skills: ${response.statusText}`);
        }

        const responseData = await response.json();

        // Ensure responseData is an array
        const data: Skill[] = Array.isArray(responseData)
          ? responseData
          : Array.isArray(responseData.skills)
          ? responseData.skills
          : [];

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format: Expected an array of skills.");
        }

        console.log("Fetched Skills:", data); // Debugging Log
        setAllSkills(data);

        if (job) {
          console.log("Job Data:", job); // Debugging Log

          // Map requiredSkills names to Skill objects
          const jobSkills = data.filter((skill) =>
            job.requiredSkills.includes(skill.name)
          );

          console.log("Job Skills after Mapping:", jobSkills); // Debugging Log

          setSelectedSkills(jobSkills);

          // Parse the existing time string into startTime and endTime
          if (job.time) {
            const [startStr, endStr] = job.time.split(" - ");
            const parsedStart = parse(startStr, "h:mm a", new Date());
            const parsedEnd = parse(endStr, "h:mm a", new Date());

            if (!isNaN(parsedStart.getTime()) && !isNaN(parsedEnd.getTime())) {
              setStartTime(parsedStart);
              setEndTime(parsedEnd);
            } else {
              console.warn("Invalid time format in job data.");
            }
          }
        } else {
          setSelectedSkills([]);
        }
      } catch (error) {
        console.error(error);
        alert("An error occurred while fetching skills. Please try again.");
      }
    };

    if (open) {
      fetchSkills();
    }
  }, [open, job]);

  // Initialize editingJob when job changes
  useEffect(() => {
    if (open && job) {
      setEditingJob(job);
    } else {
      setEditingJob(null);
    }
  }, [open, job]);

  // Compute filteredSkills based on skillInput and selectedSkills
  const filteredSkills = useMemo(() => {
    if (skillInput.trim() === "") {
      return allSkills.filter(
        (skill) => !selectedSkills.some((s) => s.id === skill.id)
      );
    }
    return allSkills.filter(
      (skill) =>
        skill.name.toLowerCase().includes(skillInput.toLowerCase()) &&
        !selectedSkills.some((s) => s.id === skill.id)
    );
  }, [allSkills, selectedSkills, skillInput]);

  const handleSkillInputChange = (value: string) => {
    setSkillInput(value);
  };

  const handleSkillSelect = (skill: Skill) => {
    if (!selectedSkills.find((s) => s.id === skill.id)) {
      setSelectedSkills([...selectedSkills, skill]);
      console.log(`Selected Skill: ${skill.name}`); // Debugging Log
    }
    setSkillInput("");
  };

  const handleSkillRemove = (skill: Skill) => {
    const updatedSkills = selectedSkills.filter((s) => s.id !== skill.id);
    setSelectedSkills(updatedSkills);
    console.log(`Removed Skill: ${skill.name}`); // Debugging Log
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      e.preventDefault();
      const skillName = skillInput.trim();
      const existingSkill = allSkills.find(
        (s) => s.name.toLowerCase() === skillName.toLowerCase()
      );

      if (
        existingSkill &&
        !selectedSkills.some((s) => s.id === existingSkill.id)
      ) {
        setSelectedSkills([...selectedSkills, existingSkill]);
        console.log(`Skill Added via Enter: ${existingSkill.name}`); // Debugging Log
      } else if (!existingSkill) {
        alert("Skill not found. Please select from the list.");
      } else {
        alert("Skill already selected.");
      }

      setSkillInput("");
    }
  };

  const handleUpdateJob = () => {
    if (!editingJob) return;

    if (
      !editingJob.title ||
      !editingJob.facility ||
      !editingJob.department ||
      !editingJob.shiftType ||
      !editingJob.date ||
      !startTime ||
      !endTime ||
      !editingJob.payRate ||
      selectedSkills.length === 0 ||
      !editingJob.description
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

    const updatedJob: Job = {
      ...editingJob,
      time: timeString,
      requiredSkills: selectedSkills.map((skill) => skill.name),
    };

    console.log("Updated Job Data:", updatedJob); // Debugging Log

    onUpdate(updatedJob);
    onOpenChange(false);
    setEditingJob(null);
    setSelectedSkills([]);
    setSkillInput("");
    setStartTime(undefined);
    setEndTime(undefined);
    alert("Job updated successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Edit Job</DialogTitle>
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
                value={editingJob.department}
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
                htmlFor="edit-shiftType"
                className="block font-medium text-gray-700"
              >
                Shift Type
              </Label>
              <Select
                onValueChange={(value) =>
                  setEditingJob({ ...editingJob, shiftType: value })
                }
                value={editingJob.shiftType}
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
                      ? format(new Date(editingJob.date), "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <input
                    type="date"
                    value={editingJob.date}
                    onChange={(e) =>
                      setEditingJob({ ...editingJob, date: e.target.value })
                    }
                    className="w-full p-2"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date Picker */}
            <div className="flex flex-col sm:flex-row sm:space-x-6">
              {/* Date */}

              {/* Time Pickers */}
              <div className="flex-1 mt-4 sm:mt-0">
                <Label
                  htmlFor="edit-time"
                  className="block font-medium text-gray-700"
                >
                  Time
                </Label>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:space-x-4">
                    {/* Start Time */}
                    <div className="flex-1">
                      <Label
                        htmlFor="edit-startTime"
                        className="block text-sm text-gray-600"
                      >
                        Start Time
                      </Label>
                      <TimePicker
                        setDate={setStartTime}
                        date={startTime}
                      />
                    </div>

                    {/* End Time */}
                    <div className="flex-1">
                      <Label
                        htmlFor="edit-endTime"
                        className="block text-sm text-gray-600"
                      >
                        End Time
                      </Label>
                      <TimePicker
                        setDate={setEndTime}
                        date={endTime}
                      />
                    </div>
                  </div>
                </div>
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
                placeholder="e.g., $46/hr"
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
                  value={skillInput}
                  onChange={(e) => handleSkillInputChange(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type to add skills or press Enter to add"
                  autoComplete="off"
                  className="pr-10"
                />
                {/* Suggestions Dropdown */}
                {skillInput && filteredSkills.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {filteredSkills.map((skill) => (
                      <li
                        key={skill.id}
                        onClick={() => handleSkillSelect(skill)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                )}
                {/* Add Button for Non-Existing Skills */}
                {skillInput.trim() !== "" &&
                  !allSkills.some(
                    (s) =>
                      s.name.toLowerCase() === skillInput.trim().toLowerCase()
                  ) && (
                    <button
                      type="button"
                      onClick={() => {
                        const skillName = skillInput.trim();
                        if (skillName === "") return;

                        // Optionally, handle custom skill creation here
                        alert(
                          `Skill "${skillName}" not found. Please select from the list.`
                        );
                        setSkillInput("");
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
                    key={skill.id}
                    variant="secondary"
                    className="flex items-center text-sm"
                  >
                    {skill.name}
                    <button
                      type="button"
                      onClick={() => handleSkillRemove(skill)}
                      className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label={`Remove ${skill.name}`}
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
                  setEditingJob({ ...editingJob, description: e.target.value })
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
  );
};

export default EditJobDialog;
