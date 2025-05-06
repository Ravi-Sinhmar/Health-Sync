import { Heart } from "lucide-react"

export default function VitalSigns({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200 animate-pulse">
        <div className="flex items-center mb-3">
          <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 p-3 rounded-md space-y-1">
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200">
      <div className="flex items-center mb-3">
        <Heart className="h-4 w-4 text-violet-600 mr-2" />
        <h2 className="text-[13px] font-medium text-gray-900">Vital Signs</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-[13px] text-gray-500">Heart Rate</p>
          <p className="text-[13px] font-medium">{data?.heartRate?.value || "--"} bpm</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-[13px] text-gray-500">Blood Pressure</p>
          <p className="text-[13px] font-medium">
            {data?.bloodPressure?.systolic?.value || "--"}/{data?.bloodPressure?.diastolic?.value || "--"} mmHg
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-[13px] text-gray-500">Temperature</p>
          <p className="text-[13px] font-medium">{data?.temperature?.value || "--"} °C</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-[13px] text-gray-500">Oxygen Saturation</p>
          <p className="text-[13px] font-medium">{data?.oxygenSaturation?.value || "--"}%</p>
        </div>
      </div>
    </div>
  )
}
