'use client'

import React, { useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft, Upload, X } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Define the form schema
const formSchema = z.object({
  // Personal Information
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phoneNumber: z.string().min(8, { message: "Phone number must be at least 8 characters." }),
  address: z.object({
    street: z.string().min(1, { message: "Street address is required." }),
    city: z.string().min(1, { message: "City is required." }),
    state: z.string().min(1, { message: "State/Province is required." }),
    postalCode: z.string().min(1, { message: "Postal code is required." }),
    country: z.string().min(1, { message: "Country is required." }),
  }),
  dateOfBirth: z.date({
    required_error: "Date of birth is required.",
    invalid_type_error: "That's not a valid date!",
  }),

  // Professional Summary
  aboutMe: z.string().max(250, { message: "About me must not exceed 250 characters." }),

  // Licenses and Certifications
  nursingLicense: z.object({
    number: z.string().min(1, { message: "License number is required." }),
    authority: z.string().min(1, { message: "Issuing authority is required." }),
    expirationDate: z.date({
      required_error: "Expiration date is required.",
      invalid_type_error: "That's not a valid date!",
    }),
  }),
  certifications: z.array(
    z.object({
      name: z.string().min(1, { message: "Certification name is required." }),
      organization: z.string().min(1, { message: "Issuing organization is required." }),
      issueDate: z.date({
        required_error: "Issue date is required.",
        invalid_type_error: "That's not a valid date!",
      }),
      expirationDate: z.date().optional(),
    })
  ),

  // Education
  education: z.array(
    z.object({
      degree: z.string().min(1, { message: "Degree is required." }),
      fieldOfStudy: z.string().min(1, { message: "Field of study is required." }),
      institution: z.string().min(1, { message: "Institution name is required." }),
      graduationDate: z.date({
        required_error: "Graduation date is required.",
        invalid_type_error: "That's not a valid date!",
      }),
    })
  ),

  // Work Experience
  workExperience: z.array(
    z.object({
      jobTitle: z.string().min(1, { message: "Job title is required." }),
      employer: z.string().min(1, { message: "Employer name is required." }),
      employmentType: z.enum(["Full-time", "Part-time", "Contract"]),
      startDate: z.date({
        required_error: "Start date is required.",
        invalid_type_error: "That's not a valid date!",
      }),
      endDate: z.date().optional(),
      responsibilities: z.string().min(1, { message: "Responsibilities are required." }),
      reference: z.object({
        name: z.string().optional(),
        position: z.string().optional(),
        contact: z.string().optional(),
      }).optional(),
    })
  ),

  // Skills and Specializations
  skills: z.array(z.string()).min(1, { message: "At least one skill is required." }),
  specializations: z.array(z.string()).min(1, { message: "At least one specialization is required." }),
  procedures: z.array(z.string()),

  // Language Proficiency
  languages: z.array(
    z.object({
      language: z.string().min(1, { message: "Language is required." }),
      proficiency: z.enum(["Basic", "Conversational", "Fluent", "Native"]),
    })
  ),

  // Availability
  preferredShifts: z.array(z.enum(["Morning", "Afternoon", "Night", "Weekends", "Holidays"])),
  willingToRelocate: z.boolean(),

  // Preferences
  preferredUnits: z.array(z.string()).min(1, { message: "At least one preferred unit is required." }),
  preferredPatientPopulations: z.array(z.string()).min(1, { message: "At least one patient population preference is required." }),

  // Compliance and Documentation
  backgroundCheckAuthorized: z.boolean(),
  immunizationRecords: z.any(), // This would typically be a file upload
  cprCertification: z.object({
    expirationDate: z.date({
      required_error: "CPR certification expiration date is required.",
      invalid_type_error: "That's not a valid date!",
    }),
  }),

  // References
  references: z.array(
    z.object({
      name: z.string().min(1, { message: "Reference name is required." }),
      relationship: z.string().min(1, { message: "Relationship is required." }),
      contact: z.string().min(1, { message: "Contact information is required." }),
    })
  ),
})

type FormValues = z.infer<typeof formSchema>

export function NurseProfile() {
  const [activeTab, setActiveTab] = useState("personal-info")
  const [profileCompletion, setProfileCompletion] = useState(0)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      address: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Singapore",
      },
      dateOfBirth: undefined,
      aboutMe: "",
      nursingLicense: {
        number: "",
        authority: "",
        expirationDate: undefined,
      },
      certifications: [],
      education: [],
      workExperience: [],
      skills: [],
      specializations: [],
      procedures: [],
      languages: [],
      preferredShifts: [],
      willingToRelocate: false,
      preferredUnits: [],
      preferredPatientPopulations: [],
      backgroundCheckAuthorized: false,
      immunizationRecords: null,
      cprCertification: {
        expirationDate: undefined,
      },
      references: [],
    },
  })

  const { fields: certificationFields, append: appendCertification } = useFieldArray({
    control: form.control,
    name: "certifications",
  })

  const { fields: educationFields, append: appendEducation } = useFieldArray({
    control: form.control,
    name: "education",
  })

  const { fields: workExperienceFields, append: appendWorkExperience } = useFieldArray({
    control: form.control,
    name: "workExperience",
  })

  const { fields: languageFields, append: appendLanguage } = useFieldArray({
    control: form.control,
    name: "languages",
  })

  const { fields: referenceFields, append: appendReference } = useFieldArray({
    control: form.control,
    name: "references",
  })

  function onSubmit(data: FormValues) {
    console.log(data)
    // Here you would typically send the data to your backend
  }

  const updateProfileCompletion = () => {
    const totalFields = Object.keys(form.getValues()).length
    const filledFields = Object.values(form.getValues()).filter(value => value !== undefined && value !== "").length
    setProfileCompletion((filledFields / totalFields) * 100)
  }

  React.useEffect(() => {
    const subscription = form.watch(() => updateProfileCompletion())
    return () => subscription.unsubscribe()
  }, [form.watch])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-[#9d2235]">Nurse Profile</h1>
      <Progress value={profileCompletion} className="mb-4" />
      <p className="mb-6">Profile Completion: {profileCompletion.toFixed(0)}%</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
              <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal-info">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Provide your basic personal details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+65 1234 5678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Singapore" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input  placeholder="Central Region" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="address.postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="123456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address.country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Singapore">Singapore</SelectItem>
                              <SelectItem value="Malaysia">Malaysia</SelectItem>
                              <SelectItem value="Indonesia">Indonesia</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="button" onClick={() => setActiveTab("qualifications")}>Next</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="qualifications">
              <Card>
                <CardHeader>
                  <CardTitle>Qualifications</CardTitle>
                  <CardDescription>Enter your professional qualifications and certifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nursingLicense.number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nursing License Number</FormLabel>
                        <FormControl>
                          <Input placeholder="License Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nursingLicense.authority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issuing Authority</FormLabel>
                        <FormControl>
                          <Input placeholder="Issuing Authority" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nursingLicense.expirationDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>License Expiration Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Certifications</h4>
                    {certificationFields.map((field, index) => (
                      <div key={field.id} className="space-y-4 mb-4 p-4 border rounded">
                        <FormField
                          control={form.control}
                          name={`certifications.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Certification Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`certifications.${index}.organization`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Issuing Organization</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`certifications.${index}.issueDate`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Issue Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date()
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => appendCertification({ name: "", organization: "", issueDate: new Date() })}
                    >
                      Add Certification
                    </Button>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Education</h4>
                    {educationFields.map((field, index) => (
                      <div key={field.id} className="space-y-4 mb-4 p-4 border rounded">
                        <FormField
                          control={form.control}
                          name={`education.${index}.degree`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Degree</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`education.${index}.fieldOfStudy`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Field of Study</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`education.${index}.institution`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Institution</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`education.${index}.graduationDate`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Graduation Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-[240px] pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date()
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => appendEducation({ degree: "", fieldOfStudy: "", institution: "", graduationDate: new Date() })}
                    >
                      Add Education
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("personal-info")}>Previous</Button>
                  <Button type="button" onClick={() => setActiveTab("experience")}>Next</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="experience">
              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                  <CardDescription>Provide details about your work history.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {workExperienceFields.map((field, index) => (
                    <div key={field.id} className="space-y-4 mb-4 p-4 border rounded">
                      <FormField
                        control={form.control}
                        name={`workExperience.${index}.jobTitle`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`workExperience.${index}.employer`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Employer</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`workExperience.${index}.employmentType`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Employment Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select employment type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Full-time">Full-time</SelectItem>
                                <SelectItem value="Part-time">Part-time</SelectItem>
                                <SelectItem value="Contract">Contract</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`workExperience.${index}.startDate`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-[240px] pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date()
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`workExperience.${index}.endDate`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>End Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-[240px] pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date()
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`workExperience.${index}.responsibilities`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Responsibilities</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => appendWorkExperience({ jobTitle: "", employer: "", employmentType: "Full-time", startDate: new Date(), responsibilities: "" })}
                  >
                    Add Work Experience
                  </Button>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("qualifications")}>Previous</Button>
                  <Button type="button" onClick={() => setActiveTab("preferences")}>Next</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Set your work preferences and availability.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="preferredShifts"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Preferred Shifts</FormLabel>
                          <FormDescription>
                            Select your preferred work shifts.
                          </FormDescription>
                        </div>
                        {["Morning", "Afternoon", "Night", "Weekends", "Holidays"].map((item) => (
                          <FormField
                            key={item}
                            control={form.control}
                            name="preferredShifts"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="willingToRelocate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Willing to Relocate
                          </FormLabel>
                          <FormDescription>
                            Check this if you're open to relocation opportunities.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferredUnits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Units</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange([...field.value, value])}
                            value={field.value[field.value.length - 1]}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select preferred units" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ICU">ICU</SelectItem>
                              <SelectItem value="ER">ER</SelectItem>
                              <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                              <SelectItem value="Surgery">Surgery</SelectItem>
                              <SelectItem value="Oncology">Oncology</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value.map((unit, index) => (
                            <Badge key={index} variant="secondary">
                              {unit}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="ml-2 h-auto p-0 text-base"
                                onClick={() => {
                                  const newValue = [...field.value];
                                  newValue.splice(index, 1);
                                  field.onChange(newValue);
                                }}
                              >
                                &times;
                              </Button>
                            </Badge>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferredPatientPopulations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Patient Populations</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange([...field.value, value])}
                            value={field.value[field.value.length - 1]}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select patient populations" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Neonatal">Neonatal</SelectItem>
                              <SelectItem value="Pediatric">Pediatric</SelectItem>
                              <SelectItem value="Adult">Adult</SelectItem>
                              <SelectItem value="Geriatric">Geriatric</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value.map((population, index) => (
                            <Badge key={index} variant="secondary">
                              {population}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="ml-2 h-auto p-0 text-base"
                                onClick={() => {
                                  const newValue = [...field.value];
                                  newValue.splice(index, 1);
                                  field.onChange(newValue);
                                }}
                              >
                                &times;
                              </Button>
                            </Badge>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("experience")}>Previous</Button>
                  <Button type="button" onClick={() => setActiveTab("compliance")}>Next</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="compliance">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance and Documentation</CardTitle>
                  <CardDescription>Provide necessary compliance information and documentation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="backgroundCheckAuthorized"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Authorize Background Check
                          </FormLabel>
                          <FormDescription>
                            I authorize Farrer Park Hospital to conduct a background check.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="immunizationRecords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Immunization Records</FormLabel>
                        <FormControl>
                          <Input type="file" {...field} value={field.value?.fileName} />
                        </FormControl>
                        <FormDescription>
                          Upload your immunization records (PDF or image format).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cprCertification.expirationDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>CPR Certification Expiration Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Enter the expiration date of your CPR certification.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {referenceFields.map((field, index) => (
                    <div key={field.id} className="space-y-4 mb-4 p-4 border rounded">
                      <FormField
                        control={form.control}
                        name={`references.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reference Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`references.${index}.relationship`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Relationship</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`references.${index}.contact`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Information</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => appendReference({ name: "", relationship: "", contact: "" })}
                  >
                    Add Reference
                  </Button>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("preferences")}>Previous</Button>
                  <Button type="submit">Submit Profile</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  )
}