// components/JobManagementPageComponent.tsx

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { format } from 'date-fns';
import {
  Briefcase,
  Calendar as CalendarIcon,
  Clock,
  Edit,
  Eye,
  Plus,
  Trash,
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Job {
  id: number;
  title: string;
  facility: string;
  department: string;
  shiftType: string;
  status: 'Active' | 'Closed' | 'Draft';
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
    title: 'ICU Nurse',
    facility: 'Central Hospital',
    department: 'Intensive Care',
    shiftType: 'Night',
    status: 'Active',
    applicants: 5,
    date: new Date('2023-06-15'),
    time: '7:00 PM - 7:00 AM',
    payRate: '$45/hr',
    urgent: true,
    requiredSkills: ['Critical Care', 'Ventilator Management'],
    description:
      'Looking for experienced ICU nurses to join our night shift team.',
  },
  {
    id: 2,
    title: 'ER Nurse',
    facility: 'City Medical Center',
    department: 'Emergency',
    shiftType: 'Day',
    status: 'Active',
    applicants: 3,
    date: new Date('2023-06-16'),
    time: '8:00 AM - 8:00 PM',
    payRate: '$40/hr',
    urgent: false,
    requiredSkills: ['Triage', 'Trauma Care'],
    description:
      'Seeking dedicated ER nurses to handle high-pressure situations efficiently.',
  },
  {
    id: 3,
    title: 'Pediatric Nurse',
    facility: "Children's Hospital",
    department: 'Pediatrics',
    shiftType: 'Day',
    status: 'Closed',
    applicants: 7,
    date: new Date('2023-06-17'),
    time: '9:00 AM - 5:00 PM',
    payRate: '$35/hr',
    urgent: false,
    requiredSkills: ['Pediatric Care', 'Patient Education'],
    description:
      'Pediatric nurses needed to provide compassionate care to young patients.',
  },
  {
    id: 4,
    title: 'Surgical Nurse',
    facility: 'University Hospital',
    department: 'Surgery',
    shiftType: 'Day',
    status: 'Draft',
    applicants: 0,
    date: new Date('2023-06-18'),
    time: '6:00 AM - 2:00 PM',
    payRate: '$50/hr',
    urgent: true,
    requiredSkills: ['Perioperative Care', 'Sterilization Techniques'],
    description:
      'Join our surgical team to assist in various surgical procedures.',
  },
];

const JobManagementPageComponent: React.FC = () => {
  // For demonstration, set role here. In a real app, fetch from auth context or similar.
  const userRole: 'admin' 

  const [jobs, setJobs] = useState<Job[]>(jobListings);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState<boolean>(false);
  const [newJob, setNewJob] = useState<Omit<Job, 'id' | 'status' | 'applicants'>>({
    title: '',
    facility: '',
    department: '',
    shiftType: '',
    date: new Date(),
    time: '',
    payRate: '',
    requiredSkills: [],
    description: '',
    urgent: false,
  });

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
      newJob.requiredSkills.length === 0 ||
      !newJob.description
    ) {
      alert('Please fill out all required fields.');
      return;
    }

    const jobId = jobs.length + 1;
    const createdJob: Job = {
      ...newJob,
      id: jobId,
      status: 'Active',
      applicants: 0,
    };
    setJobs([...jobs, createdJob]);
    setIsCreateJobOpen(false);
    setNewJob({
      title: '',
      facility: '',
      department: '',
      shiftType: '',
      date: new Date(),
      time: '',
      payRate: '',
      requiredSkills: [],
      description: '',
      urgent: false,
    });
    alert('Job created successfully!');
  };

  const handleDeleteJob = (jobId: number) => {
    if (confirm('Are you sure you want to delete this job posting?')) {
      setJobs(jobs.filter((job) => job.id !== jobId));
    }
  };

  const handleViewApplicants = (jobId: number) => {
    // Navigate to the applicants page or open a modal
    alert(`View applicants for job ID: ${jobId}`);
  };

  const handleEditJob = (jobId: number) => {
    // Navigate to the edit job page or open a modal
    alert(`Edit job ID: ${jobId}`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar role={userRole} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <Topbar role={userRole} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Job Postings</h2>
              <Button
                onClick={() => setIsCreateJobOpen(true)}
                className="mt-4 md:mt-0 flex items-center bg-[#9d2235] hover:bg-[#7a172f]"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create New Job
              </Button>
            </div>

            {/* Job Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
                >
                  <div>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center justify-between">
                        <span>{job.title}</span>
                        {job.urgent && <Badge variant="destructive">Urgent</Badge>}
                      </CardTitle>
                      <p className="text-gray-600">{job.facility}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="flex items-center">
                          <Briefcase className="mr-2 h-4 w-4" />
                          {job.department}
                        </p>
                        <p className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {job.shiftType} Shift
                        </p>
                        <p className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(job.date, 'PPP')}
                        </p>
                        <p className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {job.time}
                        </p>
                        <p className="font-medium text-gray-800">
                          Pay Rate: {job.payRate}
                        </p>
                        <p className="flex items-center">
                          <Eye className="mr-2 h-4 w-4" />
                          Applicants: {job.applicants}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {job.requiredSkills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                          {job.requiredSkills.length > 3 && (
                            <Badge variant="secondary">
                              +{job.requiredSkills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </div>
                  <div className="px-4 py-2 flex items-center justify-between border-t">
                    <Badge
                      variant={
                        job.status === 'Active'
                          ? 'success'
                          : job.status === 'Closed'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {job.status}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewApplicants(job.id)}
                        className="flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditJob(job.id)}
                        className="flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteJob(job.id)}
                        className="flex items-center text-destructive hover:text-red-600"
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
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
            <DialogTitle>Create New Job</DialogTitle>
            <DialogDescription>
              Fill in the details for the new job posting.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleCreateJob(); }}>
            <div>
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                placeholder="Enter job title"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="facility">Facility</Label>
              <Input
                id="facility"
                value={newJob.facility}
                onChange={(e) => setNewJob({ ...newJob, facility: e.target.value })}
                placeholder="Enter facility name"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
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
            <div>
              <Label htmlFor="shiftType">Shift Type</Label>
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
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <div className="flex-1">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal mt-1',
                        !newJob.date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newJob.date ? format(newJob.date, 'PPP') : 'Select date'}
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
              <div className="flex-1 mt-4 sm:mt-0">
                <Label htmlFor="time">Time</Label>
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
            <div>
              <Label htmlFor="payRate">Pay Rate</Label>
              <Input
                id="payRate"
                value={newJob.payRate}
                onChange={(e) => setNewJob({ ...newJob, payRate: e.target.value })}
                placeholder="e.g., $30/hr"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="requiredSkills">Required Skills</Label>
              <Input
                id="requiredSkills"
                value={newJob.requiredSkills.join(', ')}
                onChange={(e) =>
                  setNewJob({
                    ...newJob,
                    requiredSkills: e.target.value.split(',').map((skill) => skill.trim()),
                  })
                }
                placeholder="e.g., Critical Care, Ventilator Management"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                placeholder="Enter job description..."
                required
                className="mt-1"
              />
            </div>
            <div className="flex items-center">
              <Switch
                id="urgent"
                checked={newJob.urgent}
                onCheckedChange={(checked) => setNewJob({ ...newJob, urgent: checked })}
              />
              <Label htmlFor="urgent" className="ml-2">
                Mark as Urgent
              </Label>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full bg-[#9d2235] hover:bg-[#7a172f]">
                Create Job
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobManagementPageComponent;
