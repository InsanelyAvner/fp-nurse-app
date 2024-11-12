// File: /app/types.ts

export interface Job {
  id: number;
  title: string;
  facility: string;
  department: string;
  shiftType: string;
  status: "ACTIVE" | "CLOSED" | "DRAFT";
  applicants: number;
  date: string; // ISO date string
  time: string;
  payRate: string;
  urgent: boolean;
  requiredSkills: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Applicant {
  id: number;
  name: string;
  email: string;
  profileImage: string;
  matchingScore: number;
  keySkills: string[];
  experience: number; // in years
  certifications: string[];
  bio: string;
}

// Define the type for creating a job (excluding certain fields)
export type CreateJobData = Omit<
  Job,
  "id" | "status" | "applicants" | "createdAt" | "updatedAt"
>;
