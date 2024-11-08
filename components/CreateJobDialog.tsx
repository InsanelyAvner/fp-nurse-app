// File: /app/components/CreateJobDialog.tsx

"use client";

import React, { useState, KeyboardEvent, useEffect } from "react";
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
import { CalendarIcon, Plus, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Skill {
  id: number;
  name: string;
}

interface Job {
  title: string;
  facility: string;
  department: string;
  shiftType: string;
  date: Date;
  time: string;
  payRate: string;
  requiredSkills: number[];
  description: string;
  urgent: boolean;
}

interface CreateJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (job: Job) => void;
}

const CreateJobDialog: React.FC<CreateJobDialogProps> = ({
  open,
  onOpenChange,
  onCreate,
}) => {
  const [newJob, setNewJob] = useState<Omit<Job, "id" | "status" | "applicants">>({
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
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);

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
        setFilteredSkills(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (open) {
      fetchSkills();
    }
  }, [open]);

  const handleCreateJob = () => {
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

    const jobData: Job = {
      ...newJob,
      requiredSkills: selectedSkills.map((skill) => skill.id),
    };

    onCreate(jobData);
    onOpenChange(false);
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
    setFilteredSkills(allSkills);
    alert("Job created successfully!");
  };

  const handleSkillInputChange = (value: string) => {
    setSkillInput(value);
    if (value === "") {
      setFilteredSkills(allSkills.filter((s) => !selectedSkills.includes(s)));
    } else {
      setFilteredSkills(
        allSkills
          .filter((s) => s.name.toLowerCase().includes(value.toLowerCase()))
          .filter((s) => !selectedSkills.includes(s))
      );
    }
  };

  const handleSkillSelect = (skill: Skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setSkillInput("");
    setFilteredSkills(allSkills.filter((s) => !selectedSkills.includes(s)));
  };

  const handleSkillRemove = (skill: Skill) => {
    const updatedSkills = selectedSkills.filter((s) => s.id !== skill.id);
    setSelectedSkills(updatedSkills);
    setFilteredSkills(allSkills.filter((s) => !updatedSkills.includes(s)));
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      e.preventDefault();
      const skillName = skillInput.trim();
      const existingSkill = allSkills.find(
        (s) => s.name.toLowerCase() === skillName.toLowerCase()
      );

      if (existingSkill && !selectedSkills.includes(existingSkill)) {
        setSelectedSkills([...selectedSkills, existingSkill]);
      } else if (!existingSkill) {
        // Optionally handle custom skills if allowed
        alert("Skill not found.");
      }

      setSkillInput("");
      setFilteredSkills(allSkills.filter((s) => !selectedSkills.includes(s)));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Create New Job</DialogTitle>
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
                <SelectItem value="Swing">Swing</SelectItem>
                <SelectItem value="Per Diem">Per Diem</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
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
                  <input
                    type="date"
                    value={format(newJob.date, "yyyy-MM-dd")}
                    onChange={(e) =>
                      setNewJob({ ...newJob, date: new Date(e.target.value) })
                    }
                    className="w-full p-2"
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
            <Label htmlFor="requiredSkills" className="block font-medium text-gray-700">
              Required Skills
            </Label>
            <div className="relative mt-1">
              <Input
                id="requiredSkills"
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
            <Label htmlFor="description" className="block font-medium text-gray-700">
              Job Description
            </Label>
            <Textarea
              id="description"
              value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
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
              onCheckedChange={(checked) => setNewJob({ ...newJob, urgent: checked })}
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
