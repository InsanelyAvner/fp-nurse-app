// NurseProfilePageComponent.tsx

"use client";

import React, { useState, useEffect } from "react";
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
import { Calendar as CalendarIcon, Upload, X, Lightbulb } from "lucide-react";
import Progress from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  dob: Date | null;
  gender: string;
  contactNumber: string;
  email: string;
  address: string;
  // Professional Information
  licenseNumber: string;
  licenseExpiration: Date | null;
  yearsOfExperience: number;
  education: string;
  specializations: string[];
  skills: string[];
  languages: string[];
  shiftPreferences: string[];
  // Work Experience
  experiences: Experience[];
  // Documents
  resume: FileList;
  license: FileList;
  certifications: FileList;
  otherDocuments: FileList;
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
  const [profileCompletion, setProfileCompletion] = useState(0); // Example value
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [initialData, setInitialData] = useState<FormData | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
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

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/nurse/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Include authorization header if using JWT stored in localStorage or cookies
            // "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setInitialData(data);
          populateForm(data);
          setIsLoading(false); // Data fetched, stop loading
        } else {
          console.error("Failed to fetch profile data");
          setIsLoading(false); // Even on failure, stop loading
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setIsLoading(false); // Stop loading on error
      }
    };

    fetchProfile();
  }, []);

  const populateForm = (data: any) => {
    // Prepare the data for resetting the form
    const formValues = {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      dob: data.dob ? new Date(data.dob) : null,
      gender: data.gender || "",
      contactNumber: data.contactNumber || "",
      email: data.email || "",
      address: data.address || "",
      licenseNumber: data.licenseNumber || "",
      licenseExpiration: data.licenseExpiration
        ? new Date(data.licenseExpiration)
        : null,
      yearsOfExperience: data.yearsOfExperience || 0,
      education: data.education || "",
      specializations: data.specializations || [],
      skills: data.skills || [], // Corrected line
      languages: data.languages || [],
      shiftPreferences: data.shiftPreferences || [],
      experiences: data.experiences
        ? data.experiences.map((exp: any) => ({
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

    // Reset the form with the prepared values
    reset(formValues);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append personal and professional information
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("dob", data.dob ? data.dob.toISOString() : "");
      formData.append("gender", data.gender);
      formData.append("contactNumber", data.contactNumber);
      formData.append("email", data.email);
      formData.append("address", data.address);
      formData.append("licenseNumber", data.licenseNumber);
      formData.append(
        "licenseExpiration",
        data.licenseExpiration ? data.licenseExpiration.toISOString() : ""
      );
      formData.append("yearsOfExperience", data.yearsOfExperience.toString());
      formData.append("education", data.education);
      formData.append("specializations", JSON.stringify(data.specializations));
      formData.append("skills", JSON.stringify(data.skills));
      formData.append("languages", JSON.stringify(data.languages));
      formData.append(
        "shiftPreferences",
        JSON.stringify(data.shiftPreferences)
      );

      // Append experiences
      data.experiences.forEach((exp, index) => {
        formData.append(
          `experiences[${index}][facilityName]`,
          exp.facilityName
        );
        formData.append(`experiences[${index}][position]`, exp.position);
        formData.append(`experiences[${index}][department]`, exp.department);
        formData.append(
          `experiences[${index}][startDate]`,
          exp.startDate ? exp.startDate.toISOString() : ""
        );
        formData.append(
          `experiences[${index}][endDate]`,
          exp.endDate ? exp.endDate.toISOString() : ""
        );
        formData.append(
          `experiences[${index}][responsibilities]`,
          exp.responsibilities
        );
      });

      // Append files
      if (data.resume && data.resume.length > 0) {
        formData.append("resume", data.resume[0]);
      }
      if (data.license && data.license.length > 0) {
        formData.append("license", data.license[0]);
      }
      if (data.certifications && data.certifications.length > 0) {
        Array.from(data.certifications).forEach((file) => {
          formData.append("certifications", file);
        });
      }
      if (data.otherDocuments && data.otherDocuments.length > 0) {
        Array.from(data.otherDocuments).forEach((file) => {
          formData.append("otherDocuments", file);
        });
      }

      const response = await fetch("/api/nurse/me", {
        method: "POST",
        body: formData,
        // If using JWT stored in cookies, it will be sent automatically.
        // If stored elsewhere, include it in headers.
        // headers: {
        //   "Authorization": `Bearer ${token}`,
        // },
      });

      if (response.ok) {
        setSubmitSuccess(true);
        // Optionally, refetch profile data
      } else {
        const errorData = await response.json();
        console.error("Failed to update profile:", errorData.message);
        // Optionally, set an error state to display an error message
      }
    } catch (error) {
      console.error("Submission Error:", error);
      // Optionally, set an error state to display an error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Watch form fields to calculate profile completion dynamically (optional)
  const watchAllFields = watch();

  useEffect(() => {
    // Example logic to calculate profile completion
    let completed = 0;
    const totalFields = 10; // Adjust based on actual fields

    if (watchAllFields.firstName) completed += 1;
    if (watchAllFields.lastName) completed += 1;
    if (watchAllFields.dob) completed += 1;
    if (watchAllFields.gender) completed += 1;
    if (watchAllFields.contactNumber) completed += 1;
    if (watchAllFields.email) completed += 1;
    if (watchAllFields.address) completed += 1;
    if (watchAllFields.licenseNumber) completed += 1;
    if (watchAllFields.licenseExpiration) completed += 1;
    if (watchAllFields.yearsOfExperience) completed += 1;

    setProfileCompletion(Math.min((completed / totalFields) * 100, 100));
  }, [watchAllFields]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        role="nurse"
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
                  <span className="text-sm text-gray-700">
                    {profileCompletion}% Complete
                  </span>
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

                    {/* Text and Button */}
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">
                        Complete Your Profile
                      </h2>
                      <p className="text-sm mt-1">
                        Completing your profile helps us match you with the best
                        job opportunities!
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
            {isLoading ? (
              <div className="space-y-6">
                {/* Skeletons for Personal Information */}
                <Card className="shadow-md animate-pulse">
                  <CardHeader>
                    <CardTitle className="h-6 bg-gray-300 rounded w-1/3"></CardTitle>
                    <CardDescription className="h-4 bg-gray-300 rounded w-1/2 mt-2"></CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Profile Picture Skeleton */}
                    <div className="flex items-center space-x-6">
                      <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>

                    {/* Form Fields Skeleton */}
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

                {/* Skeletons for Documents */}
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
                    <CardDescription>
                      Provide your basic personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                      <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img
                          src={initialData?.profilePictureUrl || "/avatar.jpg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <label htmlFor="profilePicture">
                          <Button
                            type="button"
                            variant="outline"
                            className="flex items-center"
                          >
                            <Upload className="mr-2 h-4 w-4" /> Upload Picture
                          </Button>
                        </label>
                        {/* Hidden File Input */}
                        <input
                          id="profilePicture"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              // Preview the selected image
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                // Optionally, handle preview
                              };
                              reader.readAsDataURL(e.target.files[0]);
                            }
                          }}
                        />
                      </div>
                    </div>

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
                                  {field.value
                                    ? format(field.value, "PPP")
                                    : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={field.value ?? undefined}
                                  onSelect={field.onChange}
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
                              value={field.value} // Use value instead of defaultValue
                              onValueChange={(value) => field.onChange(value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
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
                          placeholder="+1 (555) 123-4567"
                          {...register("contactNumber", {
                            required: "Contact number is required",
                            // pattern: {
                            //   value: /^\+?[1-9]\d{1,14}$/,
                            //   message: "Invalid phone number",
                            // },
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

                    {/* Address */}
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        placeholder="123 Main St, Springfield, USA"
                        {...register("address")}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Information */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                    <CardDescription>
                      Provide details about your nursing career
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* License Number and Expiration */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="licenseNumber">
                          Nursing License Number
                        </Label>
                        <Input
                          id="licenseNumber"
                          placeholder="ABC123456"
                          {...register("licenseNumber", {
                            required: "License number is required",
                          })}
                          className="mt-1"
                        />
                        {errors.licenseNumber && (
                          <span className="text-red-500 text-sm">
                            {errors.licenseNumber.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="licenseExpiration">
                          License Expiration Date
                        </Label>
                        <Controller
                          control={control}
                          name="licenseExpiration"
                          rules={{
                            required: "License expiration date is required",
                          }}
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
                                  {field.value
                                    ? format(field.value, "PPP")
                                    : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={field.value ?? undefined}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          )}
                        />
                        {errors.licenseExpiration && (
                          <span className="text-red-500 text-sm">
                            {errors.licenseExpiration.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Years of Experience */}
                    <div>
                      <Label htmlFor="yearsOfExperience">
                        Years of Experience
                      </Label>
                      <Input
                        id="yearsOfExperience"
                        type="number"
                        min="0"
                        placeholder="5"
                        {...register("yearsOfExperience", {
                          required: "Years of experience is required",
                          min: {
                            value: 0,
                            message: "Experience cannot be negative",
                          },
                        })}
                        className="mt-1"
                      />
                      {errors.yearsOfExperience && (
                        <span className="text-red-500 text-sm">
                          {errors.yearsOfExperience.message}
                        </span>
                      )}
                    </div>

                    {/* Education Level */}
                    <div>
                      <Label htmlFor="education">Highest Education Level</Label>
                      <Controller
                        control={control}
                        name="education"
                        rules={{ required: "Education level is required" }}
                        render={({ field }) => (
                          <Select
                            value={field.value} // Use value instead of defaultValue
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select education level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Diploma">Diploma</SelectItem>
                              <SelectItem value="Associate">
                                Associate Degree
                              </SelectItem>
                              <SelectItem value="Bachelor">
                                Bachelor's Degree
                              </SelectItem>
                              <SelectItem value="Master">
                                Master's Degree
                              </SelectItem>
                              <SelectItem value="Doctorate">
                                Doctorate
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.education && (
                        <span className="text-red-500 text-sm">
                          {errors.education.message}
                        </span>
                      )}
                    </div>

                    {/* Specializations */}
                    <div>
                      <Label>Specializations</Label>
                      <Controller
                        control={control}
                        name="specializations"
                        render={({ field }) => (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                            {[
                              "ICU",
                              "ER",
                              "Pediatrics",
                              "Surgical",
                              "Oncology",
                              "Geriatrics",
                            ].map((spec) => (
                              <div
                                key={spec}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={spec}
                                  checked={field.value?.includes(spec)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, spec]);
                                    } else {
                                      field.onChange(
                                        field.value.filter(
                                          (item) => item !== spec
                                        )
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor={spec}>{spec}</Label>
                              </div>
                            ))}
                          </div>
                        )}
                      />
                    </div>

                    {/* Skills */}
                    <div>
                      <Label>Skills</Label>
                      <Controller
                        control={control}
                        name="skills"
                        render={({ field }) => (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                            {[
                              "ICU Experience",
                              "Pediatric Care",
                              "Emergency Response",
                              "Phlebotomy",
                              "Medication Administration",
                              "Patient Assessment",
                              "Wound Care",
                              "IV Therapy",
                              "Electronic Medical Records (EMR)",
                              "Geriatric Care",
                              "Neonatal Care",
                              "Surgical Assistance",
                              "Cardiac Care",
                              "Oncology Nursing",
                              "Mental Health Nursing",
                            ].map((skill) => (
                              <div
                                key={skill}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={skill}
                                  checked={field.value?.includes(skill)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, skill]);
                                    } else {
                                      field.onChange(
                                        field.value.filter(
                                          (item) => item !== skill
                                        )
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor={skill}>{skill}</Label>
                              </div>
                            ))}
                          </div>
                        )}
                      />
                    </div>

                    {/* Languages Spoken */}
                    <div>
                      <Label>Languages Spoken</Label>
                      <Controller
                        control={control}
                        name="languages"
                        render={({ field }) => (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                            {["English", "Mandarin", "Malay", "Tamil"].map(
                              (lang) => (
                                <div
                                  key={lang}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={lang}
                                    checked={field.value?.includes(lang)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, lang]);
                                      } else {
                                        field.onChange(
                                          field.value.filter(
                                            (item) => item !== lang
                                          )
                                        );
                                      }
                                    }}
                                  />
                                  <Label htmlFor={lang}>{lang}</Label>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      />
                    </div>

                    {/* Shift Preferences */}
                    <div>
                      <Label>Shift Preferences</Label>
                      <Controller
                        control={control}
                        name="shiftPreferences"
                        render={({ field }) => (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                            {[
                              "Day Shift",
                              "Night Shift",
                              "Weekends",
                              "Overtime",
                            ].map((shift) => (
                              <div
                                key={shift}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={shift}
                                  checked={field.value?.includes(shift)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, shift]);
                                    } else {
                                      field.onChange(
                                        field.value.filter(
                                          (item) => item !== shift
                                        )
                                      );
                                    }
                                  }}
                                />
                                <Label htmlFor={shift}>{shift}</Label>
                              </div>
                            ))}
                          </div>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Work Experience */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Work Experience</CardTitle>
                    <CardDescription>
                      Add your previous work experiences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {fields.map((item, index) => (
                      <div
                        key={item.id}
                        className="space-y-4 border p-4 rounded-md"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">
                            Experience {index + 1}
                          </h3>
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
                            <Label
                              htmlFor={`experiences.${index}.facilityName`}
                            >
                              Facility Name
                            </Label>
                            <Input
                              id={`experiences.${index}.facilityName`}
                              placeholder="Hospital ABC"
                              {...register(
                                `experiences.${index}.facilityName` as const,
                                {
                                  required: "Facility name is required",
                                }
                              )}
                              className="mt-1"
                            />
                            {errors.experiences?.[index]?.facilityName && (
                              <span className="text-red-500 text-sm">
                                {
                                  errors.experiences[index].facilityName
                                    ?.message
                                }
                              </span>
                            )}
                          </div>
                          <div>
                            <Label htmlFor={`experiences.${index}.position`}>
                              Position/Title
                            </Label>
                            <Input
                              id={`experiences.${index}.position`}
                              placeholder="Registered Nurse"
                              {...register(
                                `experiences.${index}.position` as const,
                                {
                                  required: "Position is required",
                                }
                              )}
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
                            <Label htmlFor={`experiences.${index}.department`}>
                              Department
                            </Label>
                            <Input
                              id={`experiences.${index}.department`}
                              placeholder="Pediatrics"
                              {...register(
                                `experiences.${index}.department` as const
                              )}
                              className="mt-1"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`experiences.${index}.startDate`}>
                                Start Date
                              </Label>
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
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value
                                          ? format(field.value, "PPP")
                                          : "Pick a date"}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <Calendar
                                        mode="single"
                                        selected={field.value ?? undefined}
                                        onSelect={field.onChange}
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
                              <Label htmlFor={`experiences.${index}.endDate`}>
                                End Date
                              </Label>
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
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value
                                          ? format(field.value, "PPP")
                                          : "Pick a date"}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <Calendar
                                        mode="single"
                                        selected={field.value ?? undefined}
                                        onSelect={field.onChange}
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
                          <Label
                            htmlFor={`experiences.${index}.responsibilities`}
                          >
                            Responsibilities/Duties
                          </Label>
                          <Textarea
                            id={`experiences.${index}.responsibilities`}
                            placeholder="Describe your responsibilities..."
                            {...register(
                              `experiences.${index}.responsibilities` as const
                            )}
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

                {/* Documents */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>
                      Upload your necessary documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Resume/CV */}
                    <div>
                      <Label htmlFor="resume">Resume/CV</Label>
                      <Input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        // {...register("resume", {
                        //   required: "Resume is required",
                        // })}
                        className="mt-1"
                      />
                      {errors.resume && (
                        <span className="text-red-500 text-sm">
                          {errors.resume.message}
                        </span>
                      )}
                    </div>

                    {/* Nursing License */}
                    <div>
                      <Label htmlFor="license">Nursing License Copy</Label>
                      <Input
                        id="license"
                        type="file"
                        accept=".pdf,.jpg,.png"
                        // {...register("license", {
                        //   required: "License copy is required",
                        // })}
                        className="mt-1"
                      />
                      {errors.license && (
                        <span className="text-red-500 text-sm">
                          {errors.license.message}
                        </span>
                      )}
                    </div>

                    {/* Certifications */}
                    <div>
                      <Label htmlFor="certifications">Certifications</Label>
                      <Input
                        id="certifications"
                        type="file"
                        accept=".pdf,.jpg,.png"
                        multiple
                        {...register("certifications")}
                        className="mt-1"
                      />
                    </div>

                    {/* Other Documents */}
                    <div>
                      <Label htmlFor="otherDocuments">
                        Other Relevant Documents
                      </Label>
                      <Input
                        id="otherDocuments"
                        type="file"
                        accept=".pdf,.jpg,.png"
                        multiple
                        {...register("otherDocuments")}
                        className="mt-1"
                      />
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
