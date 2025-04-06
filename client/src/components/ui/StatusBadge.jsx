const StatusBadge = ({ status, label }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800 border-green-200"
      case "low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <span className={`px-3 py-1 inline-flex text-sm font-medium rounded-full border ${getStatusStyles()}`}>
      {label}
    </span>
  )
}

export default StatusBadge

