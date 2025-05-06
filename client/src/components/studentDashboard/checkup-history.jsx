import { Calendar, ChevronRight } from 'lucide-react'

export default function CheckupHistory({ data, loading }) {
  // Sample checkup data - in a real app, this would come from the API
  const checkups = [
    { date: "12 Apr 2023", type: "Annual Physical", status: "Completed" },
    { date: "03 Jan 2023", type: "Dental Checkup", status: "Completed" },
    { date: "15 Oct 2022", type: "Vision Test", status: "Completed" },
  ]

  if (loading) {
    return (
      <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200 animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-md">
              <div className="space-y-1">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="flex items-center">
                <div className="h-3 bg-gray-200 rounded w-16 mr-2"></div>
                <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Use last checkup date from data if available
  const lastCheckup = data?.lastCheckupDate ? {
    date: new Date(data.lastCheckupDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
    type: "Health Checkup",
    status: "Completed"
  } : null

  // Combine with sample data
  const allCheckups = lastCheckup ? [lastCheckup, ...checkups.slice(0, 2)] : checkups

  return (
    <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-violet-600 mr-2" />
          <h2 className="text-[13px] font-medium text-gray-900">Checkup History</h2>
        </div>
        <button className="text-[13px] text-violet-600 hover:text-violet-700 font-medium">View All</button>
      </div>

      <div className="space-y-2">
        {allCheckups.map((checkup, index) => (
          <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
            <div>
              <p className="text-[13px] font-medium">{checkup.type}</p>
              <p className="text-[13px] text-gray-500">{checkup.date}</p>
            </div>
            <div className="flex items-center">
              <span className="text-[13px] text-green-600 mr-2">{checkup.status}</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
