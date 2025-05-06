import { ClipboardList } from "lucide-react"

export default function PersonalDetails({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200 animate-pulse">
        <div className="flex items-center mb-3">
          <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200">
      <div className="flex items-center mb-3">
        <ClipboardList className="h-4 w-4 text-violet-600 mr-2" />
        <h2 className="text-[13px] font-medium text-gray-900">Personal Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[13px]">
        <div>
          <p className="text-gray-500">Date of Birth</p>
          <p className="font-medium">{data?.dob || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-500">Gender</p>
          <p className="font-medium">{data?.gender || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-500">Blood Group</p>
          <p className="font-medium">{data?.bloodGroup || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-500">Emergency Contact</p>
          <p className="font-medium">{data?.emergencyContact?.phone || data?.phone || "N/A"}</p>
        </div>
      </div>
    </div>
  )
}
