import { CheckCircle, AlertTriangle } from "react-feather"

const HealthStatusBox = ({ isHealthy }) => {
  return (
    <div
      className={`p-4 rounded-lg ${isHealthy ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
    >
      <div className="flex items-center">
        {isHealthy ? (
          <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
        ) : (
          <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
        )}
        <h2 className={`text-lg font-semibold ${isHealthy ? "text-green-700" : "text-red-700"}`}>
          {isHealthy ? "Healthy" : "Unhealthy"}
        </h2>
      </div>
      <p className={`mt-1 text-sm ${isHealthy ? "text-green-600" : "text-red-600"}`}>
        {isHealthy ? "All health metrics are within normal ranges." : "Some health metrics require attention."}
      </p>
    </div>
  )
}

export default HealthStatusBox

