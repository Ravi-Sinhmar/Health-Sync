import { User } from "lucide-react"

export default function StudentProfile() {
  // This is a placeholder component - replace with your actual implementation
  return (
    <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200">
      <div className="flex items-start">
        <div className="bg-gray-100 rounded-md p-3 mr-4">
          <User className="h-10 w-10 text-gray-500" />
        </div>
        <div>
          <h2 className="text-[13px] font-medium text-gray-900">John Doe</h2>
          <p className="text-[13px] text-gray-500 mt-1">Student ID: S12345</p>
          <p className="text-[13px] text-gray-500">Class: 10th Grade</p>
        </div>
      </div>
    </div>
  )
}
