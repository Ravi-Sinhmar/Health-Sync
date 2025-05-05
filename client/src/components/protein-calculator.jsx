"use client"

import { useState } from "react"

export default function ProteinCalculator() {
  const [formData, setFormData] = useState({
    units: "metric",
    age: "",
    sex: "male",
    height: "",
    weight: "",
    goal: "fat-loss",
    activityLevel: "sedentary",
  })

  const [errors, setErrors] = useState({
    age: false,
    height: false,
    weight: false,
  })

  const [result, setResult] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear errors when user types
    if (name in errors) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      age: false,
      height: false,
      weight: false,
    }

    // Validate age (14-80)
    const age = Number.parseInt(formData.age)
    if (isNaN(age) || age < 14 || age > 80) {
      newErrors.age = true
    }

    // Validate height and weight (must be numbers)
    const height = Number.parseFloat(formData.height)
    if (isNaN(height) || height <= 0) {
      newErrors.height = true
    }

    const weight = Number.parseFloat(formData.weight)
    if (isNaN(weight) || weight <= 0) {
      newErrors.weight = true
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const calculateProteinIntake = () => {
    if (!validateForm()) return

    const weight = Number.parseFloat(formData.weight)
    let proteinMultiplier = 0

    // Calculate protein intake based on goal and activity level
    switch (formData.goal) {
      case "fat-loss":
        proteinMultiplier = 1.6
        if (formData.activityLevel === "very-active") proteinMultiplier = 1.8
        break
      case "maintenance":
        proteinMultiplier = 1.4
        if (formData.activityLevel === "very-active") proteinMultiplier = 1.6
        break
      case "muscle-gain":
        proteinMultiplier = 1.8
        if (formData.activityLevel === "very-active") proteinMultiplier = 2.0
        break
      default:
        proteinMultiplier = 1.6
    }

    // Adjust for sex
    if (formData.sex === "female") {
      proteinMultiplier -= 0.1
    }

    // Calculate protein in grams
    const proteinGrams = Math.round(weight * proteinMultiplier)
    setResult(proteinGrams)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-center mb-6 text-blue-600">Protein Intake Calculator</h3>

      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <input
            type="radio"
            name="units"
            value="metric"
            checked={formData.units === "metric"}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600"
          />
          <label className="text-[13px] font-medium text-gray-700">Metric</label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[13px] font-medium text-gray-700">Age</label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Years"
              className={`w-full px-3 py-2 border rounded-md ${errors.age ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.age && <p className="text-red-500 text-[13px] mt-1">Age should be between 14 to 80</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-[13px] font-medium text-gray-700">Sex</label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[13px] font-medium text-gray-700">Height</label>
            <input
              type="text"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="Centimeter"
              className={`w-full px-3 py-2 border rounded-md ${errors.height ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.height && <p className="text-red-500 text-[13px] mt-1">Height is required</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-[13px] font-medium text-gray-700">Weight</label>
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Kilogram"
              className={`w-full px-3 py-2 border rounded-md ${errors.weight ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.weight && <p className="text-red-500 text-[13px] mt-1">Weight is required</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-[13px] font-medium text-gray-700">Goal</label>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="fat-loss">Fat loss</option>
              <option value="maintenance">Maintenance</option>
              <option value="muscle-gain">Muscle gain</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[13px] font-medium text-gray-700">Activity level</label>
            <select
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="sedentary">Sedentary</option>
              <option value="lightly-active">Lightly Active</option>
              <option value="moderately-active">Moderately Active</option>
              <option value="very-active">Very Active</option>
            </select>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={calculateProteinIntake}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Calculate
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-800 font-medium">
            You should take <span className="text-blue-600 font-bold text-xl">{result ? `${result}g` : "......"}</span>{" "}
            of protein per day
          </p>
        </div>
      </div>
    </div>
  )
}
