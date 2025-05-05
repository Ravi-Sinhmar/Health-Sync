import { LineChart, TrendingUp } from "lucide-react"

export default function HealthMetrics() {
  // This is a placeholder component - replace with your actual implementation
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
            <div className="flex items-center text-green-500 text-[13px]">
              <TrendingUp className="h-3 w-3 mr-0.5" />
              <span>Normal</span>
            </div>
          </div>
          <p className="text-[13px] font-medium">21.5</p>
        </div>
        <div className="border rounded-md p-3">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[13px] text-gray-500">Height</p>
          </div>
          <p className="text-[13px] font-medium">5'9" (175 cm)</p>
        </div>
        <div className="border rounded-md p-3">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[13px] text-gray-500">Weight</p>
          </div>
          <p className="text-[13px] font-medium">145 lbs (65.8 kg)</p>
        </div>
      </div>
    </div>
  )
}
