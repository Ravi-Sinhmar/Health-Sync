"use client"

import { useState, useEffect } from "react"
import apiConfig from "../config/api"
import {
    Calendar,
    ArrowLeft,
    ArrowRight,
    Plus,
    Edit2,
    Trash,
    Activity,
    Calculator,
    ArrowUpIcon as BackArrow,
} from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { useNavigate, useLocation } from "react-router-dom"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

// Sample data - in a real app this would come from an API or database
const initialMealLogs = [
    {
        id: 1,
        date: "2023-05-04",
        meals: [
            {
                id: 101,
                name: "Breakfast Oatmeal",
                time: "08:15",
                calories: 350,
                protein: 12,
                carbs: 45,
                fat: 9,
                completed: true,
            },
            {
                id: 102,
                name: "Grilled Chicken Salad",
                time: "13:20",
                calories: 420,
                protein: 35,
                carbs: 20,
                fat: 15,
                completed: true,
            },
            {
                id: 103,
                name: "Protein Shake",
                time: "16:00",
                calories: 180,
                protein: 25,
                carbs: 10,
                fat: 3,
                completed: true,
            },
            {
                id: 104,
                name: "Salmon with Vegetables",
                time: "19:30",
                calories: 520,
                protein: 40,
                carbs: 25,
                fat: 22,
                completed: false,
            },
        ],
    },
]

export default function MealTracker() {
    const navigate = useNavigate()
    const location = useLocation()
    const [mealLogs, setMealLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [showAddMealForm, setShowAddMealForm] = useState(false)
    const [editingMeal, setEditingMeal] = useState(null)
    const [showDatePicker, setShowDatePicker] = useState(false)

    // Navigation items for health features
    const navItems = [
        { name: "Health Dashboard", path: "/dashboard", icon: Activity },
        { name: "Protein Calculator", path: "/meal/protein/calculator", icon: Calculator },
        { name: "Meal Planner", path: "/meal/planner", icon: Calendar },
    ]

    // Function to check if a nav item is active
    const isActive = (path) => {
        return location.pathname === path
    }

    useEffect(() => {
        const fetchMealLogs = async () => {
            try {
                setLoading(true)
                // Format the date for the API
                const dateStr = selectedDate.toISOString().split("T")[0]

                const response = await fetch(`${apiConfig.baseURL}/api/meal-logs/date/${dateStr}`, {
                    credentials: "include",
                })

                if (!response.ok) {
                    throw new Error("Failed to fetch meal logs")
                }

                const data = await response.json()

                // Create a meal log entry for this date if we have meals
                if (data.meals && data.meals.length > 0) {
                    setMealLogs([
                        {
                            id: Date.now(), // Temporary ID
                            date: dateStr,
                            meals: data.meals.map((meal) => ({
                                id: meal._id,
                                name: meal.name,
                                time: meal.time || "12:00",
                                calories: meal.calories || 0,
                                protein: meal.protein || 0,
                                carbs: meal.carbs || 0,
                                fat: meal.fat || 0,
                                completed: meal.completed || false,
                            })),
                        },
                    ])
                } else {
                    setMealLogs([])
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchMealLogs()
    }, [selectedDate])

    // Format date to string for data lookup
    const dateString = selectedDate.toISOString().split("T")[0]

    // Get meals for selected date
    const todaysMeals = mealLogs.find((log) => log.date === dateString)?.meals || []

    // Calculate daily totals
    const dailyTotals = {
        calories: todaysMeals.reduce((sum, meal) => sum + (meal.completed ? meal.calories : 0), 0),
        protein: todaysMeals.reduce((sum, meal) => sum + (meal.completed ? meal.protein : 0), 0),
        carbs: todaysMeals.reduce((sum, meal) => sum + (meal.carbs ? meal.carbs : 0), 0),
        fat: todaysMeals.reduce((sum, meal) => sum + (meal.fat ? meal.fat : 0), 0),
        completedMeals: todaysMeals.filter((meal) => meal.completed).length,
        totalMeals: todaysMeals.length,
    }

    // Calculate macronutrient percentages for the pie chart
    const totalMacros = dailyTotals.protein + dailyTotals.carbs + dailyTotals.fat
    const macroData = [
        { name: "Protein", value: dailyTotals.protein, color: "#10b981" }, // green
        { name: "Carbs", value: dailyTotals.carbs, color: "#6366f1" }, // indigo
        { name: "Fat", value: dailyTotals.fat, color: "#f59e0b" }, // amber
    ].filter((item) => item.value > 0)

    function handleDateChange(offset) {
        const date = new Date(selectedDate)
        date.setDate(date.getDate() + offset)
        setSelectedDate(date)
    }

    function formatDate(date) {
        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
        return date.toLocaleDateString("en-US", options)
    }

    async function handleToggleCompleted(mealId) {
        try {
            const response = await fetch(`${apiConfig.baseURL}/api/meals/${mealId}/toggle-completion`, {
                method: "PATCH",
                credentials: "include",
            })

            if (!response.ok) {
                throw new Error("Failed to toggle meal completion")
            }

            // Update the meal in our state
            setMealLogs((prevLogs) => {
                return prevLogs.map((log) => {
                    if (log.date === dateString) {
                        return {
                            ...log,
                            meals: log.meals.map((meal) => {
                                if (meal.id === mealId) {
                                    return { ...meal, completed: !meal.completed }
                                }
                                return meal
                            }),
                        }
                    }
                    return log
                })
            })
        } catch (error) {
            console.error("Error toggling meal completion:", error)
            // Optionally add error handling UI
        }
    }

    async function handleAddMeal(mealData) {
        try {
            // Add date to the meal data
            const mealWithDate = {
                ...mealData,
                date: dateString,
            }

            const response = await fetch(`${apiConfig.baseURL}/api/meals`, {
                method: "POST",

                credentials: "include",

                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(mealWithDate),
            })

            if (!response.ok) {
                throw new Error("Failed to add meal")
            }

            const { meal } = await response.json()

            const newMeal = {
                id: meal._id,
                ...mealData,
                completed: false,
            }

            // Update our state
            setMealLogs((prevLogs) => {
                // Check if we already have an entry for this date
                const existingLogIndex = prevLogs.findIndex((log) => log.date === dateString)

                if (existingLogIndex >= 0) {
                    // Update existing log
                    const updatedLogs = [...prevLogs]
                    updatedLogs[existingLogIndex] = {
                        ...updatedLogs[existingLogIndex],
                        meals: [...updatedLogs[existingLogIndex].meals, newMeal],
                    }
                    return updatedLogs
                } else {
                    // Create new log for this date
                    return [
                        ...prevLogs,
                        {
                            id: Date.now(),
                            date: dateString,
                            meals: [newMeal],
                        },
                    ]
                }
            })

            setShowAddMealForm(false)
        } catch (error) {
            console.error("Error adding meal:", error)
            // Optionally add error handling UI
        }
    }

    async function handleEditMeal(mealData) {
        try {
            const response = await fetch(`${apiConfig.baseURL}/api/meals/${editingMeal.id}`, {
                method: "PATCH",

                credentials: "include",

                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(mealData),
            })

            if (!response.ok) {
                throw new Error("Failed to update meal")
            }

            // Update the meal in our state
            setMealLogs((prevLogs) => {
                return prevLogs.map((log) => {
                    if (log.date === dateString) {
                        return {
                            ...log,
                            meals: log.meals.map((meal) => {
                                if (meal.id === editingMeal.id) {
                                    return { ...meal, ...mealData }
                                }
                                return meal
                            }),
                        }
                    }
                    return log
                })
            })

            setEditingMeal(null)
            setShowAddMealForm(false)
        } catch (error) {
            console.error("Error updating meal:", error)
            // Optionally add error handling UI
        }
    }

    async function handleDeleteMeal(mealId) {
        try {
            const response = await fetch(`${apiConfig.baseURL}/api/meals/${mealId}`, {
                method: "DELETE",

                credentials: "include",

            })

            if (!response.ok) {
                throw new Error("Failed to delete meal")
            }

            // Remove the meal from our state
            setMealLogs((prevLogs) => {
                return prevLogs.map((log) => {
                    if (log.date === dateString) {
                        return {
                            ...log,
                            meals: log.meals.filter((meal) => meal.id !== mealId),
                        }
                    }
                    return log
                })
            })
        } catch (error) {
            console.error("Error deleting meal:", error)
            // Optionally add error handling UI
        }
    }

    function handleDatePickerChange(date) {
        setSelectedDate(date)
        setShowDatePicker(false)
    }

    return (
        <div className="container mx-auto px-4 py-4 max-w-7xl">
            {/* Back button */}
            <div className="mb-4">
                <button
                    onClick={() => navigate("/profile")}
                    className="inline-flex items-center text-[13px] font-medium text-gray-700 hover:text-violet-600 transition-colors"
                >
                    <BackArrow className="mr-1.5 h-4 w-4" />
                    Back to Profile
                </button>
            </div>

            {/* Page title */}
            <h1 className="text-lg font-semibold text-gray-900 mb-4">Meal Tracker</h1>

            {/* Navigation tabs */}
            <div className="flex overflow-x-auto mb-5 pb-1 border-b">
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`flex items-center px-3 py-2 mr-2 text-[13px] rounded-md whitespace-nowrap transition-colors ${isActive(item.path) ? "bg-violet-600 text-white shadow-[13px]" : "text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <item.icon className="mr-1.5 h-3.5 w-3.5" />
                        {item.name}
                    </button>
                ))}
            </div>

            {/* Date selector */}
            <div className="flex justify-between items-center mb-4 bg-white p-3 border shadow-[13px] rounded-md">
                <button className="p-1 text-gray-600 hover:bg-gray-100 rounded-md" onClick={() => handleDateChange(-1)}>
                    <ArrowLeft size={16} />
                </button>
                <div className="flex items-center relative">
                    <button
                        className="flex items-center text-[13px] font-medium"
                        onClick={() => setShowDatePicker(!showDatePicker)}
                    >
                        <Calendar size={14} className="mr-1.5 text-violet-600" />
                        <span>{formatDate(selectedDate)}</span>
                    </button>

                    {showDatePicker && (
                        <div className="absolute top-full mt-1 z-10">
                            <DatePicker
                                selected={selectedDate}
                                onChange={handleDatePickerChange}
                                inline
                                className="border shadow-md rounded-md"
                            />
                        </div>
                    )}
                </div>
                <button className="p-1 text-gray-600 hover:bg-gray-100 rounded-md" onClick={() => handleDateChange(1)}>
                    <ArrowRight size={16} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Meal tracking list */}
                <div className="md:col-span-2">
                    <div className="bg-white border shadow-[13px] p-4 rounded-md">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-[13px] font-medium text-gray-700">Today's Meals</h2>
                            <button
                                className="flex items-center bg-violet-600 text-white px-2.5 py-1 text-[13px] rounded-md hover:bg-violet-700 transition-colors shadow-[13px]"
                                onClick={() => {
                                    setEditingMeal(null)
                                    setShowAddMealForm(true)
                                }}
                            >
                                <Plus size={14} className="mr-1" /> Log Meal
                            </button>
                        </div>

                        {todaysMeals.length === 0 ? (
                            <div className="text-center py-6 text-[13px] text-gray-500">
                                No meals logged for today. Click "Log Meal" to get started.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {todaysMeals
                                    .sort((a, b) => a.time.localeCompare(b.time))
                                    .map((meal) => (
                                        <div key={meal.id} className="border p-3 rounded-md">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start">
                                                    <input
                                                        type="checkbox"
                                                        checked={meal.completed}
                                                        onChange={() => handleToggleCompleted(meal.id)}
                                                        className="mt-1 mr-2"
                                                    />
                                                    <div>
                                                        <h3
                                                            className={`text-[13px] font-medium ${meal.completed ? "text-gray-500 line-through" : "text-gray-900"}`}
                                                        >
                                                            {meal.name}
                                                        </h3>
                                                        <div className="text-[10px] text-gray-500 mt-0.5">{meal.time}</div>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-1">
                                                    <button
                                                        className="p-1 text-gray-500 hover:text-violet-600 rounded-md"
                                                        onClick={() => {
                                                            setEditingMeal(meal)
                                                            setShowAddMealForm(true)
                                                        }}
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        className="p-1 text-gray-500 hover:text-red-600 rounded-md"
                                                        onClick={() => handleDeleteMeal(meal.id)}
                                                    >
                                                        <Trash size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mt-1 flex text-[10px] space-x-3 text-gray-600 pl-5">
                                                <span>{meal.calories} cal</span>
                                                <span>{meal.protein}g protein</span>
                                                <span>{meal.carbs}g carbs</span>
                                                <span>{meal.fat}g fat</span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Daily summary */}
                <div>
                    <div className="bg-white border shadow-[13px] p-4 rounded-md h-full">
                        <h2 className="text-[13px] font-medium text-gray-700 mb-3">Daily Summary</h2>

                        <div className="text-center mb-3">
                            <div className="text-lg font-medium">{dailyTotals.calories}</div>
                            <div className="text-[10px] text-gray-500">Calories Consumed</div>
                        </div>

                        <div className="mb-3 text-center">
                            <div className="inline-flex items-center justify-center">
                                <div className="text-[13px] font-medium">
                                    {dailyTotals.completedMeals}/{dailyTotals.totalMeals}
                                </div>
                                <div className="text-[10px] text-gray-500 ml-1">meals completed</div>
                            </div>
                        </div>

                        {totalMacros > 0 && (
                            <div className="h-40 mb-3">
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
                                        >
                                            {macroData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                                <div className="text-[13px] font-medium">{dailyTotals.protein}g</div>
                                <div className="text-[10px] text-gray-500">Protein</div>
                                <div className="text-[10px] text-gray-400">
                                    {totalMacros > 0 ? Math.round((dailyTotals.protein / totalMacros) * 100) : 0}%
                                </div>
                            </div>
                            <div>
                                <div className="text-[13px] font-medium">{dailyTotals.carbs}g</div>
                                <div className="text-[10px] text-gray-500">Carbs</div>
                                <div className="text-[10px] text-gray-400">
                                    {totalMacros > 0 ? Math.round((dailyTotals.carbs / totalMacros) * 100) : 0}%
                                </div>
                            </div>
                            <div>
                                <div className="text-[13px] font-medium">{dailyTotals.fat}g</div>
                                <div className="text-[10px] text-gray-500">Fat</div>
                                <div className="text-[10px] text-gray-400">
                                    {totalMacros > 0 ? Math.round((dailyTotals.fat / totalMacros) * 100) : 0}%
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <button
                                onClick={() => navigate("/meal/planner")}
                                className="w-full flex items-center justify-center bg-white border border-gray-200 text-violet-600 px-3 py-2 text-[13px] rounded-md hover:bg-gray-50 transition-colors shadow-[13px]"
                            >
                                <Calendar size={14} className="mr-1.5" />
                                Go to Meal Planner
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add/Edit meal form */}
            {showAddMealForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 max-w-md w-full max-h-[90vh] overflow-y-auto rounded-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-[13px] font-medium">{editingMeal ? "Edit Meal" : "Log Meal"}</h2>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => {
                                    setShowAddMealForm(false)
                                    setEditingMeal(null)
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                const formData = new FormData(e.target)
                                const mealData = {
                                    name: formData.get("name"),
                                    time: formData.get("time"),
                                    calories: Number.parseInt(formData.get("calories")) || 0,
                                    protein: Number.parseInt(formData.get("protein")) || 0,
                                    carbs: Number.parseInt(formData.get("carbs")) || 0,
                                    fat: Number.parseInt(formData.get("fat")) || 0,
                                    completed: editingMeal ? editingMeal.completed : false,
                                }

                                if (editingMeal) {
                                    handleEditMeal(mealData)
                                } else {
                                    handleAddMeal(mealData)
                                }
                            }}
                        >
                            <div className="space-y-3">
                                <div>
                                    <label htmlFor="name" className="block text-[13px] font-medium text-gray-700 mb-1">
                                        Meal Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        defaultValue={editingMeal?.name || ""}
                                        className="w-full border text-[13px] p-2 focus:outline-none focus:ring-1 focus:ring-violet-500 rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="time" className="block text-[13px] font-medium text-gray-700 mb-1">
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        id="time"
                                        name="time"
                                        defaultValue={editingMeal?.time || "12:00"}
                                        className="w-full border text-[13px] p-2 focus:outline-none focus:ring-1 focus:ring-violet-500 rounded-md"
                                        required
                                    />
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
                                            defaultValue={editingMeal?.calories || 0}
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
                                            defaultValue={editingMeal?.protein || 0}
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
                                            defaultValue={editingMeal?.carbs || 0}
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
                                            defaultValue={editingMeal?.fat || 0}
                                            min="0"
                                            className="w-full border text-[13px] p-2 focus:outline-none focus:ring-1 focus:ring-violet-500 rounded-md"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2 pt-2">
                                    <button
                                        type="button"
                                        className="border px-3 py-1.5 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors rounded-md"
                                        onClick={() => {
                                            setShowAddMealForm(false)
                                            setEditingMeal(null)
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-violet-600 px-3 py-1.5 text-[13px] text-white hover:bg-violet-700 transition-colors shadow-[13px] rounded-md"
                                    >
                                        {editingMeal ? "Update" : "Add"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
