import { LineChart, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"

export default function ProteinAnalysis({ recommendedProtein, averageProtein, loading, weight }) {
  if (loading) {
    return (
      <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200 animate-pulse">
        <div className="flex items-center mb-3">
          <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="space-y-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  // If we don't have weight data, show a message
  if (!weight || recommendedProtein === 0) {
    return (
      <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200">
        <div className="flex items-center mb-3">
          <LineChart className="h-4 w-4 text-violet-600 mr-2" />
          <h2 className="text-[13px] font-medium text-gray-900">Protein Analysis</h2>
        </div>

        <div className="p-4 bg-amber-50 rounded-md flex items-start">
          <AlertTriangle className="h-4 w-4 text-amber-600 mr-2 mt-0.5" />
          <div>
            <p className="text-[13px] text-amber-800 font-medium">Weight data missing</p>
            <p className="text-[13px] text-amber-700 mt-1">
              Please update your weight in your profile to see protein recommendations.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Calculate protein status
  const proteinStatus =
    averageProtein >= recommendedProtein * 0.9 && averageProtein <= recommendedProtein * 1.5
      ? "optimal"
      : averageProtein < recommendedProtein * 0.9
        ? "low"
        : "high"

  // Calculate percentage of recommended
  const proteinPercentage = Math.round((averageProtein / recommendedProtein) * 100)

  return (
    <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200">
      <div className="flex items-center mb-3">
        <LineChart className="h-4 w-4 text-violet-600 mr-2" />
        <h2 className="text-[13px] font-medium text-gray-900">Protein Analysis</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-violet-50 p-3 rounded-md">
            <p className="text-[13px] text-violet-700">Recommended Daily</p>
            <p className="text-lg font-semibold text-violet-900">{recommendedProtein}g</p>
            <p className="text-[11px] text-violet-600">Based on your weight</p>
          </div>

          <div
            className={`p-3 rounded-md ${
              proteinStatus === "optimal" ? "bg-green-50" : proteinStatus === "low" ? "bg-amber-50" : "bg-blue-50"
            }`}
          >
            <p
              className={`text-[13px] ${
                proteinStatus === "optimal"
                  ? "text-green-700"
                  : proteinStatus === "low"
                    ? "text-amber-700"
                    : "text-blue-700"
              }`}
            >
              Average Daily
            </p>
            <p
              className={`text-lg font-semibold ${
                proteinStatus === "optimal"
                  ? "text-green-900"
                  : proteinStatus === "low"
                    ? "text-amber-900"
                    : "text-blue-900"
              }`}
            >
              {averageProtein}g
            </p>
            <p
              className={`text-[11px] ${
                proteinStatus === "optimal"
                  ? "text-green-600"
                  : proteinStatus === "low"
                    ? "text-amber-600"
                    : "text-blue-600"
              }`}
            >
              {proteinPercentage}% of recommended
            </p>
          </div>
        </div>

        {/* Status message */}
        <div
          className={`p-3 rounded-md flex items-start ${
            proteinStatus === "optimal" ? "bg-green-50" : proteinStatus === "low" ? "bg-amber-50" : "bg-blue-50"
          }`}
        >
          {proteinStatus === "optimal" ? (
            <TrendingUp className={`h-4 w-4 mr-2 mt-0.5 text-green-600`} />
          ) : proteinStatus === "low" ? (
            <TrendingDown className={`h-4 w-4 mr-2 mt-0.5 text-amber-600`} />
          ) : (
            <TrendingUp className={`h-4 w-4 mr-2 mt-0.5 text-blue-600`} />
          )}

          <div>
            <p
              className={`text-[13px] font-medium ${
                proteinStatus === "optimal"
                  ? "text-green-800"
                  : proteinStatus === "low"
                    ? "text-amber-800"
                    : "text-blue-800"
              }`}
            >
              {proteinStatus === "optimal"
                ? "Optimal Protein Intake"
                : proteinStatus === "low"
                  ? "Low Protein Intake"
                  : "High Protein Intake"}
            </p>
            <p
              className={`text-[13px] mt-1 ${
                proteinStatus === "optimal"
                  ? "text-green-700"
                  : proteinStatus === "low"
                    ? "text-amber-700"
                    : "text-blue-700"
              }`}
            >
              {proteinStatus === "optimal"
                ? "Your average protein intake is within the recommended range."
                : proteinStatus === "low"
                  ? "Your average protein intake is below the recommended amount. Consider adding more protein-rich foods to your diet."
                  : "Your average protein intake is above the recommended amount. This may be appropriate if you're very active or building muscle."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
