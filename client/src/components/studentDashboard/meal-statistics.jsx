import { PieChart, CheckCircle } from "lucide-react"

export default function MealStatistics({ stats, loading }) {
  if (loading) {
    return (
      <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200 animate-pulse">
        <div className="flex items-center mb-3">
          <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/5"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const completionPercentage = stats.totalDays > 0 ? Math.round((stats.completedDays / stats.totalDays) * 100) : 0

  return (
    <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200">
      <div className="flex items-center mb-3">
        <PieChart className="h-4 w-4 text-violet-600 mr-2" />
        <h2 className="text-[13px] font-medium text-gray-900">Meal Completion Statistics</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-gray-600">Total Days Tracked</p>
          <p className="text-[13px] font-medium text-gray-900">{stats.totalDays} days</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[13px] text-gray-600">Days All Meals Completed</p>
          <p className="text-[13px] font-medium text-gray-900">{stats.completedDays} days</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[13px] text-gray-600">Days with Low Protein</p>
          <p className="text-[13px] font-medium text-red-600">{stats.lowProteinDays} days</p>
        </div>

        {/* Completion progress bar */}
        <div className="mt-2">
          <div className="flex justify-between text-[13px] mb-1">
            <span className="text-gray-600">Meal Completion Rate</span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                completionPercentage >= 70
                  ? "bg-green-500"
                  : completionPercentage >= 40
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Status indicator */}
        <div
          className={`mt-2 p-2 rounded-md text-[13px] flex items-center ${
            completionPercentage >= 70
              ? "bg-green-50 text-green-700"
              : completionPercentage >= 40
                ? "bg-yellow-50 text-yellow-700"
                : "bg-red-50 text-red-700"
          }`}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          {completionPercentage >= 70
            ? "Great meal completion rate!"
            : completionPercentage >= 40
              ? "Moderate meal completion rate"
              : "Low meal completion rate"}
        </div>
      </div>
    </div>
  )
}
