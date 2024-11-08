// AdminJobCard.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Briefcase,
  Calendar as CalendarIcon,
  Clock,
  Edit,
  Eye,
  Trash,
  Users2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Job {
  id: number;
  title: string;
  facility: string;
  department: string;
  shiftType: string;
  status: "Active" | "Closed" | "Draft";
  applicants: number;
  date: Date;
  time: string;
  payRate: string;
  urgent: boolean;
  requiredSkills: string[];
  description: string;
}

interface AdminJobCardProps {
  job: Job;
  onEdit: (id: number) => void;
  onDelete: (job: Job) => void;
  onViewApplicants: (id: number) => void;
}

const AdminJobCard: React.FC<AdminJobCardProps> = ({
  job,
  onEdit,
  onDelete,
  onViewApplicants,
}) => {
  return (
    <Card
      key={job.id}
      className="hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between bg-white rounded-lg relative overflow-hidden"
    >
      {job.urgent && (
        <div className="absolute top-0 left-0 w-full bg-red-600 text-white text-center text-sm py-1 font-medium">
          Urgent Position
        </div>
      )}
      <div className={job.urgent ? "pt-8" : ""}>
        <CardHeader className="flex flex-col space-y-2 p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">{job.title}</CardTitle>
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
              <Users2 className="h-4 w-4 text-[#9d2235] mr-1" />
              <span className="font-medium">{job.applicants}</span>
            </div>
          </div>
          <p className="text-gray-600">{job.facility}</p>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="text-sm text-gray-600 space-y-2">
            <p className="flex items-center">
              <Briefcase className="mr-2 h-4 w-4 text-[#9d2235]" />
              {job.department}
            </p>
            <p className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-[#9d2235]" />
              {job.shiftType} Shift
            </p>
            <p className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 text-[#9d2235]" />
              {format(job.date, "PPP")}
            </p>
            <p className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-[#9d2235]" />
              {job.time}
            </p>
            <div className="mt-4 mb-4">
              <span className="text-lg font-semibold text-[#9d2235]">
                {job.payRate}
              </span>
            </div>
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
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
        <Badge
          variant={
            job.status === "Active"
              ? "default"
              : job.status === "Closed"
              ? "destructive"
              : "secondary"
          }
          className="text-xs"
        >
          {job.status}
        </Badge>
        <div className="flex space-x-3">
          <Link href={`/admin/job/${job.id}/applicants`}>
            <Button
              size="icon"
              variant="ghost"
              aria-label="View Applicants"
              className="text-gray-600 hover:text-gray-800"
              onClick={() => onViewApplicants(job.id)}
            >
              <Eye className="h-5 w-5" />
            </Button>
          </Link>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(job.id)}
            aria-label="Edit Job"
            className="text-gray-600 hover:text-gray-800"
          >
            <Edit className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(job)}
            aria-label="Delete Job"
            className="text-red-600 hover:text-red-800"
          >
            <Trash className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AdminJobCard;
