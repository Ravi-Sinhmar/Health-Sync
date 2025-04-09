import React from 'react';
import { AlertTriangle } from "lucide-react";

export default function StudentProfile() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-semibold">
          R
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-medium">Ronit Kumar</h2>
          <p className="text-gray-500">kumarkrsronit@gmail.com</p>

          <div className="mt-4 bg-red-50 border border-red-100 rounded-md p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <span className="font-medium text-red-500">Unhealthy</span>
            </div>
            <p className="text-red-500 text-sm mt-1">Some health metrics require attention.</p>
          </div>
        </div>
      </div>
    </div>
  );
}