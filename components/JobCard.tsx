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
}

interface JobCardProps {
  job: Job;
  onViewDetails: (jobId: number) => void;
}

function convertTo24HourRange(timeRange:any) {
    // Split the input range by " - "
    const [startTime, endTime] = timeRange.split(" - ");

    // Helper function to convert 12-hour format to 24-hour format
    function convertTo24Hour(time:any) {
        const [timePart, meridiem] = time.split(" ");
        let [hours, minutes] = timePart.split(":").map(Number);

        // Convert hours based on AM/PM
        if (meridiem === "PM" && hours !== 12) {
            hours += 12;
        } else if (meridiem === "AM" && hours === 12) {
            hours = 0;
        }

        // Format hours and minutes as two digits
        const formattedHours = String(hours).padStart(2, "0");
        const formattedMinutes = String(minutes).padStart(2, "0");

        return `${formattedHours}:${formattedMinutes}`;
    }

    // Convert start and end times
    const start24Hour = convertTo24Hour(startTime);
    const end24Hour = convertTo24Hour(endTime);

    return `${start24Hour} - ${end24Hour}`;
}

const ApplicationCard: React.FC<JobCardProps> = ({ job, onViewDetails }) => {

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
                {format(new Date(job.date), "d MMMM")}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 text-[#9d2235] mr-2" />
              <span className="text-sm">{convertTo24HourRange(job.time)}</span>
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
