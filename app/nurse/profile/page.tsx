// NurseProfilePageComponent.tsx

"use client";

import React, { useState, useEffect, useContext, useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X, Lightbulb } from "lucide-react";
import Progress from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { LoadingContext } from "@/app/context/LoadingContext";

interface Skill {
  id: number;
  name: string;
}

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  dob: Date | null;
  gender: string;
  contactNumber: string;
  email: string;
  postalCode: string;
  citizenship: string;
  race: string;
  // Professional Information
  specialization: string;
  availableWorkDays: string; // Reverted to single selection (e.g., Weekdays, Weekends)
  frequencyOfWork: number;
  preferredFacilityType: string;
  availableWorkTiming: string;
  skills: number[];
  // Work Experience
  experiences: Experience[];
}

interface Experience {
  facilityName: string;
  position: string;
  department: string;
  startDate: Date | null;
  endDate: Date | null;
  responsibilities: string;
}

const NurseProfilePageComponent: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { isLoading, startLoading, stopLoading } = useContext(LoadingContext);
  const [skillsList, setSkillsList] = useState<Skill[]>([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: null,
      gender: "",
      contactNumber: "",
      email: "",
      postalCode: "",
      citizenship: "",
      race: "",
      specialization: "",
      availableWorkDays: "", // Changed to single selection
      frequencyOfWork: 1,
      preferredFacilityType: "",
      availableWorkTiming: "",
      skills: [],
      experiences: [
        {
          facilityName: "",
          position: "",
          department: "",
          startDate: null,
          endDate: null,
          responsibilities: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experiences",
  });

  useEffect(() => {
    const fetchData = async () => {
      startLoading();
      try {
        const profileResponse = await fetch("/api/nurse/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const skillsResponse = await fetch("/api/skills", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (profileResponse.ok && skillsResponse.ok) {
          const profileData = await profileResponse.json();
          const skillsData: Skill[] = await skillsResponse.json();

          setSkillsList(skillsData);

          const profileSkillsIds = profileData.skills
            ? profileData.skills.map((skill: Skill) => skill.id)
            : [];

          const availableWorkDays = profileData.availableWorkDays || "";

          const formValues: FormData = {
            firstName: profileData.firstName || "",
            lastName: profileData.lastName || "",
            dob: profileData.dob ? new Date(profileData.dob) : null,
            gender: profileData.gender || "",
            contactNumber: profileData.contactNumber || "",
            email: profileData.email || "",
            postalCode: profileData.postalCode || "",
            citizenship: profileData.citizenship || "",
            race: profileData.race || "",
            specialization: profileData.specialization || "",
            availableWorkDays: availableWorkDays,
            frequencyOfWork: profileData.frequencyOfWork || 1,
            preferredFacilityType: profileData.preferredFacilityType || "",
            availableWorkTiming: profileData.availableWorkTiming || "",
            skills: profileSkillsIds,
            experiences: profileData.experiences
              ? profileData.experiences.map((exp: any) => ({
                  facilityName: exp.facilityName || "",
                  position: exp.position || "",
                  department: exp.department || "",
                  startDate: exp.startDate ? new Date(exp.startDate) : null,
                  endDate: exp.endDate ? new Date(exp.endDate) : null,
                  responsibilities: exp.responsibilities || "",
                }))
              : [
                  {
                    facilityName: "",
                    position: "",
                    department: "",
                    startDate: null,
                    endDate: null,
                    responsibilities: "",
                  },
                ],
          };

          reset(formValues);
        } else {
          console.error("Failed to fetch profile or skills data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        stopLoading();
      }
    };

    fetchData();
  }, [startLoading, stopLoading, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    startLoading();
    try {
      const payload = {
        ...data,
        dob: data.dob ? data.dob.toISOString() : null,
        experiences: data.experiences.map((exp) => ({
          ...exp,
          startDate: exp.startDate ? exp.startDate.toISOString() : null,
          endDate: exp.endDate ? exp.endDate.toISOString() : null,
        })),
      };

      const response = await fetch("/api/nurse/me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitSuccess(true);
      } else {
        const errorData = await response.json();
        console.error("Failed to update profile:", errorData.message);
      }
    } catch (error) {
      console.error("Submission Error:", error);
    } finally {
      stopLoading();
      setIsSubmitting(false);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const watchAllFields = watch();

  useEffect(() => {
    let completed = 0;
    const totalFields = 12;

    if (watchAllFields.firstName) completed += 1;
    if (watchAllFields.lastName) completed += 1;
    if (watchAllFields.dob) completed += 1;
    if (watchAllFields.gender) completed += 1;
    if (watchAllFields.contactNumber) completed += 1;
    if (watchAllFields.email) completed += 1;
    if (watchAllFields.postalCode) completed += 1;
    if (watchAllFields.citizenship) completed += 1;
    if (watchAllFields.race) completed += 1;
    if (watchAllFields.specialization) completed += 1;
    if (watchAllFields.availableWorkDays) completed += 1;
    if (watchAllFields.frequencyOfWork) completed += 1;

    setProfileCompletion(Math.min((completed / totalFields) * 100, 100));
  }, [watchAllFields]);

  const memoizedSkillsList = useMemo(() => skillsList, [skillsList]);

  const workDaysOptions = ["Weekdays", "Weekends", "Both"];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} role="nurse" />

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
        <Topbar toggleSidebar={toggleSidebar} role="nurse" />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                <p className="text-gray-600">Manage your profile information</p>
              </div>
              {/* Profile Completion */}
              <div className="mt-4 sm:mt-0 sm:text-right">
                <div className="flex items-center space-x-2">
                  <Progress
                    value={profileCompletion}
                    className="w-32 h-2 bg-gray-200 rounded-full"
                    trackColor="bg-gray-200"
                  />
                  <span className="text-sm text-gray-700">{profileCompletion}% Complete</span>
                </div>
              </div>
            </div>

            {/* Profile Completion Prompt */}
            {!isLoading && profileCompletion < 100 && (
              <div className="mb-6">
                <Card className="bg-[#9d2235] text-white">
                  <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between p-6 space-y-4 md:space-y-0">
                    {/* Icon */}
                    <div className="flex-shrink-0 mr-3">
                      <Lightbulb size={40} />
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">Complete Your Profile</h2>
                      <p className="text-sm mt-1">
                        Completing your profile helps us match you with the best job opportunities!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Success Message */}
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md transition-opacity duration-500 ease-in-out">
                Your profile has been updated successfully!
              </div>
            )}

            {/* Loading State */}
            {isLoading || memoizedSkillsList.length === 0 ? (
              <div className="space-y-6">
                {/* Skeletons for Personal Information */}
                <Card className="shadow-md animate-pulse">
                  <CardHeader>
                    <CardTitle className="h-6 bg-gray-300 rounded w-1/3"></CardTitle>
                    <CardDescription className="h-4 bg-gray-300 rounded w-1/2 mt-2"></CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                      </div>
                      <div>
                        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Skeletons for Professional Information */}
                <Card className="shadow-md animate-pulse">
                  <CardHeader>
                    <CardTitle className="h-6 bg-gray-300 rounded w-1/3"></CardTitle>
                    <CardDescription className="h-4 bg-gray-300 rounded w-1/2 mt-2"></CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                      </div>
                      <div>
                        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Skeletons for Work Experience */}
                <Card className="shadow-md animate-pulse">
                  <CardHeader>
                    <CardTitle className="h-6 bg-gray-300 rounded w-1/3"></CardTitle>
                    <CardDescription className="h-4 bg-gray-300 rounded w-1/2 mt-2"></CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <Card className="shadow-md transition-opacity duration-500 ease-in-out">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Provide your basic personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          {...register("firstName", {
                            required: "First name is required",
                          })}
                          className="mt-1"
                        />
                        {errors.firstName && (
                          <span className="text-red-500 text-sm">
                            {errors.firstName.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          {...register("lastName", {
                            required: "Last name is required",
                          })}
                          className="mt-1"
                        />
                        {errors.lastName && (
                          <span className="text-red-500 text-sm">
                            {errors.lastName.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* DOB and Gender */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Controller
                          control={control}
                          name="dob"
                          rules={{ required: "Date of birth is required" }}
                          render={({ field }) => (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal mt-1",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? format(field.value, "PPP") : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={field.value ?? undefined}
                                  onSelect={(date) => {
                                    field.onChange(date);
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          )}
                        />
                        {errors.dob && (
                          <span className="text-red-500 text-sm">
                            {errors.dob.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Controller
                          control={control}
                          name="gender"
                          rules={{ required: "Gender is required" }}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                              }}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.gender && (
                          <span className="text-red-500 text-sm">
                            {errors.gender.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Contact Number and Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="contactNumber">Contact Number</Label>
                        <Input
                          id="contactNumber"
                          placeholder="+65 1234 5678"
                          {...register("contactNumber", {
                            required: "Contact number is required",
                          })}
                          className="mt-1"
                        />
                        {errors.contactNumber && (
                          <span className="text-red-500 text-sm">
                            {errors.contactNumber.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john.doe@example.com"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: "Invalid email address",
                            },
                          })}
                          readOnly
                          className="mt-1 bg-gray-100 cursor-not-allowed"
                        />
                        {errors.email && (
                          <span className="text-red-500 text-sm">
                            {errors.email.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Postal Code, Citizenship, Race */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          placeholder="123456"
                          {...register("postalCode", {
                            required: "Postal code is required",
                          })}
                          className="mt-1"
                        />
                        {errors.postalCode && (
                          <span className="text-red-500 text-sm">
                            {errors.postalCode.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="citizenship">Citizenship</Label>
                        <Controller
                          control={control}
                          name="citizenship"
                          rules={{ required: "Citizenship is required" }}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                              }}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select citizenship" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Singaporean">Singaporean</SelectItem>
                                <SelectItem value="PR">PR (Permanent Resident)</SelectItem>
                                <SelectItem value="Foreigner">Foreigner</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.citizenship && (
                          <span className="text-red-500 text-sm">
                            {errors.citizenship.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="race">Race</Label>
                        <Controller
                          control={control}
                          name="race"
                          rules={{ required: "Race is required" }}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                              }}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select race" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Chinese">Chinese</SelectItem>
                                <SelectItem value="Malay">Malay</SelectItem>
                                <SelectItem value="Indian">Indian</SelectItem>
                                <SelectItem value="Others">Others</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.race && (
                          <span className="text-red-500 text-sm">
                            {errors.race.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Information */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                    <CardDescription>Provide details about your nursing career</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Specialization */}
                    <div>
                      <Label htmlFor="specialization">Specialization</Label>
                      <Controller
                        control={control}
                        name="specialization"
                        rules={{ required: "Specialization is required" }}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select specialization" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="COMMUNITY_HEALTH">Community Health</SelectItem>
                              <SelectItem value="CRITICAL_CARE">Critical Care</SelectItem>
                              <SelectItem value="GERONTOLOGY">Gerontology</SelectItem>
                              <SelectItem value="EMERGENCY">Emergency</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.specialization && (
                        <span className="text-red-500 text-sm">
                          {errors.specialization.message}
                        </span>
                      )}
                    </div>

                    {/* Available Work Days */}
                    <div>
                      <Label>Available Work Days</Label>
                      <Controller
                        control={control}
                        name="availableWorkDays"
                        rules={{ required: "Please select at least one work day" }}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select available work days" />
                            </SelectTrigger>
                            <SelectContent>
                              {workDaysOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.availableWorkDays && (
                        <span className="text-red-500 text-sm">
                          {errors.availableWorkDays.message}
                        </span>
                      )}
                    </div>

                    {/* Frequency of Work */}
                    <div>
                      <Label htmlFor="frequencyOfWork">Frequency of Work</Label>
                      <div className="flex items-center mt-1">
                        <Controller
                          control={control}
                          name="frequencyOfWork"
                          rules={{
                            required: "Frequency of work is required",
                            min: {
                              value: 1,
                              message: "Must be at least 1 time a week",
                            },
                            max: {
                              value: 7,
                              message: "Cannot exceed 7 times a week",
                            },
                          }}
                          render={({ field }) => (
                            <Input
                              id="frequencyOfWork"
                              type="number"
                              placeholder="5"
                              {...field}
                              min={1}
                              max={7}
                              className="w-20"
                              onChange={(e) => {
                                const value = parseInt(e.target.value, 10);
                                if (!isNaN(value)) {
                                  field.onChange(value);
                                } else {
                                  field.onChange("");
                                }
                              }}
                            />
                          )}
                        />
                        <span className="ml-2 text-gray-700">times a week</span>
                      </div>
                      {errors.frequencyOfWork && (
                        <span className="text-red-500 text-sm">
                          {errors.frequencyOfWork.message}
                        </span>
                      )}
                    </div>

                    {/* Preferred Facility Type */}
                    <div>
                      <Label htmlFor="preferredFacilityType">Preferred Facility Type</Label>
                      <Input
                        id="preferredFacilityType"
                        placeholder="ICU"
                        {...register("preferredFacilityType", {
                          required: "Preferred facility type is required",
                        })}
                        className="mt-1"
                      />
                      {errors.preferredFacilityType && (
                        <span className="text-red-500 text-sm">
                          {errors.preferredFacilityType.message}
                        </span>
                      )}
                    </div>

                    {/* Available Work Timing */}
                    <div>
                      <Label htmlFor="availableWorkTiming">Available Work Timing</Label>
                      <Input
                        id="availableWorkTiming"
                        placeholder="No Preference"
                        {...register("availableWorkTiming", {
                          required: "Available work timing is required",
                        })}
                        className="mt-1"
                      />
                      {errors.availableWorkTiming && (
                        <span className="text-red-500 text-sm">
                          {errors.availableWorkTiming.message}
                        </span>
                      )}
                    </div>

                    {/* Skills */}
                    <div>
                      <Label>Skills</Label>
                      <Controller
                        control={control}
                        name="skills"
                        rules={{
                          required: "Please select at least one skill",
                        }}
                        render={({ field }) => (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                            {memoizedSkillsList.map((skill) => (
                              <div key={skill.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`skill_${skill.id}`}
                                  checked={field.value.includes(skill.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, skill.id]);
                                    } else {
                                      field.onChange(field.value.filter((id) => id !== skill.id));
                                    }
                                  }}
                                />
                                <Label htmlFor={`skill_${skill.id}`}>{skill.name}</Label>
                              </div>
                            ))}
                          </div>
                        )}
                      />
                      {errors.skills && (
                        <span className="text-red-500 text-sm">
                          {errors.skills.message}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Work Experience */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Work Experience</CardTitle>
                    <CardDescription>Add your previous work experiences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {fields.map((item, index) => (
                      <div key={item.id} className="space-y-4 border p-4 rounded-md">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Experience {index + 1}</h3>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                            >
                              <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor={`experiences.${index}.facilityName`}>Facility Name</Label>
                            <Input
                              id={`experiences.${index}.facilityName`}
                              placeholder="Hospital ABC"
                              {...register(`experiences.${index}.facilityName` as const, {
                                required: "Facility name is required",
                              })}
                              className="mt-1"
                            />
                            {errors.experiences?.[index]?.facilityName && (
                              <span className="text-red-500 text-sm">
                                {errors.experiences[index].facilityName?.message}
                              </span>
                            )}
                          </div>
                          <div>
                            <Label htmlFor={`experiences.${index}.position`}>Position/Title</Label>
                            <Input
                              id={`experiences.${index}.position`}
                              placeholder="Registered Nurse"
                              {...register(`experiences.${index}.position` as const, {
                                required: "Position is required",
                              })}
                              className="mt-1"
                            />
                            {errors.experiences?.[index]?.position && (
                              <span className="text-red-500 text-sm">
                                {errors.experiences[index].position?.message}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor={`experiences.${index}.department`}>Department</Label>
                            <Input
                              id={`experiences.${index}.department`}
                              placeholder="Pediatrics"
                              {...register(`experiences.${index}.department` as const)}
                              className="mt-1"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`experiences.${index}.startDate`}>Start Date</Label>
                              <Controller
                                control={control}
                                name={`experiences.${index}.startDate`}
                                rules={{ required: "Start date is required" }}
                                render={({ field }) => (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "w-full justify-start text-left font-normal mt-1",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <Calendar
                                        mode="single"
                                        selected={field.value ?? undefined}
                                        onSelect={(date) => {
                                          field.onChange(date);
                                        }}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                )}
                              />
                              {errors.experiences?.[index]?.startDate && (
                                <span className="text-red-500 text-sm">
                                  {errors.experiences[index].startDate?.message}
                                </span>
                              )}
                            </div>
                            <div>
                              <Label htmlFor={`experiences.${index}.endDate`}>End Date</Label>
                              <Controller
                                control={control}
                                name={`experiences.${index}.endDate`}
                                rules={{ required: "End date is required" }}
                                render={({ field }) => (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "w-full justify-start text-left font-normal mt-1",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <Calendar
                                        mode="single"
                                        selected={field.value ?? undefined}
                                        onSelect={(date) => {
                                          field.onChange(date);
                                        }}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                )}
                              />
                              {errors.experiences?.[index]?.endDate && (
                                <span className="text-red-500 text-sm">
                                  {errors.experiences[index].endDate?.message}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Responsibilities */}
                        <div>
                          <Label htmlFor={`experiences.${index}.responsibilities`}>
                            Responsibilities/Duties
                          </Label>
                          <Textarea
                            id={`experiences.${index}.responsibilities`}
                            placeholder="Describe your responsibilities..."
                            {...register(`experiences.${index}.responsibilities` as const)}
                            className="mt-1"
                            rows={4}
                          />
                        </div>
                      </div>
                    ))}

                    {/* Add Experience Button */}
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          append({
                            facilityName: "",
                            position: "",
                            department: "",
                            startDate: null,
                            endDate: null,
                            responsibilities: "",
                          })
                        }
                      >
                        Add Another Experience
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NurseProfilePageComponent;
