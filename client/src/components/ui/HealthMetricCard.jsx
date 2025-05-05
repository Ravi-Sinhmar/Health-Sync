import Card from "./Card"
import StatusBadge from "./StatusBadge"

const HealthMetricCard = ({ 
  title, 
  value, 
  unit, 
  status = "unknown", 
  icon: Icon, 
  normalRange, 
  description 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "normal":
        return "text-green-500"
      case "low":
        return "text-yellow-500"
      case "high":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  // Format the status label
  const formatStatusLabel = (status) => {
    if (!status) return "Unknown"
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  // Handle missing values
  const displayValue = value === undefined || value === null ? '--' : value

  return (
    <Card className="h-full">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            {Icon && <Icon className="w-5 h-5 text-gray-500" />}
            <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          </div>
          <div className="mt-2 flex items-end">
            <span className={`text-3xl font-bold ${getStatusColor()}`}>
              {displayValue}
            </span>
            {unit && <span className="ml-1 text-gray-500">{unit}</span>}
          </div>
          {normalRange && (
            <p className="mt-1 text-[13px] text-gray-500">Normal range: {normalRange}</p>
          )}
          {description && (
            <p className="mt-2 text-[13px] text-gray-600">{description}</p>
          )}
        </div>
        <StatusBadge 
          status={status} 
          label={formatStatusLabel(status)} 
        />
      </div>
    </Card>
  )
}

export default HealthMetricCard