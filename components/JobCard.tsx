// JobCard.tsx

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Clock, CalendarIcon } from "lucide-react";
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

const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between bg-white rounded-lg">
      <div>
        <CardHeader className="flex flex-col space-y-2 p-4">
          <CardTitle className="text-xl font-semibold flex items-center justify-between">
            <span>{job.title}</span>
            {job.urgent && <Badge variant="destructive">Urgent</Badge>}
          </CardTitle>
          <p className="text-gray-600">{job.facility}</p>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="text-sm text-gray-600 space-y-2">
            <p className="flex items-center">
              <Briefcase className="mr-2 h-4 w-4 text-gray-500" />
              {job.department}
            </p>
            <p className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-gray-500" />
              {job.shiftType} Shift
            </p>
            <p className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
              {format(new Date(job.date), "PPP")}
            </p>
            <p className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-gray-500" />
              {job.time}
            </p>
            <p className="font-medium text-gray-800">
              Pay Rate: {job.payRate}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
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
          </div>
        </CardContent>
      </div>
      <CardFooter className="px-4 py-3 border-t border-gray-200">
        <Button
          className="w-full"
          onClick={() => onViewDetails(job.id)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;