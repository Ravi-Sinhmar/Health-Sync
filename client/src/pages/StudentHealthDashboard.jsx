import React from 'react';
import { ArrowLeft } from "lucide-react"
import StudentProfile from "../components/studentDashboard/student-profile"
import PersonalDetails from "../components/studentDashboard/personal-details"
import VitalSigns from "../components/studentDashboard/vital-signs"
import HealthMetrics from "../components/studentDashboard/health-metrics"
import CheckupHistory from "../components/studentDashboard/checkup-history"




export default function StudentHealthDashboard() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <a href="#" className="inline-flex items-center text-lg font-medium text-gray-800">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Student Health Profile
        </a>
      </div>

      <div className="space-y-6">
        <StudentProfile />
        <PersonalDetails />
        <VitalSigns />
        <CheckupHistory />
        <HealthMetrics />
      </div>
    </div>
  );
}