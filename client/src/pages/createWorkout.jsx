"use client"

import { useState, useEffect } from "react"
import { useRecoilState } from "recoil"
import { activeWorkoutState } from "../state/workoutState"
import { Clock, Check, Plus, Search, X, Dumbbell, ChevronRight, ArrowRight, Edit, Save, ChevronDown, Info, Pencil } from 'lucide-react'
import apiConfig from "../config/api"

export default function CreateWorkout({ onWorkoutCreated }) {
  const [, setActiveWorkout] = useRecoilState(activeWorkoutState)
  const [workoutName, setWorkoutName] = useState("")
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [sets, setSets] = useState(3)
  const [reps, setReps] = useState(12)
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState({ show: false, message: "", type: "" })
  const [showDefaultWorkouts, setShowDefaultWorkouts] = useState(false)
  const [defaultWorkouts, setDefaultWorkouts] = useState([])
  const [selectedDefaultWorkout, setSelectedDefaultWorkout] = useState(null)
  const [estimatedTime, setEstimatedTime] = useState(0)
  const [activeTab, setActiveTab] = useState("templates") // 'templates' or 'custom'
  const [muscleGroupFilter, setMuscleGroupFilter] = useState("all")
  const [showCustomExerciseForm, setShowCustomExerciseForm] = useState(false)
  const [editingExerciseIndex, setEditingExerciseIndex] = useState(null)
  const [customExercise, setCustomExercise] = useState({
    name: "",
    muscleGroup: "chest",
    category: "strength",
    description: "",
  })

  // Default workouts
  useEffect(() => {
    const defaultWorkouts = [
      {
        id: "1",
        name: "Full Body Strength",
        description: "A complete full body workout targeting all major muscle groups",
        category: "strength",
        level: "intermediate",
        image: "images/FullBody.jpg",
        exercises: [
          {
            _id: "ex1",
            name: "Barbell Squat",
            muscleGroup: "legs",
            category: "strength",
            description: "A compound exercise that targets the quadriceps, hamstrings, and glutes",
            sets: Array.from({ length: 3 }, (_, i) => ({
              setNumber: i + 1,
              weight: null,
              reps: 12,
              completed: false,
            })),
          },
          {
            _id: "ex2",
            name: "Bench Press",
            muscleGroup: "chest",
            category: "strength",
            description: "A compound exercise that targets the chest, shoulders, and triceps",
            sets: Array.from({ length: 3 }, (_, i) => ({
              setNumber: i + 1,
              weight: null,
              reps: 12,
              completed: false,
            })),
          },
          {
            _id: "ex3",
            name: "Deadlift",
            muscleGroup: "back",
            category: "strength",
            description: "A compound exercise that targets the back, glutes, and hamstrings",
            sets: Array.from({ length: 3 }, (_, i) => ({
              setNumber: i + 1,
              weight: null,
              reps: 12,
              completed: false,
            })),
          },
        ],
      },
      {
        id: "2",
        name: "Upper Body Push",
        description: "Focus on pushing movements for chest, shoulders, and triceps",
        category: "strength",
        level: "beginner",
        image: "images/UpperBody.jpg",
        exercises: [
          {
            _id: "ex4",
            name: "Push-ups",
            muscleGroup: "chest",
            category: "bodyweight",
            description: "A bodyweight exercise that targets the chest, shoulders, and triceps",
            sets: Array.from({ length: 3 }, (_, i) => ({
              setNumber: i + 1,
              weight: null,
              reps: 12,
              completed: false,
            })),
          },
          {
            _id: "ex5",
            name: "Dumbbell Shoulder Press",
            muscleGroup: "shoulders",
            category: "strength",
            description: "An isolation exercise that targets the shoulders",
            sets: Array.from({ length: 3 }, (_, i) => ({
              setNumber: i + 1,
              weight: null,
              reps: 12,
              completed: false,
            })),
          },
          {
            _id: "ex6",
            name: "Tricep Dips",
            muscleGroup: "triceps",
            category: "bodyweight",
            description: "A bodyweight exercise that targets the triceps",
            sets: Array.from({ length: 3 }, (_, i) => ({
              setNumber: i + 1,
              weight: null,
              reps: 12,
              completed: false,
            })),
          },
        ],
      },
      {
        id: "3",
        name: "Lower Body Focus",
        description: "Intense leg workout targeting all lower body muscles",
        category: "strength",
        level: "advanced",
        image: "images/LowerBody.jpeg",
        exercises: [
          {
            _id: "ex7",
            name: "Barbell Squat",
            muscleGroup: "legs",
            category: "strength",
            description: "A compound exercise that targets the quadriceps, hamstrings, and glutes",
            sets: Array.from({ length: 3 }, (_, i) => ({
              setNumber: i + 1,
              weight: null,
              reps: 12,
              completed: false,
            })),
          },
          {
            _id: "ex8",
            name: "Romanian Deadlift",
            muscleGroup: "hamstrings",
            category: "strength",
            description: "A variation of the deadlift that targets the hamstrings",
            sets: Array.from({ length: 3 }, (_, i) => ({
              setNumber: i + 1,
              weight: null,
              reps: 12,
              completed: false,
            })),
          },
          {
            _id: "ex9",
            name: "Leg Press",
            muscleGroup: "quadriceps",
            category: "machine",
            description: "A machine exercise that targets the quadriceps",
            sets: Array.from({ length: 3 }, (_, i) => ({
              setNumber: i + 1,
              weight: null,
              reps: 12,
              completed: false,
            })),
          },
          {
            _id: "ex10",
            name: "Calf Raises",
            muscleGroup: "calves",
            category: "strength",
            description: "An isolation exercise that targets the calves",
            sets: Array.from({ length: 3 }, (_, i) => ({
              setNumber: i + 1,
              weight: null,
              reps: 12,
              completed: false,
            })),
          },
        ],
      },
      {
        id: "4",
        name: "HIIT Cardio",
        description: "High-intensity interval training for maximum calorie burn",
        category: "cardio",
        level: "intermediate",
        image: "images/Cardio.webp",
        exercises: [
          {
            _id: "ex11",
            name: "Burpees",
            muscleGroup: "full body",
            category: "cardio",
            description: "A full-body exercise that combines a squat, push-up, and jump",
            sets: Array.from({ length: 4 }, (_, i) => ({
              setNumber: i + 1,
              weight: null,
              reps: 15,
              completed: false,
            })),
          },
          {
            _id: "ex12",
            name: "Mountain Climbers",
            muscleGroup: "core",
            category: "cardio",
            description: "A dynamic exercise that targets the core and increases heart rate",
            sets: Array.from({ length: 4 }, (_, i) => ({
              setNumber: i + 1,
              weight: null,
              reps: 20,
              completed: false,
            })),
          },
          {
            _id: "ex13",
            name: "Jump Squats",
            muscleGroup: "legs",
            category: "cardio",
            description: "A plyometric exercise that targets the legs and increases heart rate",
            sets: Array.from({ length: 4 }, (_, i) => ({
              setNumber: i + 1,
              weight: null,
              reps: 15,
              completed: false,
            })),
          },
        ],
      },
      {
        id: "5",
        name: "Core Crusher",
        description: "Focused abdominal and core workout for strength and definition",
        category: "strength",
        level: "beginner",
        image: "images/Core.jpg",
        exercises: [
          {
            _id: "ex14",
            name: "Plank",
            muscleGroup: "core",
            category: "bodyweight",
            description: "An isometric exercise that targets the core and improves stability",
            sets: Array.from({ length: 3 }, (_, i) => ({
              setNumber: i + 1,
              weight: null,
              reps: 60, // seconds
              completed: false,
            })),
          },
          {
            _id: "ex15",
            name: "Crunches",
            muscleGroup: "core",
            category: "bodyweight",
            description: "An isolation exercise that targets the abdominals",
            sets: Array.from({ length: 3 }, (_, i) => ({
              setNumber: i + 1,
              weight: null,
              reps: 20,
              completed: false,
            })),
          },
          {
            _id: "ex16",
            name: "Russian Twists",
            muscleGroup: "core",
            category: "bodyweight",
            description: "A rotational exercise that targets the obliques",
            sets: Array.from({ length: 3 }, (_, i) => ({
              setNumber: i + 1,
              weight: null,
              reps: 20,
              completed: false,
            })),
          },
        ],
      },
    ]

    setDefaultWorkouts(defaultWorkouts)
  }, [])

  // Calculate estimated workout time
  useEffect(() => {
    if (exercises.length === 0) {
      setEstimatedTime(0)
      return
    }

    const totalSets = exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0)
    const timePerSet = 45
    const restBetweenSets = 60
    const restBetweenExercises = 300

    const totalTimeSeconds =
      totalSets * timePerSet +
      (totalSets - exercises.length) * restBetweenSets +
      (exercises.length - 1) * restBetweenExercises

    setEstimatedTime(Math.ceil(totalTimeSeconds / 60))
  }, [exercises])

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setSearchLoading(true)
      const response = await fetch(
        `${apiConfig.baseURL}/api/exercises/search?q=${encodeURIComponent(searchQuery)}${muscleGroupFilter !== "all" ? `&muscleGroup=${muscleGroupFilter}` : ""}`,
        {
          credentials: "include",
        },
      )

      if (!response.ok) {
        throw new Error("Failed to search exercises")
      }

      const data = await response.json()
      setSearchResults(data)
    } catch (err) {
      console.error("Error searching exercises:", err)
      showToast("Failed to search exercises. Please try again.", "error")
    } finally {
      setSearchLoading(false)
    }
  }

  const handleAddExercise = () => {
    if (!selectedExercise) return

    const exerciseSets = Array.from({ length: sets }, (_, i) => ({
      setNumber: i + 1,
      weight: null,
      reps: reps,
      completed: false,
    }))

    setExercises([
      ...exercises,
      {
        ...selectedExercise,
        sets: exerciseSets,
      },
    ])

    setSelectedExercise(null)
    setSets(3)
    setReps(12)
    setSearchQuery("")
    setSearchResults([])
    setShowModal(false)
  }

  const handleAddCustomExercise = () => {
    if (!customExercise.name.trim()) {
      showToast("Please enter an exercise name", "error")
      return
    }

    const newCustomExercise = {
      _id: `custom-${Date.now()}`,
      ...customExercise,
      sets: Array.from({ length: sets }, (_, i) => ({
        setNumber: i + 1,
        weight: null,
        reps: reps,
        completed: false,
      })),
    }

    setExercises([...exercises, newCustomExercise])

    setCustomExercise({
      name: "",
      muscleGroup: "chest",
      category: "strength",
      description: "",
    })
    setShowCustomExerciseForm(false)
    showToast("Custom exercise added", "success")
  }

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const handleCreateWorkout = async () => {
    if (!workoutName.trim()) {
      showToast("Please enter a workout name", "error")
      return
    }

    if (exercises.length === 0) {
      showToast("Please add at least one exercise", "error")
      return
    }

    try {
      setLoading(true)

      const workout = {
        name: workoutName,
        exercises,
        date: new Date().toISOString(),
        estimatedDuration: estimatedTime,
      }

      const response = await fetch(`${apiConfig.baseURL}/api/workouts`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workout),
      })

      if (!response.ok) {
        throw new Error("Failed to create workout")
      }

      const data = await response.json()
      setActiveWorkout(data)

      showToast("Your workout has been created successfully!")

      setWorkoutName("")
      setExercises([])

      if (onWorkoutCreated) {
        onWorkoutCreated()
      }
    } catch (err) {
      console.error("Error creating workout:", err)
      showToast("Failed to create workout. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  const handleSelectDefaultWorkout = (workout) => {
    setSelectedDefaultWorkout(workout)
    setWorkoutName(workout.name)
    setExercises([...workout.exercises])
    setShowDefaultWorkouts(false)
    showToast(`${workout.name} template loaded`, "success")
  }

  const handleContinueWorkout = () => {
    setActiveTab("custom");
  };

  const handleEditExercise = (index) => {
    setEditingExerciseIndex(index);
  };

  const handleSaveExerciseEdit = (index, updatedSets) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      sets: updatedSets
    };
    setExercises(updatedExercises);
    setEditingExerciseIndex(null);
    showToast("Exercise updated successfully", "success");
  };

  const handleUpdateSetReps = (exerciseIndex, setIndex, newReps) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets[setIndex].reps = parseInt(newReps, 10);
    setExercises(updatedExercises);
  };

  const muscleGroups = [
    { value: "all", label: "All Muscles" },
    { value: "chest", label: "Chest" },
    { value: "back", label: "Back" },
    { value: "legs", label: "Legs" },
    { value: "shoulders", label: "Shoulders" },
    { value: "arms", label: "Arms" },
    { value: "core", label: "Core" },
    { value: "cardio", label: "Cardio" },
  ]

  const categories = [
    { value: "strength", label: "Strength" },
    { value: "cardio", label: "Cardio" },
    { value: "bodyweight", label: "Bodyweight" },
    { value: "machine", label: "Machine" },
    { value: "functional", label: "Functional" },
  ]

  return (
    <div className="space-y-4 max-w-4xl mx-auto bg-white rounded-md shadow-[13px]">
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-md p-3 shadow-md text-[13px] ${
            toast.type === "error" ? "bg-red-500 text-white" : "bg-violet-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-[13px] font-bold text-violet-800">Create Workout</h2>
        {estimatedTime > 0 && (
          <div className="flex items-center text-[13px] text-gray-600">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>Est. time: {estimatedTime} min</span>
          </div>
        )}
      </div>

      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 text-[13px] rounded-md font-medium transition-colors ${
            activeTab === "templates" 
              ? "border-b-2 border-violet-600 text-violet-700 bg-violet-50" 
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("templates")}
        >
          Workout Templates
        </button>
        <button
          className={`px-4 py-2 text-[13px] font-medium transition-colors ${
            activeTab === "custom" 
              ? "border-b-2 rounded-md border-violet-600 text-violet-700 bg-violet-50" 
              : "text-gray-600 hover:bg-gray-50"
          }`}
          onClick={() => setActiveTab("custom")}
        >
          Custom Workout
        </button>
      </div>

      {activeTab === "templates" ? (
        <div className="space-y-4 p-4">
          <div className="rounded-md border border-gray-200 p-4 bg-gray-50">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 space-y-1.5">
                  <label htmlFor="workout-name" className="block text-[13px] font-medium text-violet-700">
                    Workout Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="workout-name"
                      placeholder="e.g., Upper Body Strength"
                      value={workoutName}
                      onChange={(e) => setWorkoutName(e.target.value)}
                      className="flex-1 rounded-md border border-gray-200 px-3 py-1.5 text-[13px] focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-100"
                    />
                  </div>
                </div>
                <button
                  onClick={handleContinueWorkout}
                  className="mt-4 flex items-center rounded-md bg-violet-600 px-3 py-1.5 text-[13px] text-white hover:bg-violet-700 transition-colors shadow-[13px]"
                >
                  Continue <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {defaultWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="cursor-pointer overflow-hidden rounded-md border border-gray-200 shadow-[13px] transition-all hover:shadow-md hover:border-violet-200"
                onClick={() => {
                  handleSelectDefaultWorkout(workout)
                  handleContinueWorkout();
                }}
              >
                <div className="relative h-32 bg-gray-100">
                  <img
                    src={workout.image || "/placeholder.svg?height=128&width=384"}
                    alt={workout.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <h3 className="text-[13px] font-bold text-white">{workout.name}</h3>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-[13px] text-gray-600">{workout.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex space-x-1.5">
                      <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[13px] font-medium text-violet-800">
                        {workout.level.charAt(0).toUpperCase() + workout.level.slice(1)}
                      </span>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[13px] font-medium text-blue-800">
                        {workout.category.charAt(0).toUpperCase() + workout.category.slice(1)}
                      </span>
                    </div>
                    <span className="text-[13px] text-gray-500">{workout.exercises.length} exercises</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {exercises.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleCreateWorkout}
                className="flex items-center rounded-md bg-violet-600 px-4 py-2 text-[13px] text-white hover:bg-violet-700 transition-colors shadow-[13px]"
                disabled={loading}
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    Start Workout <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 p-4">
          <div className="rounded-md border border-gray-200 p-4 bg-gray-50">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="workout-name" className="block text-[13px] font-medium text-violet-700">
                  Workout Name
                </label>
                <input
                  id="workout-name"
                  placeholder="e.g., Upper Body Strength"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-[13px] focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-100"
                />
              </div>
              {estimatedTime > 0 && (
                <div className="flex items-center text-[13px] text-gray-600 bg-violet-50 p-2 rounded-md">
                  <Clock className="h-3.5 w-3.5 mr-1 text-violet-600" />
                  <span>Estimated workout time: <span className="font-medium text-violet-700">{estimatedTime} minutes</span></span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-md border border-gray-200 shadow-[13px]">
            <div className="flex items-center justify-between border-b border-gray-200 p-4 bg-gray-50">
              <h2 className="text-[13px] font-bold text-violet-800">Exercises</h2>
              <div className="flex space-x-2">
                <button
                  className="flex items-center rounded-md bg-violet-600 text-white px-2.5 py-1.5 text-[13px] hover:bg-violet-700 transition-colors shadow-[13px]"
                  onClick={() => setShowModal(true)}
                >
                  <Search className="mr-1 h-3.5 w-3.5" />
                  Find Exercise
                </button>
                <button
                  className="flex items-center rounded-md bg-violet-600 text-white px-2.5 py-1.5 text-[13px] hover:bg-violet-700 transition-colors shadow-[13px]"
                  onClick={() => setShowCustomExerciseForm(true)}
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Create Exercise
                </button>
              </div>
            </div>
            <div className="space-y-3 p-4">
              {exercises.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed border-gray-200 text-center bg-gray-50">
                  <Dumbbell className="mb-2 h-6 w-6 text-violet-300" />
                  <p className="text-[13px] text-gray-600">No exercises added yet</p>
                  <p className="mt-1 text-[13px] text-gray-500">Click "Find Exercise" or "Create Exercise" to start building your workout</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {exercises.map((exercise, index) => (
                    <div key={index} className="overflow-hidden rounded-md border border-gray-200 shadow-[13px]">
                      <div className="flex items-center justify-between bg-gray-50 p-3 border-b border-gray-200">
                        <div>
                          <h3 className="text-[13px] font-medium text-violet-800">{exercise.name}</h3>
                          <p className="text-[13px] text-gray-500">
                            {exercise.muscleGroup.charAt(0).toUpperCase() + exercise.muscleGroup.slice(1)} •{" "}
                            {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <button
                            className="text-gray-500 hover:text-violet-600 transition-colors"
                            onClick={() => handleEditExercise(index)}
                            title="Edit sets and reps"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="text-gray-500 hover:text-red-500 transition-colors"
                            onClick={() => handleRemoveExercise(index)}
                            title="Remove exercise"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="p-3 space-y-3">
                        {editingExerciseIndex === index ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[13px] font-medium text-violet-700">Edit Sets & Reps</h4>
                              <button
                                onClick={() => handleSaveExerciseEdit(index, exercise.sets)}
                                className="flex items-center text-[13px] bg-violet-600 text-white px-2 py-1 rounded-md hover:bg-violet-700 transition-colors"
                              >
                                <Save className="h-3 w-3 mr-1" /> Save Changes
                              </button>
                            </div>
                            <div className="rounded-md border border-gray-200 shadow-[13px] overflow-hidden">
                              <div className="grid grid-cols-3 gap-2 bg-violet-600 text-white p-2 text-[13px] font-medium">
                                <div className="px-2">Set</div>
                                <div className="px-2">Reps</div>
                                <div className="px-2">Actions</div>
                              </div>
                              
                              <div className="divide-y divide-gray-100">
                                {exercise.sets.map((set, setIndex) => (
                                  <div 
                                    key={setIndex} 
                                    className="grid grid-cols-3 gap-2 p-2 text-[13px] transition-colors hover:bg-gray-50"
                                  >
                                    <div className="px-2 font-medium text-violet-600">
                                      {set.setNumber}
                                    </div>
                                    
                                    <div className="px-2">
                                      <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={set.reps}
                                        onChange={(e) => handleUpdateSetReps(index, setIndex, e.target.value)}
                                        className="w-14 border border-gray-200 rounded-md px-2 py-1 text-center text-[13px] focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-100"
                                      />
                                    </div>
                                    
                                    <div className="px-2 flex items-center">
                                      <button
                                        onClick={() => {
                                          const updatedSets = [...exercise.sets];
                                          if (updatedSets.length > 1) {
                                            updatedSets.splice(setIndex, 1);
                                            const updatedExercise = {...exercise, sets: updatedSets.map((s, i) => ({...s, setNumber: i + 1}))};
                                            const newExercises = [...exercises];
                                            newExercises[index] = updatedExercise;
                                            setExercises(newExercises);
                                          } else {
                                            showToast("Exercise must have at least one set", "error");
                                          }
                                        }}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                        title="Remove set"
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="p-2 bg-gray-50 border-t border-gray-200">
                                <button
                                  onClick={() => {
                                    const updatedExercise = {...exercise};
                                    const newSetNumber = exercise.sets.length + 1;
                                    updatedExercise.sets = [
                                      ...updatedExercise.sets,
                                      {
                                        setNumber: newSetNumber,
                                        weight: null,
                                        reps: exercise.sets[0].reps,
                                        completed: false
                                      }
                                    ];
                                    const newExercises = [...exercises];
                                    newExercises[index] = updatedExercise;
                                    setExercises(newExercises);
                                  }}
                                  className="text-[13px] flex items-center text-violet-600 hover:text-violet-800 transition-colors"
                                >
                                  <Plus className="h-3 w-3 mr-1" /> Add Set
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-md border border-gray-200 shadow-[13px] overflow-hidden">
                            {/* Header */}
                            <div className="grid grid-cols-3 gap-2 bg-violet-600 text-white p-2 text-[13px] font-medium">
                              <div className="px-2">Set</div>
                              <div className="px-2">Previous</div>
                              <div className="px-2">Target</div>
                            </div>
                            
                            {/* Sets List */}
                            <div className="divide-y divide-gray-100">
                              {exercise.sets.map((set, setIndex) => (
                                <div 
                                  key={setIndex} 
                                  className={`grid grid-cols-3 gap-2 p-2 text-[13px] transition-colors ${
                                    set.completed ? 'bg-violet-50' : 'hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="px-2 font-medium text-violet-600">
                                    {set.setNumber}
                                  </div>
                                  
                                  <div className="px-2 flex items-center">
                                    {set.completedReps ? (
                                      <span className="font-medium text-violet-600">
                                        {set.completedReps} reps
                                      </span>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </div>
                                  
                                  <div className="px-2 flex items-center justify-between">
                                    <span className="text-gray-600">
                                      {set.targetReps || set.reps} reps
                                    </span>
                                    {set.completed && (
                                      <Check className="h-3.5 w-3.5 text-violet-600" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Exercise Description */}
                        {exercise.description && (
                          <div className="p-2 bg-violet-50 rounded-md border border-violet-100">
                            <h4 className="text-[13px] font-semibold text-violet-600 mb-1">Notes</h4>
                            <p className="text-[13px] text-gray-700">{exercise.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-between border-t border-gray-200 p-4 bg-gray-50">
              <button
                onClick={() => window.history.back()}
                className="rounded-md border border-gray-200 px-3 py-1.5 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWorkout}
                className="flex items-center rounded-md bg-violet-600 px-4 py-1.5 text-[13px] text-white hover:bg-violet-700 transition-colors shadow-[13px]"
                disabled={loading}
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    Start Workout <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-md bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[13px] font-bold text-violet-800">Add Exercise</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    placeholder="Search exercises..."
                    className="w-full rounded-md border border-gray-200 pl-8 py-1.5 text-[13px] focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-100"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <button
                  className="rounded-md bg-violet-600 px-3 py-1.5 text-[13px] text-white hover:bg-violet-700 transition-colors shadow-[13px]"
                  onClick={handleSearch}
                  disabled={searchLoading}
                >
                  {searchLoading ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    "Search"
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {muscleGroups.map((group) => (
                  <button
                    key={group.value}
                    className={`rounded-full px-2 py-0.5 text-[13px] font-medium transition-colors ${
                      muscleGroupFilter === group.value
                        ? "bg-violet-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setMuscleGroupFilter(group.value)}
                  >
                    {group.label}
                  </button>
                ))}
              </div>

              <div className="max-h-[250px] overflow-y-auto rounded-md border border-gray-200">
                {searchResults.length === 0 ? (
                  <div className="flex h-20 items-center justify-center text-[13px] text-gray-500">
                    {searchQuery ? "No exercises found" : "Search for exercises to add"}
                  </div>
                ) : (
                  <div className="space-y-1 p-1">
                    {searchResults.map((exercise) => (
                      <div
                        key={exercise._id}
                        className={`flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors ${
                          selectedExercise?._id === exercise._id ? "bg-violet-600 text-white" : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedExercise(exercise)}
                      >
                        <div>
                          <div className="text-[13px] font-medium">{exercise.name}</div>
                          <div className="text-[13px] opacity-80">
                            {exercise.muscleGroup.charAt(0).toUpperCase() + exercise.muscleGroup.slice(1)} •{" "}
                            {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
                          </div>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedExercise && (
                <div className="space-y-2 rounded-md border border-gray-200 p-3 bg-gray-50">
                  <div className="text-[13px] font-medium text-violet-800">{selectedExercise.name}</div>
                  <div className="text-[13px] text-gray-600">{selectedExercise.description}</div>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="space-y-1">
                      <label htmlFor="sets" className="block text-[13px] font-medium text-gray-700">
                        Number of Sets
                      </label>
                      <select
                        id="sets"
                        value={sets}
                        onChange={(e) => setSets(Number.parseInt(e.target.value))}
                        className="w-full rounded-md border border-gray-200 px-2 py-1 text-[13px] focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-100"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="reps" className="block text-[13px] font-medium text-gray-700">
                        Reps per Set
                      </label>
                      <select
                        id="reps"
                        value={reps}
                        onChange={(e) => setReps(Number.parseInt(e.target.value))}
                        className="w-full rounded-md border border-gray-200 px-2 py-1 text-[13px] focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-100"
                      >
                        {[6, 8, 10, 12, 15, 20].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="rounded-md border border-gray-200 px-3 py-1.5 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setSelectedExercise(null)
                  setShowModal(false)
                }}
              >
                Cancel
              </button>
              <button
                className={`rounded-md bg-violet-600 px-3 py-1.5 text-[13px] text-white hover:bg-violet-700 transition-colors shadow-[13px] ${
                  !selectedExercise ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleAddExercise}
                disabled={!selectedExercise}
              >
                Add to Workout
              </button>
            </div>
          </div>
        </div>
      )}

      {showCustomExerciseForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-md bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[13px] font-bold text-violet-800">Create Custom Exercise</h2>
              <button onClick={() => setShowCustomExerciseForm(false)} className="text-gray-500 hover:text-gray-700 transition-colors">
                <X className="h-4 w-4 bg-violet-600 text-white p-0.5 rounded-md" />
              </button>
            </div>

            <div className="mt-3 space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="exercise-name" className="block text-[13px] font-medium text-gray-700">
                  Exercise Name *
                </label>
                <input
                  id="exercise-name"
                  placeholder="e.g., Cable Crossover"
                  value={customExercise.name}
                  onChange={(e) => setCustomExercise({ ...customExercise, name: e.target.value })}
                  className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-[13px] focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-100"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="muscle-group" className="block text-[13px] font-medium text-gray-700">
                  Muscle Group
                </label>
                <select
                  id="muscle-group"
                  value={customExercise.muscleGroup}
                  onChange={(e) => setCustomExercise({ ...customExercise, muscleGroup: e.target.value })}
                  className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-[13px] focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-100"
                >   
                  {muscleGroups
                    .filter((g) => g.value !== "all")
                    .map((group) => (
                      <option key={group.value} value={group.value}>
                        {group.label}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="category" className="block text-[13px] font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  value={customExercise.category}
                  onChange={(e) => setCustomExercise({ ...customExercise, category: e.target.value })}
                  className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-[13px] focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-100"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="description" className="block text-[13px] font-medium text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  placeholder="Describe how to perform this exercise..."
                  value={customExercise.description}
                  onChange={(e) => setCustomExercise({ ...customExercise, description: e.target.value })}
                  className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-[13px] focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-100"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="custom-sets" className="block text-[13px] font-medium text-gray-700">
                    Number of Sets
                  </label>
                  <select
                    id="custom-sets"
                    value={sets}
                    onChange={(e) => setSets(Number.parseInt(e.target.value))}
                    className="w-full rounded-md border border-gray-200 px-2 py-1 text-[13px] focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-100"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="custom-reps" className="block text-[13px] font-medium text-gray-700">
                    Reps per Set
                  </label>
                  <select
                    id="custom-reps"
                    value={reps}
                    onChange={(e) => setReps(Number.parseInt(e.target.value))}
                    className="w-full rounded-md border border-gray-200 px-2 py-1 text-[13px] focus:border-violet-300 focus:outline-none focus:ring-1 focus:ring-violet-100"
                  >
                    {[6, 8, 10, 12, 15, 20].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="rounded-md border border-gray-200 px-3 py-1.5 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => setShowCustomExerciseForm(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-violet-600 px-3 py-1.5 text-[13px] text-white hover:bg-violet-700 transition-colors shadow-[13px]"
                onClick={handleAddCustomExercise}
              >
                Add Exercise
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
