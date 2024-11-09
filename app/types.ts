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

// Define the type for creating a job (excluding certain fields)
export type CreateJobData = Omit<
  Job,
  "id" | "status" | "applicants" | "createdAt" | "updatedAt"
>;
