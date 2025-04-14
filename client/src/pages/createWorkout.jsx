"use client"

import { useState, useEffect } from "react"
import { useRecoilState } from "recoil"
import { activeWorkoutState } from "../state/workoutState"
import { Clock,Check, Plus, Search, X, Dumbbell, ChevronRight, ArrowRight } from "lucide-react"
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
    <div className="space-y-6">
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-md p-4 shadow-md ${
            toast.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Create Workout</h2>

      </div>

      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "templates" ? "border-b-2 border-violet-600 text-violet-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("templates")}
        >
          Workout Templates
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "custom" ? "border-b-2 border-violet-600 text-violet-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("custom")}
        >
          Custom Workout
        </button>
      </div>

      {activeTab === "templates" ? (
        <div className="space-y-6">
          <div className="rounded-lg border p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
              <div className="flex-1 space-y-2">
  <label htmlFor="workout-name" className="block text-sm font-medium text-violet-700">
    Workout Name
  </label>
  <div className="flex gap-2">
    <input
      id="workout-name"
      placeholder="e.g., Upper Body Strength"
      value={workoutName}
      onChange={(e) => setWorkoutName(e.target.value)}
      className="flex-1 rounded-lg border border-violet-200 px-4 py-2"
    />
  </div>
</div>
            
                  <button
                    onClick={handleContinueWorkout}
                    className="mt-6 flex items-center rounded-md bg-violet-600 px-4 py-2 text-white hover:bg-violet-600/90"
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
            
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {defaultWorkouts.map((workout) => (
              <div
                key={workout.id}
                className="cursor-pointer overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
                onClick={() => {
                    handleSelectDefaultWorkout(workout)
                    handleContinueWorkout();
                }}
              >
                <div className="relative h-40 bg-gray-100">
                  <img
                    src={workout.image || "/placeholder.svg"}
                    alt={workout.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="font-bold text-white">{workout.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600">{workout.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex space-x-2">
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        {workout.level.charAt(0).toUpperCase() + workout.level.slice(1)}
                      </span>
                      <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                        {workout.category.charAt(0).toUpperCase() + workout.category.slice(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{workout.exercises.length} exercises</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {exercises.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleCreateWorkout}
                className="flex items-center rounded-md bg-violet-600 px-4 py-2 text-white hover:bg-violet-600/90"
                disabled={loading}
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    Start Workout <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-lg border p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="workout-name" className="block text-sm font-medium">
                  Workout Name
                </label>
                <input
                  id="workout-name"
                  placeholder="e.g., Upper Body Strength"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-xl font-bold">Exercises</h2>
              <div className="flex space-x-2">
                <button
                  className="flex items-center rounded-md bg-violet-600 text-white px-3 py-1.5 text-sm hover:bg-violet-700"
                  onClick={() => setShowCustomExerciseForm(true)}
                >
                  <Plus className="mr-1 h-4 w-4 " />
                  Create Exercise
                </button>
              </div>
            </div>
            <div className="space-y-4 p-4">
              {exercises.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed text-center text-black bg-violet-100">
                  <Dumbbell className="mb-2 h-8 w-8 text-gray-800" />
                  <p className="text-sm">No exercises added yet</p>
                  <p className="mt-1 text-xs">Click "Create Exercise" to start building your workout</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {exercises.map((exercise, index) => (
                    <div key={index} className="overflow-hidden rounded-md border">
                      <div className="flex items-center justify-between bg-gray-50 p-4">
                        <div>
                          <h3 className="font-medium">{exercise.name}</h3>
                          <p className="text-sm text-gray-500">
                            {exercise.muscleGroup.charAt(0).toUpperCase() + exercise.muscleGroup.slice(1)} •{" "}
                            {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            className="text-gray-500 hover:text-red-500"
                            onClick={() => handleRemoveExercise(index)}
                          >
                            <X className="h-6 w-6 bg-violet-600 text-white p-1 rounded-md cursor-pointer" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
  <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    {/* Header */}
    <div className="grid grid-cols-3 gap-4 bg-violet-600 text-white p-3 font-medium text-sm">
      <div className="px-3">Set</div>
      <div className="px-3">Previous</div>
      <div className="px-3">Target</div>
    </div>
    
    {/* Sets List */}
    <div className="divide-y divide-gray-100">
      {exercise.sets.map((set, setIndex) => (
        <div 
          key={setIndex} 
          className={`grid grid-cols-3 gap-4 p-3 text-sm transition-colors ${
            set.completed ? 'bg-violet-50' : 'hover:bg-gray-50'
          }`}
        >
          <div className="px-3 font-medium text-violet-600">
            {set.setNumber}
          </div>
          
          <div className="px-3 flex items-center">
            {set.completedReps ? (
              <span className="font-medium text-violet-600">
                {set.completedReps} reps
              </span>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
          
          <div className="px-3 flex items-center justify-between">
            <span className="text-gray-600">
              {set.targetReps || set.reps} reps
            </span>
            {set.completed && (
              <Check className="h-4 w-4 text-violet-600" />
            )}
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Exercise Description */}
  {exercise.description && (
    <div className="p-3 bg-violet-50 rounded-lg border border-violet-100">
      <h4 className="text-xs font-semibold text-violet-600 mb-1">Notes</h4>
      <p className="text-sm text-gray-700">{exercise.description}</p>
    </div>
  )}
</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-between border-t p-4">
              <button
                onClick={() => window.history.back()}
                className="rounded-md border px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWorkout}
                className="flex items-center rounded-md bg-violet-600 px-4 py-2 text-white hover:bg-violet-600/90"
                disabled={loading}
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    Start Workout <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add Exercise</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    placeholder="Search exercises..."
                    className="w-full rounded-md border pl-9 py-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <button
                  className="rounded-md bg-violet-600 px-4 py-2 text-white hover:bg-violet-600/90"
                  onClick={handleSearch}
                  disabled={searchLoading}
                >
                  {searchLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    "Search"
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {muscleGroups.map((group) => (
                  <button
                    key={group.value}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
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

              <div className="max-h-[300px] overflow-y-auto rounded-md border">
                {searchResults.length === 0 ? (
                  <div className="flex h-20 items-center justify-center text-sm text-gray-500">
                    {searchQuery ? "No exercises found" : "Search for exercises to add"}
                  </div>
                ) : (
                  <div className="space-y-1 p-1">
                    {searchResults.map((exercise) => (
                      <div
                        key={exercise._id}
                        className={`flex cursor-pointer items-center justify-between rounded-md p-2 ${
                          selectedExercise?._id === exercise._id ? "bg-violet-600 text-white" : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedExercise(exercise)}
                      >
                        <div>
                          <div className="font-medium">{exercise.name}</div>
                          <div className="text-xs">
                            {exercise.muscleGroup.charAt(0).toUpperCase() + exercise.muscleGroup.slice(1)} •{" "}
                            {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedExercise && (
                <div className="space-y-2 rounded-md border p-3">
                  <div className="font-medium">{selectedExercise.name}</div>
                  <div className="text-sm text-gray-500">{selectedExercise.description}</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="sets" className="block text-sm font-medium">
                        Number of Sets
                      </label>
                      <select
                        id="sets"
                        value={sets}
                        onChange={(e) => setSets(Number.parseInt(e.target.value))}
                        className="w-full rounded-md border px-3 py-2"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="reps" className="block text-sm font-medium">
                        Reps per Set
                      </label>
                      <select
                        id="reps"
                        value={reps}
                        onChange={(e) => setReps(Number.parseInt(e.target.value))}
                        className="w-full rounded-md border px-3 py-2"
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

            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="rounded-md border px-4 py-2 hover:bg-gray-50"
                onClick={() => {
                  setSelectedExercise(null)
                  setShowModal(false)
                }}
              >
                Cancel
              </button>
              <button
                className={`rounded-md bg-violet-600 px-4 py-2 text-white hover:bg-violet-600/90 ${
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
            <div className="w-full max-w-md rounded-lg bg-white p-6  ">
                <div className="mb-4 flex items-center justify-between space-y-5">
                <h2 className="text-xl font-bold text-violet-600">Create Custom Exercise</h2>
                <button onClick={() => setShowCustomExerciseForm(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="h-6 w-6 bg-violet-600 text-white p-1 rounded-md" />
                </button>
                </div>

                <div className="mt-4 space-y-4">
                <div className="space-y-2">
                    <label htmlFor="exercise-name" className="block text-sm font-medium">
                    Exercise Name *
                    </label>
                    <input
                    id="exercise-name"
                    placeholder="e.g., Cable Crossover"
                    value={customExercise.name}
                    onChange={(e) => setCustomExercise({ ...customExercise, name: e.target.value })}
                    className="w-full rounded-md border px-3 py-2"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="muscle-group" className="block text-sm font-medium">
                    Muscle Group
                    </label>
                    <select
                    id="muscle-group"
                    value={customExercise.muscleGroup}
                    onChange={(e) => setCustomExercise({ ...customExercise, muscleGroup: e.target.value })
                    }
                    className="w-full rounded-md border px-3 py-2"
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

                <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-medium">
                    Category
                    </label>
                    <select
                    id="category"
                    value={customExercise.category}
                    onChange={(e) => setCustomExercise({ ...customExercise, category: e.target.value })}
                    className="w-full rounded-md border px-3 py-2"
                    >
                    {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                        {category.label}
                        </option>
                    ))}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                    <label htmlFor="custom-sets" className="block text-sm font-medium">
                        Number of Sets
                    </label>
                    <select
                        id="custom-sets"
                        value={sets}
                        onChange={(e) => setSets(Number.parseInt(e.target.value))}
                        className="w-full rounded-md border px-3 py-2"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                        ))}
                    </select>
                    </div>
                    <div className="space-y-1">
                    <label htmlFor="custom-reps" className="block text-sm font-medium">
                        Reps per Set
                    </label>
                    <select
                        id="custom-reps"
                        value={reps}
                        onChange={(e) => setReps(Number.parseInt(e.target.value))}
                        className="w-full rounded-md border px-3 py-2"
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

                <div className="mt-6 flex justify-end space-x-2">
                <button
                    className="rounded-md border px-4 py-2 hover:bg-gray-50"
                    onClick={() => setShowCustomExerciseForm(false)}
                >
                    Cancel
                </button>
                <button
                    className="rounded-md bg-violet-600 px-4 py-2 text-white hover:bg-violet-600/90"
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
