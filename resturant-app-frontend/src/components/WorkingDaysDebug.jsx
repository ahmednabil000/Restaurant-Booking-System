import React from "react";
import { useWorkingDays } from "../hooks/useWorkingDays";

const WorkingDaysDebug = () => {
  const { workingDays, loading, error } = useWorkingDays();

  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
      <h3 className="font-bold text-lg mb-2">Working Days Debug</h3>

      <div className="mb-2">
        <strong>Loading:</strong> {loading ? "Yes" : "No"}
      </div>

      <div className="mb-2">
        <strong>Error:</strong> {error || "None"}
      </div>

      <div className="mb-2">
        <strong>Working Days Count:</strong> {workingDays.length}
      </div>

      <div>
        <strong>Raw Data:</strong>
        <pre className="bg-white p-2 text-xs overflow-auto max-h-60 mt-1 border rounded">
          {JSON.stringify(workingDays, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default WorkingDaysDebug;
