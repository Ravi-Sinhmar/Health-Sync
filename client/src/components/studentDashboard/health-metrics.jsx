import { LineChart, TrendingUp, TrendingDown, Minus } from "lucide-react"

export default function HealthMetrics({ data, loading, error }) {
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-md p-3 space-y-2">
              <div className="flex justify-between items-start">
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <LineChart className="h-4 w-4 text-violet-600 mr-2" />
            <h2 className="text-[13px] font-medium text-gray-900">Health Metrics</h2>
          </div>
        </div>
        <div className="text-center py-4">
          <p className="text-[13px] text-red-500">Error loading health metrics: {error}</p>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status) => {
    if (!status) return <Minus className="h-3 w-3 mr-0.5 text-gray-400" />

    switch (status) {
      case "high":
        return <TrendingUp className="h-3 w-3 mr-0.5 text-red-500" />
      case "low":
        return <TrendingDown className="h-3 w-3 mr-0.5 text-amber-500" />
      default:
        return <TrendingUp className="h-3 w-3 mr-0.5 text-green-500" />
    }
  }

  const getStatusColor = (status) => {
    if (!status) return "text-gray-400"

    switch (status) {
      case "high":
        return "text-red-500"
      case "low":
        return "text-amber-500"
      default:
        return "text-green-500"
    }
  }

  return (
    <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <LineChart className="h-4 w-4 text-violet-600 mr-2" />
          <h2 className="text-[13px] font-medium text-gray-900">Health Metrics</h2>
        </div>
        <button className="text-[13px] text-violet-600 hover:text-violet-700 font-medium">View All</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="border rounded-md p-3">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[13px] text-gray-500">BMI</p>
            <div
              className={`flex items-center ${getStatusColor(data?.bmi > 25 ? "high" : data?.bmi < 18.5 ? "low" : "normal")} text-[13px]`}
            >
              {getStatusIcon(data?.bmi > 25 ? "high" : data?.bmi < 18.5 ? "low" : "normal")}
              <span>{data?.bmi > 25 ? "High" : data?.bmi < 18.5 ? "Low" : "Normal"}</span>
            </div>
          </div>
          <p className="text-[13px] font-medium">{data?.bmi || "--"}</p>
        </div>
        <div className="border rounded-md p-3">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[13px] text-gray-500">Height</p>
          </div>
          <p className="text-[13px] font-medium">{data?.height ? `${data.height} cm` : "--"}</p>
        </div>
        <div className="border rounded-md p-3">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[13px] text-gray-500">Weight</p>
          </div>
          <p className="text-[13px] font-medium">{data?.weight ? `${data.weight} kg` : "--"}</p>
        </div>
      </div>
    </div>
  )
}
