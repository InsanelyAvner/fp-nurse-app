'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Bell, Briefcase, Calendar as CalendarIcon, ChevronRight, Clock, Edit, Eye, Home, LogOut, Menu, Plus, Search, Settings, Trash, User, X } from 'lucide-react'

// Mock data for job listings
const jobListings = [
  { id: 1, title: "ICU Nurse", facility: "Central Hospital", department: "Intensive Care", shiftType: "Night", status: "Active", applicants: 5, date: "2023-06-15", time: "7:00 PM - 7:00 AM", payRate: "$45/hr", urgent: true, requiredSkills: ["Critical Care", "Ventilator Management"] },
  { id: 2, title: "ER Nurse", facility: "City Medical Center", department: "Emergency", shiftType: "Day", status: "Active", applicants: 3, date: "2023-06-16", time: "8:00 AM - 8:00 PM", payRate: "$40/hr", urgent: false, requiredSkills: ["Triage", "Trauma Care"] },
  { id: 3, title: "Pediatric Nurse", facility: "Children's Hospital", department: "Pediatrics", shiftType: "Day", status: "Closed", applicants: 7, date: "2023-06-17", time: "9:00 AM - 5:00 PM", payRate: "$35/hr", urgent: false, requiredSkills: ["Pediatric Care", "Patient Education"] },
  { id: 4, title: "Surgical Nurse", facility: "University Hospital", department: "Surgery", shiftType: "Day", status: "Draft", applicants: 0, date: "2023-06-18", time: "6:00 AM - 2:00 PM", payRate: "$50/hr", urgent: true, requiredSkills: ["Perioperative Care", "Sterilization Techniques"] },
]

export default function JobManagementPage() {
  const [jobs, setJobs] = useState(jobListings)
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false)
  const [newJob, setNewJob] = useState({
    title: '',
    facility: '',
    department: '',
    shiftType: '',
    date: new Date(),
    time: '',
    payRate: '',
    requiredSkills: '',
    description: '',
    urgent: false
  })

  const handleCreateJob = () => {
    const jobId = jobs.length + 1
    const createdJob = {
      ...newJob,
      id: jobId,
      status: 'Active',
      applicants: 0,
      requiredSkills: newJob.requiredSkills.split(',').map(skill => skill.trim())
    }
    setJobs([...jobs, createdJob])
    setIsCreateJobOpen(false)
    setNewJob({
      title: '',
      facility: '',
      department: '',
      shiftType: '',
      date: new Date(),
      time: '',
      payRate: '',
      requiredSkills: '',
      description: '',
      urgent: false
    })
  }

  const handleDeleteJob = (jobId: number) => {
    setJobs(jobs.filter(job => job.id !== jobId))
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar>
          <SidebarHeader>
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Home className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <Briefcase className="mr-2 h-4 w-4" />
                      <span>Job Postings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <User className="mr-2 h-4 w-4" />
                      <span>Applications</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <SidebarTrigger className="md:hidden">
                  <Menu className="h-6 w-6" />
                </SidebarTrigger>
                <h1 className="text-2xl font-semibold text-gray-900">Job Management</h1>
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Job Listings</h2>
                <Dialog open={isCreateJobOpen} onOpenChange={setIsCreateJobOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Create New Job
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create New Job</DialogTitle>
                      <DialogDescription>
                        Fill in the details for the new job posting.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Title
                        </Label>
                        <Input
                          id="title"
                          value={newJob.title}
                          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="facility" className="text-right">
                          Facility
                        </Label>
                        <Input
                          id="facility"
                          value={newJob.facility}
                          onChange={(e) => setNewJob({ ...newJob, facility: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="department" className="text-right">
                          Department
                        </Label>
                        <Select
                          onValueChange={(value) => setNewJob({ ...newJob, department: value })}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="icu">Intensive Care</SelectItem>
                            <SelectItem value="er">Emergency</SelectItem>
                            <SelectItem value="pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="surgery">Surgery</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="shiftType" className="text-right">
                          Shift Type
                        </Label>
                        <Select
                          onValueChange={(value) => setNewJob({ ...newJob, shiftType: value })}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select shift type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="day">Day</SelectItem>
                            <SelectItem value="night">Night</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "col-span-3 justify-start text-left font-normal",
                                !newJob.date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newJob.date ? format(newJob.date, "PPP") : <span>Pick a date</span>}
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
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">
                          Time
                        </Label>
                        <Input
                          id="time"
                          value={newJob.time}
                          onChange={(e) => setNewJob({ ...newJob, time: e.target.value })}
                          placeholder="e.g. 9:00 AM - 5:00 PM"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="payRate" className="text-right">
                          Pay Rate
                        </Label>
                        <Input
                          id="payRate"
                          value={newJob.payRate}
                          onChange={(e) => setNewJob({ ...newJob, payRate: e.target.value })}
                          placeholder="e.g. $30/hr"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="requiredSkills" className="text-right">
                          Required Skills
                        </Label>
                        <Input
                          id="requiredSkills"
                          value={newJob.requiredSkills}
                          onChange={(e) => setNewJob({ ...newJob, requiredSkills: e.target.value })}
                          placeholder="e.g. Critical Care, Ventilator Management"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          value={newJob.description}
                          onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="urgent" className="text-right">
                          Urgent
                        </Label>
                        <Switch
                          id="urgent"
                          checked={newJob.urgent}
                          onCheckedChange={(checked) => setNewJob({ ...newJob, urgent: checked })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleCreateJob}>Create Job</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300">
                    
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold flex items-center justify-between">
                        <span>{job.title}</span>
                        {job.urgent && (
                          <Badge variant="destructive">Urgent</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{job.facility}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2 flex items-center text-gray-600">
                        <Briefcase className="mr-1 h-4 w-4" /> {job.department}
                      </p>
                      <p className="text-sm mb-2 flex items-center text-gray-600">
                        <Clock className="mr-1 h-4 w-4" /> {job.shiftType} Shift
                      </p>
                      <p className="text-sm mb-2 flex items-center text-gray-600">
                        <CalendarIcon className="mr-1 h-4 w-4" /> {job.date}
                      </p>
                      <p className="text-sm mb-2 flex items-center text-gray-600">
                        <Clock className="mr-1 h-4 w-4" /> {job.time}
                      </p>
                      <p className="text-sm font-semibold mb-2 text-gray-800">
                        Pay Rate: {job.payRate}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.requiredSkills.map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Badge variant={job.status === 'Active' ? 'default' : job.status === 'Closed' ? 'secondary' : 'outline'}>
                        {job.status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="mr-2 h-4 w-4" /> View ({job.applicants})
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteJob(job.id)}>
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}