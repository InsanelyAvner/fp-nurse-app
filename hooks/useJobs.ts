// File: /app/hooks/useJobs.ts

import { useState, useEffect, useContext } from "react";
import { LoadingContext } from "@/app/context/LoadingContext";
import { toast } from "react-toastify";

interface Job {
  id: number;
  title: string;
  facility: string;
  department: string;
  shiftType: string;
  status: "ACTIVE" | "CLOSED" | "DRAFT";
  applicants: number;
  date: string;
  time: string;
  payRate: string;
  urgent: boolean;
  requiredSkills: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

const useJobs = () => {
  const { isLoading, startLoading, stopLoading } = useContext(LoadingContext);
  const [jobs, setJobs] = useState<Job[] | null>(null);

  const fetchJobs = async () => {
    startLoading();
    try {
      const response = await fetch("/api/jobs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data: Job[] = await response.json();
      setJobs(data);
    } catch (error) {
      console.error(error);
      console.log("Failed to load jobs.");
      setJobs([]);
    } finally {
      stopLoading();
    }
  };

  const createJob = async (jobData: Omit<Job, "id" | "status" | "applicants" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error("Failed to create job");
      }

      const newJob: Job = await response.json();
      setJobs((prevJobs) => [newJob, ...(prevJobs || [])]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateJob = async (updatedJob: Job) => {
    try {
      const response = await fetch(`/api/jobs/${updatedJob.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedJob),
      });

      if (!response.ok) {
        throw new Error("Failed to update job");
      }

      const data: Job = await response.json();
      setJobs((prevJobs) => (prevJobs ? prevJobs.map((job) => (job.id === data.id ? data : job)) : []));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteJob = async (jobId: number) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      setJobs((prevJobs) => (prevJobs ? prevJobs.filter((job) => job.id !== jobId) : []));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { jobs, isLoading, fetchJobs, createJob, updateJob, deleteJob };
};

export default useJobs;
