// components/JobCard.tsx

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from '@/components/ui/scroll-area';

interface Job {
  id: number;
  title: string;
  facility: string;
  date: string;
  time: string;
  payRate: string;
  urgent: boolean;
  requiredSkills: string[];
}

interface JobCardProps {
  job: Job;
  onViewDetails: (jobId: number) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails }) => {
  return (
    <Card className="flex flex-col max-h-80 hover:shadow-md transition-shadow duration-300">
      <ScrollArea className="flex-grow p-1">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <span>{job.title}</span>
            {job.urgent && (
              <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                Urgent
              </span>
            )}
          </CardTitle>
          <CardDescription>{job.facility}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm mb-2 flex items-center text-gray-600">
            <Clock size={16} className="mr-1" /> {job.date} • {job.time}
          </p>
          <p className="text-sm font-semibold mb-2 text-gray-800">
            Pay Rate: {job.payRate}
          </p>
          <p className="text-sm mb-2 text-gray-800">
            Required skills: <br />
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {job.requiredSkills.map((skill) => (
              <span
                key={skill}
                className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </CardContent>
      </ScrollArea>
      
      <div className="pt-0 p-4">
        <Button className="w-full mt-5" onClick={() => onViewDetails(job.id)}>
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default JobCard;
