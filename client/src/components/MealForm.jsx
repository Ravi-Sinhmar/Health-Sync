"use client"

import { useState, useEffect } from "react"

const mealTimes = [
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
]

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function MealForm({ meal, onSave, onCancel, selectedDay }) {
  const [formData, setFormData] = useState({
    name: "",
    day: selectedDay || "Monday",
    time: "12:00",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    ingredients: [""],
    notes: "",
  })

  // Initialize form with meal data if editing
  useEffect(() => {
    if (meal) {
      setFormData({
        name: meal.name,
        day: meal.day,
        time: meal.time,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        ingredients: meal.ingredients,
        notes: meal.notes || "",
      })
    }
  }, [meal])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "calories" || name === "protein" || name === "carbs" || name === "fat"
          ? Number.parseInt(value) || 0
          : value,
    }))
  }

  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...formData.ingredients]
    updatedIngredients[index] = value
    setFormData((prev) => ({
      ...prev,
      ingredients: updatedIngredients,
    }))
  }

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }))
  }

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const updatedIngredients = [...formData.ingredients]
      updatedIngredients.splice(index, 1)
      setFormData((prev) => ({
        ...prev,
        ingredients: updatedIngredients,
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Filter out empty ingredients
    const filteredIngredients = formData.ingredients.filter((ing) => ing.trim() !== "")
    onSave({
      ...formData,
      ingredients: filteredIngredients,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[13px] font-medium">{meal ? "Edit Meal" : "Add New Meal"}</h2>
        <button type="button" className="text-gray-500 hover:text-gray-700" onClick={onCancel}>
          ✕
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="name" className="block text-[13px] font-medium text-gray-700 mb-1">
            Meal Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border text-[13px] p-2 focus:outline-none focus:ring-1 focus:ring-violet-500 rounded-md"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="day" className="block text-[13px] font-medium text-gray-700 mb-1">
              Day
            </label>
            <select
              id="day"
              name="day"
              value={formData.day}
              onChange={handleChange}
              className="w-full border text-[13px] p-2 focus:outline-none focus:ring-1 focus:ring-violet-500 rounded-md"
            >
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="time" className="block text-[13px] font-medium text-gray-700 mb-1">
              Time
            </label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full border text-[13px] p-2 focus:outline-none focus:ring-1 focus:ring-violet-500 rounded-md"
            >
              {mealTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="calories" className="block text-[13px] font-medium text-gray-700 mb-1">
              Calories
            </label>
            <input
              type="number"
              id="calories"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              min="0"
              className="w-full border text-[13px] p-2 focus:outline-none focus:ring-1 focus:ring-violet-500 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="protein" className="block text-[13px] font-medium text-gray-700 mb-1">
              Protein (g)
            </label>
            <input
              type="number"
              id="protein"
              name="protein"
              value={formData.protein}
              onChange={handleChange}
              min="0"
              className="w-full border text-[13px] p-2 focus:outline-none focus:ring-1 focus:ring-violet-500 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="carbs" className="block text-[13px] font-medium text-gray-700 mb-1">
              Carbs (g)
            </label>
            <input
              type="number"
              id="carbs"
              name="carbs"
              value={formData.carbs}
              onChange={handleChange}
              min="0"
              className="w-full border text-[13px] p-2 focus:outline-none focus:ring-1 focus:ring-violet-500 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="fat" className="block text-[13px] font-medium text-gray-700 mb-1">
              Fat (g)
            </label>
            <input
              type="number"
              id="fat"
              name="fat"
              value={formData.fat}
              onChange={handleChange}
              min="0"
              className="w-full border text-[13px] p-2 focus:outline-none focus:ring-1 focus:ring-violet-500 rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-gray-700 mb-1">Ingredients</label>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                className="flex-1 border text-[13px] p-2 focus:outline-none focus:ring-1 focus:ring-violet-500 rounded-md"
                placeholder="Enter ingredient"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="ml-2 px-2 text-gray-500 hover:text-red-500"
                disabled={formData.ingredients.length <= 1}
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={addIngredient} className="text-[13px] text-violet-600 hover:text-violet-700">
            + Add ingredient
          </button>
        </div>

        <div>
          <label htmlFor="notes" className="block text-[13px] font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full border text-[13px] p-2 focus:outline-none focus:ring-1 focus:ring-violet-500 rounded-md"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            className="border px-3 py-1.5 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors rounded-md"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-violet-600 px-3 py-1.5 text-[13px] text-white hover:bg-violet-700 transition-colors shadow-[13px] rounded-md"
          >
            {meal ? "Update Meal" : "Add Meal"}
          </button>
        </div>
      </div>
    </form>
  )
}
