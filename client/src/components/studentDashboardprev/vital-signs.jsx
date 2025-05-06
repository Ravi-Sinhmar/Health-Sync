import { Heart } from "lucide-react"

export default function VitalSigns() {
  // This is a placeholder component - replace with your actual implementation
  return (
    <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200">
      <div className="flex items-center mb-3">
        <Heart className="h-4 w-4 text-violet-600 mr-2" />
        <h2 className="text-[13px] font-medium text-gray-900">Vital Signs</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-[13px] text-gray-500">Heart Rate</p>
          <p className="text-[13px] font-medium">72 bpm</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-[13px] text-gray-500">Blood Pressure</p>
          <p className="text-[13px] font-medium">120/80 mmHg</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-[13px] text-gray-500">Temperature</p>
          <p className="text-[13px] font-medium">98.6 °F</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-[13px] text-gray-500">Respiratory Rate</p>
          <p className="text-[13px] font-medium">16 bpm</p>
        </div>
      </div>
    </div>
  )
}
