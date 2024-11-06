// NurseProfilePageComponent.tsx

"use client";

import React, { useState } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload, X, Lightbulb } from "lucide-react";
import Progress from "@/components/ui/progress";

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
  const profileCompletion = 60
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
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

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Here you would typically send the data to your backend
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600 mb-6">
              Complete your profile to get the best job matches.
            </p>

            {/* Enhanced Profile Completion Prompt */}
            {profileCompletion < 100 && (
              <div className="mb-6">
                <Card className="bg-[#9d2235] text-white">
                  <CardContent className="flex flex-col md:flex-row md:items-center p-6">
                    {/* Icon */}
                    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                      <Lightbulb size={48} />
                    </div>

                    {/* Text and Button Wrapper */}
                    <div className="flex-1">
                      {/* Text Content */}
                      <h2 className="text-lg font-semibold mb-2">
                        Complete Your Profile
                      </h2>
                      <p className="text-sm mb-4">
                        Your profile is <strong>{profileCompletion}%</strong>{" "}
                        complete. Completing your profile helps us match you
                        with the best job opportunities!
                      </p>
                      <Progress
                        value={profileCompletion}
                        accentColor="#fff"
                        trackColor="rgba(255,255,255,0.3)"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Personal Information */}
              <Card className="mt-6 shadow-md">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Provide your basic personal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                    <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src="/avatar.jpg"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" /> Upload Picture
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...register("firstName", { required: true })}
                      />
                      {errors.firstName && (
                        <span className="text-red-500 text-sm">
                          This field is required
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...register("lastName", { required: true })}
                      />
                      {errors.lastName && (
                        <span className="text-red-500 text-sm">
                          This field is required
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Controller
                        control={control}
                        name="dob"
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
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
                          This field is required
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Controller
                        control={control}
                        name="gender"
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.gender && (
                        <span className="text-red-500 text-sm">
                          This field is required
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactNumber">Contact Number</Label>
                      <Input
                        id="contactNumber"
                        {...register("contactNumber", { required: true })}
                      />
                      {errors.contactNumber && (
                        <span className="text-red-500 text-sm">
                          This field is required
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email", { required: true })}
                        readOnly
                        className="bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" {...register("address")} />
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card className="mt-6 shadow-md">
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>
                    Provide details about your nursing career
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">
                      Nursing License Number
                    </Label>
                    <Input
                      id="licenseNumber"
                      {...register("licenseNumber", { required: true })}
                    />
                    {errors.licenseNumber && (
                      <span className="text-red-500 text-sm">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseExpiration">
                      License Expiration Date
                    </Label>
                    <Controller
                      control={control}
                      name="licenseExpiration"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
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
                        This field is required
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">
                      Years of Experience
                    </Label>
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      {...register("yearsOfExperience", {
                        required: true,
                        min: 0,
                      })}
                    />
                    {errors.yearsOfExperience && (
                      <span className="text-red-500 text-sm">
                        Please enter a valid number
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="education">Highest Education Level</Label>
                    <Controller
                      control={control}
                      name="education"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="diploma">Diploma</SelectItem>
                            <SelectItem value="associate">
                              Associate Degree
                            </SelectItem>
                            <SelectItem value="bachelor">
                              Bachelor's Degree
                            </SelectItem>
                            <SelectItem value="master">
                              Master's Degree
                            </SelectItem>
                            <SelectItem value="doctorate">Doctorate</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.education && (
                      <span className="text-red-500 text-sm">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Specializations</Label>
                    <Controller
                      control={control}
                      name="specializations"
                      render={({ field }) => (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                                    field.onChange([
                                      ...(field.value || []),
                                      spec,
                                    ]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter(
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
                  <div className="space-y-2">
                    <Label>Skills and Certifications</Label>
                    <Controller
                      control={control}
                      name="skills"
                      render={({ field }) => (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {[
                            "ACLS",
                            "BLS",
                            "PALS",
                            "Critical Care",
                            "Wound Care",
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
                                    field.onChange([
                                      ...(field.value || []),
                                      skill,
                                    ]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter(
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
                  <div className="space-y-2">
                    <Label>Languages Spoken</Label>
                    <Controller
                      control={control}
                      name="languages"
                      render={({ field }) => (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                                      field.onChange([
                                        ...(field.value || []),
                                        lang,
                                      ]);
                                    } else {
                                      field.onChange(
                                        field.value?.filter(
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
                  <div className="space-y-2">
                    <Label>Shift Preferences</Label>
                    <Controller
                      control={control}
                      name="shiftPreferences"
                      render={({ field }) => (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                                    field.onChange([
                                      ...(field.value || []),
                                      shift,
                                    ]);
                                  } else {
                                    field.onChange(
                                      field.value?.filter(
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
              <Card className="mt-6 shadow-md">
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                  <CardDescription>
                    Add your previous work experiences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {fields.map((item, index) => (
                    <div key={item.id} className="space-y-4 border-b pb-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">
                          Experience {index + 1}
                        </h3>
                        {fields.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                          >
                            <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`experiences.${index}.facilityName`}>
                          Facility Name
                        </Label>
                        <Input
                          id={`experiences.${index}.facilityName`}
                          {...register(
                            `experiences.${index}.facilityName` as const,
                            { required: true }
                          )}
                        />
                        {errors.experiences?.[index]?.facilityName && (
                          <span className="text-red-500 text-sm">
                            This field is required
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`experiences.${index}.position`}>
                          Position/Title
                        </Label>
                        <Input
                          id={`experiences.${index}.position`}
                          {...register(
                            `experiences.${index}.position` as const,
                            { required: true }
                          )}
                        />
                        {errors.experiences?.[index]?.position && (
                          <span className="text-red-500 text-sm">
                            This field is required
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`experiences.${index}.department`}>
                          Department
                        </Label>
                        <Input
                          id={`experiences.${index}.department`}
                          {...register(
                            `experiences.${index}.department` as const
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor={`experiences.${index}.startDate`}>
                            Start Date
                          </Label>
                          <Controller
                            control={control}
                            name={`experiences.${index}.startDate`}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
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
                              This field is required
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`experiences.${index}.endDate`}>
                            End Date
                          </Label>
                          <Controller
                            control={control}
                            name={`experiences.${index}.endDate`}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
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
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor={`experiences.${index}.responsibilities`}
                        >
                          Responsibilities/Duties
                        </Label>
                        <Textarea
                          id={`experiences.${index}.responsibilities`}
                          {...register(
                            `experiences.${index}.responsibilities` as const
                          )}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full"
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
                </CardContent>
              </Card>

              {/* Documents */}
              <Card className="mt-6 shadow-md">
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    Upload your necessary documents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume/CV</Label>
                    <Input
                      id="resume"
                      type="file"
                      {...register("resume", { required: true })}
                    />
                    {errors.resume && (
                      <span className="text-red-500 text-sm">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license">Nursing License Copy</Label>
                    <Input
                      id="license"
                      type="file"
                      {...register("license", { required: true })}
                    />
                    {errors.license && (
                      <span className="text-red-500 text-sm">
                        This field is required
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certifications">Certifications</Label>
                    <Input
                      id="certifications"
                      type="file"
                      multiple
                      {...register("certifications")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otherDocuments">
                      Other Relevant Documents
                    </Label>
                    <Input
                      id="otherDocuments"
                      type="file"
                      multiple
                      {...register("otherDocuments")}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NurseProfilePageComponent;
