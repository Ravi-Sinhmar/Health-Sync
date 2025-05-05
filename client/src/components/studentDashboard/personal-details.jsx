import { ClipboardList } from "lucide-react"

export default function PersonalDetails() {
  // This is a placeholder component - replace with your actual implementation
  return (
    <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200">
      <div className="flex items-center mb-3">
        <ClipboardList className="h-4 w-4 text-violet-600 mr-2" />
        <h2 className="text-[13px] font-medium text-gray-900">Personal Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[13px]">
        <div>
          <p className="text-gray-500">Date of Birth</p>
          <p className="font-medium">15 May 2006</p>
        </div>
        <div>
          <p className="text-gray-500">Gender</p>
          <p className="font-medium">Male</p>
        </div>
        <div>
          <p className="text-gray-500">Blood Group</p>
          <p className="font-medium">O+</p>
        </div>
        <div>
          <p className="text-gray-500">Emergency Contact</p>
          <p className="font-medium">+1 (555) 123-4567</p>
        </div>
      </div>
    </div>
  )
}
