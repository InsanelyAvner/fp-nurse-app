"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  CheckCircle,
  XCircle,
  Briefcase,
  Mail,
} from "lucide-react";
import { Applicant } from "@/app/types";

const ApplicantCard: React.FC<{
  applicant: Applicant;
  onAccept: (applicant: Applicant) => void;
  onReject: (applicant: Applicant) => void;
  onViewProfile: (applicantId: number) => void;
}> = ({ applicant, onAccept, onReject, onViewProfile }) => (
  <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 relative hover:shadow-xl transition-shadow duration-300 border border-gray-100 max-w-sm mx-auto w-full">
    {/* Top Section with Avatar and Basic Info */}
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-gray-100 flex-shrink-0">
          <AvatarImage src={applicant.profileImage} alt={applicant.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {applicant.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 mb-1 truncate">{applicant.name}</h3>
          <div className="flex items-center text-gray-500 text-sm">
            <Mail className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            <span className="truncate">{applicant.email}</span>
          </div>
        </div>
      </div>
      <Badge 
        variant="secondary" 
        className="bg-primary/10 text-primary hover:bg-primary/20 ml-2 flex-shrink-0"
      >
        <Star className="mr-1 h-3.5 w-3.5" />
        {applicant.matchingScore}%
      </Badge>
    </div>

    {/* Middle Section with Experience and Skills */}
    <div className="mt-4 space-y-3">
      <div className="flex items-center text-sm text-gray-600">
        <Briefcase className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
        <span>
          {applicant.experience} {applicant.experience === 1 ? "year" : "years"} experience
        </span>
      </div>
      
      <div className="flex flex-wrap gap-1.5">
        {applicant.keySkills.map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>

    {/* Action Buttons */}
    <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:space-x-3">
      <Button
        size="sm"
        variant="default"
        onClick={() => onAccept(applicant)}
        className="font-medium shadow-sm hover:translate-y-[-1px] transition-transform w-full"
      >
        <CheckCircle className="mr-1.5 h-4 w-4" />
        Accept
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onReject(applicant)}
        className="font-medium border-gray-200 hover:bg-gray-50 hover:text-destructive w-full"
      >
        <XCircle className="mr-1.5 h-4 w-4" />
        Reject
      </Button>
    </div>
  </div>
);

export default ApplicantCard;