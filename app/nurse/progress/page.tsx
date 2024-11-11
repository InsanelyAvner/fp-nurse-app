"use client"
import React, { useState, useEffect } from "react";
import IndeterminateProgressBar from "@/components/ui/indeterminateProgress";

const TestProgressPage: React.FC = () => {
  const [value, setValue] = useState(0);
  return (
    <div className="p-0">
      <h1 className="mb-4 text-lg font-bold">Progress Component Demo</h1>
      <div>
        <h2 className="mb-2">Indeterminate Progress</h2>
        <IndeterminateProgressBar />
      </div>
    </div>
  );
};

export default TestProgressPage;