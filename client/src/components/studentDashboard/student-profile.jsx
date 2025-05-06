import { User } from "lucide-react"

export default function StudentProfile({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200 animate-pulse">
        <div className="flex items-start">
          <div className="bg-gray-200 rounded-md p-3 mr-4 h-16 w-16"></div>
          <div className="space-y-2 w-full">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200">
      <div className="flex items-start">
        <div className="bg-violet-100 rounded-md p-3 mr-4">
          <User className="h-10 w-10 text-violet-600" />
        </div>
        <div>
          <h2 className="text-[13px] font-medium text-gray-900">{data?.name || "N/A"}</h2>
          <p className="text-[13px] text-gray-500 mt-1">Student ID: {data?.admissionNumber || "N/A"}</p>
          <p className="text-[13px] text-gray-500">Course: {data?.course || "N/A"}</p>
        </div>
      </div>
    </div>
  )
}
