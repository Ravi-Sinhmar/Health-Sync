"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

export default function NutritionSummary({ nutrition, day }) {
  const [activeIndex, setActiveIndex] = useState(null)

  // Calculate macronutrient percentages
  const totalMacros = nutrition.protein + nutrition.carbs + nutrition.fat

  const macroData = [
    { name: "Protein", value: nutrition.protein, color: "#10b981" }, // green
    { name: "Carbs", value: nutrition.carbs, color: "#6366f1" }, // indigo
    { name: "Fat", value: nutrition.fat, color: "#f59e0b" }, // amber
  ].filter((item) => item.value > 0) // Only show macros with values

  // If no data, show placeholder
  if (totalMacros === 0) {
    return (
      <div className="border bg-white p-4 shadow-[13px] rounded-md h-full">
        <h2 className="text-[13px] font-medium text-gray-700 mb-4">Nutrition Summary</h2>
        <div className="text-center py-6 text-[13px] text-gray-500">No nutrition data available for {day}</div>
      </div>
    )
  }

  return (
    <div className="border bg-white p-4 shadow-[13px] rounded-md h-full">
      <h2 className="text-[13px] font-medium text-gray-700 mb-4">Nutrition Summary</h2>

      <div className="text-center mb-4">
        <div className="text-lg font-medium">{nutrition.calories}</div>
        <div className="text-[10px] text-gray-500">Total Calories</div>
      </div>

      <div className="h-40 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={macroData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {macroData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="none"
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-[10px]">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-[13px] font-medium">{nutrition.protein}g</div>
          <div className="text-[10px] text-gray-500">Protein</div>
          <div className="text-[10px] text-gray-400">
            {totalMacros > 0 ? Math.round((nutrition.protein / totalMacros) * 100) : 0}%
          </div>
        </div>
        <div>
          <div className="text-[13px] font-medium">{nutrition.carbs}g</div>
          <div className="text-[10px] text-gray-500">Carbs</div>
          <div className="text-[10px] text-gray-400">
            {totalMacros > 0 ? Math.round((nutrition.carbs / totalMacros) * 100) : 0}%
          </div>
        </div>
        <div>
          <div className="text-[13px] font-medium">{nutrition.fat}g</div>
          <div className="text-[10px] text-gray-500">Fat</div>
          <div className="text-[10px] text-gray-400">
            {totalMacros > 0 ? Math.round((nutrition.fat / totalMacros) * 100) : 0}%
          </div>
        </div>
      </div>
    </div>
  )
}
