// File: /app/hooks/useJobSearch.ts

import { useState, useEffect, useContext, useCallback } from "react";
import { LoadingContext } from "@/app/context/LoadingContext";
import { toast } from "react-toastify";

export interface Job {
  id: number;
  title: string;
  facility: string;
  date: string;
  time: string;
  payRate: string;
  urgent: boolean;
  requiredSkills: string[];
  shiftType: string;
  department: string;
}

interface UseJobSearchReturn {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  selectedShift: string;
  setSelectedShift: React.Dispatch<React.SetStateAction<string>>;
  selectedDepartment: string;
  setSelectedDepartment: React.Dispatch<React.SetStateAction<string>>;
  selectedPayRate: string;
  setSelectedPayRate: React.Dispatch<React.SetStateAction<string>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  paginatedJobs: Job[];
  isLoading: boolean;
  resetFilters: () => void;
}

const JOBS_PER_PAGE = 9;

const useJobSearch = (): UseJobSearchReturn => {
  const { isLoading, startLoading, stopLoading } = useContext(LoadingContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedShift, setSelectedShift] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedPayRate, setSelectedPayRate] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [jobListings, setJobListings] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedShift, selectedDepartment, selectedPayRate]);

  // Fetch jobs when component mounts
  const fetchJobs = useCallback(async () => {
    startLoading();
    try {
      const hideAppliedJobs = false; // Adjust based on requirements

      const response = await fetch(`/api/jobs?hideAppliedJobs=${hideAppliedJobs}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch job listings");
      }

      const data: Job[] = await response.json();
      setJobListings(data);
      setFilteredJobs(data);
      setTotalPages(Math.ceil(data.length / JOBS_PER_PAGE));
    } catch (error) {
      console.error("Error fetching job listings:", error);
      console.log("Failed to load job listings.");
      setJobListings([]);
      setFilteredJobs([]);
      setTotalPages(1);
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Apply filters and search
  useEffect(() => {
    const applyFilters = () => {
      let updatedJobs = [...jobListings];

      // Apply Search Filter
      if (debouncedSearchQuery.trim() !== "") {
        updatedJobs = updatedJobs.filter((job) =>
          job.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
      }

      // Apply Shift Type Filter
      if (selectedShift !== "all") {
        updatedJobs = updatedJobs.filter(
          (job) => job.shiftType.toLowerCase() === selectedShift.toLowerCase()
        );
      }

      // Apply Department Filter
      if (selectedDepartment !== "all") {
        updatedJobs = updatedJobs.filter(
          (job) => job.department.toLowerCase() === selectedDepartment.toLowerCase()
        );
      }

      // Apply Pay Rate Filter
      if (selectedPayRate !== "all") {
        const [type, rateStr] = selectedPayRate.split("$");
        const rate = parseInt(rateStr.replace("/hr", ""));
        if (type === "above") {
          updatedJobs = updatedJobs.filter((job) => {
            const jobRate = parseInt(job.payRate.replace("$", "").replace("/hr", ""));
            return jobRate >= rate;
          });
        } else if (type === "below") {
          updatedJobs = updatedJobs.filter((job) => {
            const jobRate = parseInt(job.payRate.replace("$", "").replace("/hr", ""));
            return jobRate <= rate;
          });
        }
      }

      setFilteredJobs(updatedJobs);
      setTotalPages(Math.ceil(updatedJobs.length / JOBS_PER_PAGE));
    };

    applyFilters();
  }, [debouncedSearchQuery, selectedShift, selectedDepartment, selectedPayRate, jobListings]);

  // Paginate filtered jobs
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );

  // Reset Filters
  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedShift("all");
    setSelectedDepartment("all");
    setSelectedPayRate("all");
    console.log("Filters have been reset.");
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    selectedShift,
    setSelectedShift,
    selectedDepartment,
    setSelectedDepartment,
    selectedPayRate,
    setSelectedPayRate,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedJobs,
    isLoading,
    resetFilters,
  };
};

export default useJobSearch;
