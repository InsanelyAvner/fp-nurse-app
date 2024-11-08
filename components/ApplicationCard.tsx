import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Clock,
  CalendarIcon,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";

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
  status: string;
}

interface JobCardProps {
  job: Job;
  onViewDetails: (jobId: number) => void;
}

const ApplicationCard: React.FC<JobCardProps> = ({ job, onViewDetails }) => {
  const getStatusStyles = (status: string) => {
    const styles = {
      ACCEPTED: "bg-emerald-100 text-emerald-700",
      REJECTED: "bg-red-100 text-red-700",
      WITHDRAWN: "bg-gray-100 text-gray-700",
      APPLIED: "bg-blue-100 text-blue-700",
    };
    return styles[status as keyof typeof styles] || styles.APPLIED;
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="p-5">
        {/* Header with Title and Status */}
        <CardHeader className="p-0 space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <h3 className="font-semibold text-lg text-gray-900">
                {job.title}
              </h3>
              <div className="flex items-center text-gray-500 text-sm">
                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                {job.facility}
              </div>
            </div>
            {job.urgent && (
              <span className="px-2 py-0.5 text-xs font-medium bg-[#9d2235] text-white rounded">
                Urgent
              </span>
            )}
          </div>

          <span
            className={`inline-block px-2.5 py-1 rounded-full text-sm ${getStatusStyles(
              job.status
            )}`}
          >
            {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
          </span>
        </CardHeader>

        {/* Details Grid */}
        <CardContent className="p-0 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center text-gray-600">
              <Briefcase className="h-4 w-4 text-[#9d2235] mr-2" />
              <span className="text-sm">{job.department}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 text-[#9d2235] mr-2" />
              <span className="text-sm">{job.shiftType}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="h-4 w-4 text-[#9d2235] mr-2" />
              <span className="text-sm">
                {format(new Date(job.date), "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 text-[#9d2235] mr-2" />
              <span className="text-sm">{job.time}</span>
            </div>
          </div>

          {/* Pay Rate */}
          <div className="mt-4 mb-4">
            <span className="text-lg font-semibold text-[#9d2235]">
              {job.payRate}
            </span>
          </div>

          {/* Skills */}
          {job.requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {job.requiredSkills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded"
                >
                  {skill}
                </span>
              ))}
              {job.requiredSkills.length > 3 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                  +{job.requiredSkills.length - 3}
                </span>
              )}
            </div>
          )}

          <Button
            onClick={() => onViewDetails(job.id)}
            className="w-full bg-[#9d2235] hover:bg-[#8a1e2f] text-white"
          >
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};

export default ApplicationCard;
