'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Upload, X } from 'lucide-react'

export function NurseProfilePageComponent() {
  const [activeTab, setActiveTab] = useState("personal")
  const [profileCompletion, setProfileCompletion] = useState(0)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    console.log(data)
    // Here you would typically send the data to your backend
  }

  const updateProfileCompletion = (tab) => {
    // This is a simplified example. In a real application, you'd calculate this based on filled fields
    const completionMap = {
      "personal": 25,
      "professional": 50,
      "experience": 75,
      "documents": 100
    }
    setProfileCompletion(completionMap[tab])
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-[#9d2235] mb-2">My Profile</h1>
      <p className="text-gray-600 mb-6">Complete your profile to get the best job matches.</p>

      <div className="mb-6 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div className="bg-[#9d2235] h-2.5 rounded-full" style={{ width: `${profileCompletion}%` }}></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); updateProfileCompletion(value); }}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Provide your basic personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img src="/placeholder.svg?height=96&width=96" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <Button>
                    <Upload className="mr-2 h-4 w-4" /> Upload Picture
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" {...register("firstName", { required: true })} />
                    {errors.firstName && <span className="text-red-500">This field is required</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...register("lastName", { required: true })} />
                    {errors.lastName && <span className="text-red-500">This field is required</span>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !register("dob").value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {register("dob").value ? format(register("dob").value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={register("dob").value}
                        onSelect={(date) => register("dob").onChange(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select onValueChange={(value) => register("gender").onChange(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input id="contactNumber" {...register("contactNumber", { required: true })} />
                  {errors.contactNumber && <span className="text-red-500">This field is required</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" {...register("email", { required: true })} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" {...register("address")} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professional">
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>Provide details about your nursing career</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Nursing License Number</Label>
                  <Input id="licenseNumber" {...register("licenseNumber", { required: true })} />
                  {errors.licenseNumber && <span className="text-red-500">This field is required</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseExpiration">License Expiration Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !register("licenseExpiration").value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {register("licenseExpiration").value ? format(register("licenseExpiration").value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={register("licenseExpiration").value}
                        onSelect={(date) => register("licenseExpiration").onChange(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                  <Input id="yearsOfExperience" type="number" {...register("yearsOfExperience", { required: true, min: 0 })} />
                  {errors.yearsOfExperience && <span className="text-red-500">Please enter a valid number</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">Highest Education Level</Label>
                  <Select onValueChange={(value) => register("education").onChange(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="associate">Associate Degree</SelectItem>
                      <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                      <SelectItem value="master">Master's Degree</SelectItem>
                      <SelectItem value="doctorate">Doctorate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Specializations</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['ICU', 'ER', 'Pediatrics', 'Surgical', 'Oncology', 'Geriatrics'].map((spec) => (
                      <div key={spec} className="flex items-center space-x-2">
                        <Checkbox id={spec} {...register("specializations")} />
                        <Label htmlFor={spec}>{spec}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Skills and Certifications</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['ACLS', 'BLS', 'PALS', 'Critical Care', 'Wound Care'].map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox id={skill} {...register("skills")} />
                        <Label htmlFor={skill}>{skill}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Languages Spoken</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['English', 'Mandarin', 'Malay', 'Tamil'].map((lang) => (
                      <div key={lang} className="flex items-center space-x-2">
                        <Checkbox id={lang} {...register("languages")} />
                        <Label htmlFor={lang}>{lang}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Shift Preferences</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Day Shift', 'Night Shift', 'Weekends', 'Overtime'].map((shift) => (
                      <div key={shift} className="flex items-center space-x-2">
                        <Checkbox id={shift} {...register("shiftPreferences")} />
                        <Label htmlFor={shift}>{shift}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>Add your previous work experiences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Experience 1</h3>
                    <Button variant="outline" size="icon">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facilityName">Facility Name</Label>
                    <Input id="facilityName" {...register("facilityName", { required: true })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position/Title</Label>
                    <Input id="position" {...register("position", { required: true })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" {...register("department")} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !register("startDate").value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {register("startDate").value ? format(register("startDate").value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={register("startDate").value}
                            onSelect={(date) => register("startDate").onChange(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div  className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !register("endDate").value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {register("endDate").value ? format(register("endDate").value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={register("endDate").value}
                            onSelect={(date) => register("endDate").onChange(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsibilities">Responsibilities/Duties</Label>
                    <Textarea id="responsibilities" {...register("responsibilities")} />
                  </div>
                </div>
                <Button className="w-full">
                  Add Another Experience
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Upload your necessary documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume/CV</Label>
                  <Input id="resume" type="file" {...register("resume", { required: true })} />
                  {errors.resume && <span className="text-red-500">This field is required</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="license">Nursing License Copy</Label>
                  <Input id="license" type="file" {...register("license", { required: true })} />
                  {errors.license && <span className="text-red-500">This field is required</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications</Label>
                  <Input id="certifications" type="file" multiple {...register("certifications")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otherDocuments">Other Relevant Documents</Label>
                  <Input id="otherDocuments" type="file" multiple {...register("otherDocuments")} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const prevTab = {
                "professional": "personal",
                "experience": "professional",
                "documents": "experience"
              }[activeTab]
              if (prevTab) {
                setActiveTab(prevTab)
                updateProfileCompletion(prevTab)
              }
            }}
            disabled={activeTab === "personal"}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            type="button"
            onClick={() => {
              const nextTab = {
                "personal": "professional",
                "professional": "experience",
                "experience": "documents"
              }[activeTab]
              if (nextTab) {
                setActiveTab(nextTab)
                updateProfileCompletion(nextTab)
              } else {
                handleSubmit(onSubmit)()
              }
            }}
          >
            {activeTab === "documents" ? "Submit" : "Next"} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}