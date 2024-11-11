// File: /components/JobCard.tsx

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Clock,
  Calendar as CalendarIcon,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { format, parse } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Job {
  id: number;
  title: string;
  facility: string;
  date: string | Date;
  time: string;
  payRate: string;
  urgent: boolean;
  requiredSkills: string[];
  shiftType: string;
  department: string;
}

interface JobCardProps {
  job: Job;
  onViewDetails: (jobId: number) => void;
}

/**
 * Converts a time range from 12-hour format to 24-hour format.
 * @param timeRange - The time range string (e.g., "9:00 AM - 5:00 PM").
 * @returns The converted time range in 24-hour format (e.g., "09:00 - 17:00").
 */
const convertTo24HourRange = (timeRange: string): string => {
  try {
    const [startTime, endTime] = timeRange.split(" - ");

    const convertTo24Hour = (time: string): string => {
      const parsedTime = parse(time, "h:mm a", new Date());
      return format(parsedTime, "HH:mm");
    };

    const start24Hour = convertTo24Hour(startTime);
    const end24Hour = convertTo24Hour(endTime);

    return `${start24Hour} - ${end24Hour}`;
  } catch (error) {
    console.error("Error converting time range:", error);
    return timeRange; // Fallback to original if parsing fails
  }
};

/**
 * JobCard Component
 * Displays detailed information about a job posting.
 */
const JobCard: React.FC<JobCardProps> = React.memo(({ job, onViewDetails }) => {
  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        {/* Header with Title and Facility */}
        <CardHeader className="p-0 space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                {job.facility}
              </div>
            </div>
            {job.urgent && (
              <Badge variant="destructive" className="px-2 py-0.5 text-xs font-medium">
                Urgent
              </Badge>
            )}
          </div>
        </CardHeader>

        {/* Details Grid */}
        <CardContent className="p-0 mt-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Department */}
            <div className="flex items-center text-gray-600">
              <Briefcase className="h-4 w-4 text-[#9d2235] mr-2" />
              <span className="text-sm">{job.department}</span>
            </div>
            {/* Shift Type */}
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 text-[#9d2235] mr-2" />
              <span className="text-sm">{job.shiftType} Shift</span>
            </div>
            {/* Date */}
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="h-4 w-4 text-[#9d2235] mr-2" />
              <span className="text-sm">
                {format(new Date(job.date), "d MMMM, yyyy")}
              </span>
            </div>
            {/* Time */}
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 text-[#9d2235] mr-2" />
              <span className="text-sm">{convertTo24HourRange(job.time)}</span>
            </div>
          </div>

          {/* Pay Rate */}
          <div className="mt-4 mb-4">
            <span className="text-lg font-semibold text-[#9d2235]">{job.payRate}</span>
          </div>

          {/* Skills */}
          {job.requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {job.requiredSkills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.requiredSkills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{job.requiredSkills.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* View Details Button */}
          <Button
            onClick={() => onViewDetails(job.id)}
            className="w-full bg-[#9d2235] hover:bg-[#8a1e2f] text-white flex items-center justify-center"
            aria-label={`View details for ${job.title}`}
          >
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </div>
    </Card>
  );
});

export default JobCard;
