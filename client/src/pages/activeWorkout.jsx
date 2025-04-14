"use client"

import { useState, useEffect } from "react"
import { useRecoilState } from "recoil"
import { activeWorkoutState } from "../state/workoutState"
import RestTimer from "./restTimer"
import { Clock, CheckCircle, Check, SkipForward } from "lucide-react"
import apiConfig from "../config/api"

export default function ActiveWorkout() {
  const [activeWorkout, setActiveWorkout] = useRecoilState(activeWorkoutState)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSetIndex, setCurrentSetIndex] = useState(0)
  const [workoutTimer, setWorkoutTimer] = useState(0)
  const [isWorkoutTimerRunning, setIsWorkoutTimerRunning] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState({ show: false, message: "", type: "" })
  const [showRestTimer, setShowRestTimer] = useState(false)
  const [restDuration, setRestDuration] = useState(60)
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(0)
  const [shortRestTime, setShortRestTime] = useState(60)
  const [longRestTime, setLongRestTime] = useState(300)
  const [showRestSettings, setShowRestSettings] = useState(false)

  // Fetch active workout on component mount
  useEffect(() => {
    const fetchActiveWorkout = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${apiConfig.baseURL}/api/workouts/active`, {
          method: "GET",
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch active workout")
        }

        const data = await response.json()
        setActiveWorkout(data)

        // Find the first incomplete set to set current indices
        if (data) {
          let exerciseIndex = 0
          let setIndex = 0
          let found = false

          for (let i = 0; i < data.exercises.length; i++) {
            for (let j = 0; j < data.exercises[i].sets.length; j++) {
              if (!data.exercises[i].sets[j].completed) {
                exerciseIndex = i
                setIndex = j
                found = true
                break
              }
            }
            if (found) break
          }

          setCurrentExerciseIndex(exerciseIndex)
          setCurrentSetIndex(setIndex)
        }
      } catch (err) {
        console.error("Error fetching active workout:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (!activeWorkout) {
      fetchActiveWorkout()
    }
  }, [activeWorkout, setActiveWorkout])

  // Calculate completion percentage and estimated time
  useEffect(() => {
    if (!activeWorkout) return

    const totalSets = activeWorkout.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0)
    const completedSets = activeWorkout.exercises.reduce(
      (sum, exercise) => sum + exercise.sets.filter((set) => set.completed).length,
      0,
    )

    setCompletionPercentage(totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0)

    const remainingSets = totalSets - completedSets
    const remainingExercises =
      activeWorkout.exercises.length -
      activeWorkout.exercises.filter((ex) => ex.sets.every((set) => set.completed)).length

    const timePerSet = 45
    const estimatedSeconds =
      remainingSets * timePerSet +
      (remainingSets - remainingExercises) * shortRestTime +
      Math.max(0, remainingExercises - 1) * longRestTime

    setEstimatedTime(estimatedSeconds)
  }, [activeWorkout, shortRestTime, longRestTime])

  // Workout timer effect
  useEffect(() => {
    let interval
    if (isWorkoutTimerRunning && !showRestTimer) {
      interval = setInterval(() => {
        setWorkoutTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isWorkoutTimerRunning, showRestTimer])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startRestTimer = (duration) => {
    setRestDuration(duration)
    setShowRestTimer(true)
    setIsWorkoutTimerRunning(false)
  }

  const handleRepsChange = async (exerciseIndex, setIndex, value) => {
    if (!activeWorkout) return

    try {
      // Create a new copy of the workout with the updated reps
      const updatedWorkout = {
        ...activeWorkout,
        exercises: activeWorkout.exercises.map((exercise, exIdx) => {
          if (exIdx === exerciseIndex) {
            return {
              ...exercise,
              sets: exercise.sets.map((set, sIdx) => {
                if (sIdx === setIndex) {
                  return {
                    ...set,
                    completedReps: value,
                  }
                }
                return set
              }),
            }
          }
          return exercise
        }),
      }

      setActiveWorkout(updatedWorkout)
      await saveWorkout(updatedWorkout)
    } catch (err) {
      console.error("Error updating reps:", err)
      showToast("Failed to update reps", "error")
    }
  }

  const handleWeightChange = async (exerciseIndex, setIndex, value) => {
    if (!activeWorkout) return

    try {
      // Create a new copy of the workout with the updated weight
      const updatedWorkout = {
        ...activeWorkout,
        exercises: activeWorkout.exercises.map((exercise, exIdx) => {
          if (exIdx === exerciseIndex) {
            return {
              ...exercise,
              sets: exercise.sets.map((set, sIdx) => {
                if (sIdx === setIndex) {
                  return {
                    ...set,
                    weight: value,
                  }
                }
                return set
              }),
            }
          }
          return exercise
        }),
      }

      setActiveWorkout(updatedWorkout)
      await saveWorkout(updatedWorkout)
    } catch (err) {
      console.error("Error updating weight:", err)
      showToast("Failed to update weight", "error")
    }
  }

  const handleSetCompletion = async (exerciseIndex, setIndex) => {
    if (!activeWorkout) return

    try {
      // Create a new copy of the workout with the updated completion status
      const updatedWorkout = {
        ...activeWorkout,
        exercises: activeWorkout.exercises.map((exercise, exIdx) => {
          if (exIdx === exerciseIndex) {
            return {
              ...exercise,
              sets: exercise.sets.map((set, sIdx) => {
                if (sIdx === setIndex) {
                  return {
                    ...set,
                    completed: !set.completed,
                    completedAt: !set.completed ? new Date() : null,
                  }
                }
                return set
              }),
            }
          }
          return exercise
        }),
      }

      setActiveWorkout(updatedWorkout)
      await saveWorkout(updatedWorkout)

      showToast(
        updatedWorkout.exercises[exerciseIndex].sets[setIndex].completed
          ? "Set marked as completed!"
          : "Set marked as incomplete",
        updatedWorkout.exercises[exerciseIndex].sets[setIndex].completed ? "success" : "info",
      )
    } catch (err) {
      console.error("Error updating set completion:", err)
      showToast("Failed to update set", "error")
    }
  }

  const saveWorkout = async (workout) => {
    const response = await fetch(`${apiConfig.baseURL}/api/workouts/${workout._id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...workout,
        exercises: workout.exercises.map((exercise) => ({
          ...exercise,
          sets: exercise.sets.map((set) => ({
            setNumber: set.setNumber,
            targetReps: set.targetReps,
            completedReps: set.completedReps,
            weight: set.weight,
            weightUnit: set.weightUnit || "lbs",
            completed: set.completed,
            completedAt: set.completedAt,
          })),
        })),
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to update workout")
    }

    return await response.json()
  }

  const handleSkipExercise = async (exerciseIndex) => {
    if (!activeWorkout) return

    try {
      // Create a deep copy of the workout
      const updatedWorkout = JSON.parse(JSON.stringify(activeWorkout))
      const exercise = updatedWorkout.exercises[exerciseIndex]

      if (!exercise) return

      // Get previous weight if available
      let previousWeight = null
      if (exerciseIndex > 0) {
        const prevExercise = updatedWorkout.exercises.find(
          (ex) => ex.name === exercise.name && ex.sets.some((set) => set.weight),
        )

        if (prevExercise) {
          const prevSet = prevExercise.sets.find((set) => set.weight)
          if (prevSet) {
            previousWeight = prevSet.weight
          }
        }
      }

      // Mark all sets as completed but with 0 completed reps
      exercise.sets = exercise.sets.map((set) => ({
        ...set,
        completedReps: 0,
        weight: previousWeight || set.weight,
        completed: true,
        completedAt: new Date(),
        skipped: true,
      }))

      setActiveWorkout(updatedWorkout)
      await saveWorkout(updatedWorkout)

      showToast(`Skipped ${exercise.name}`, "info")

      // Move to next exercise if current one was skipped
      if (exerciseIndex === currentExerciseIndex) {
        const nextIncompleteExerciseIndex = findNextIncompleteExerciseIndex(updatedWorkout, exerciseIndex)
        if (nextIncompleteExerciseIndex !== -1) {
          setCurrentExerciseIndex(nextIncompleteExerciseIndex)
          setCurrentSetIndex(0)
        }
      }
    } catch (err) {
      console.error("Error skipping exercise:", err)
      showToast("Failed to skip exercise", "error")
    }
  }

  const handleCompleteExercise = async (exerciseIndex) => {
    if (!activeWorkout) return

    try {
      // Create a deep copy of the workout
      const updatedWorkout = JSON.parse(JSON.stringify(activeWorkout))
      const exercise = updatedWorkout.exercises[exerciseIndex]

      if (!exercise) return

      // Mark all sets as completed with target reps
      exercise.sets = exercise.sets.map((set) => ({
        ...set,
        completedReps: set.targetReps || set.reps || 12,
        completed: true,
        completedAt: new Date(),
      }))

      setActiveWorkout(updatedWorkout)
      await saveWorkout(updatedWorkout)

      showToast(`Completed ${exercise.name}`, "success")

      // Move to next exercise if current one was completed
      if (exerciseIndex === currentExerciseIndex) {
        const nextIncompleteExerciseIndex = findNextIncompleteExerciseIndex(updatedWorkout, exerciseIndex)
        if (nextIncompleteExerciseIndex !== -1) {
          setCurrentExerciseIndex(nextIncompleteExerciseIndex)
          setCurrentSetIndex(0)
        }
      }
    } catch (err) {
      console.error("Error completing exercise:", err)
      showToast("Failed to complete exercise", "error")
    }
  }

  const findNextIncompleteExerciseIndex = (workout, currentIndex) => {
    for (let i = currentIndex + 1; i < workout.exercises.length; i++) {
      if (!workout.exercises[i].sets.every((set) => set.completed)) {
        return i
      }
    }
    return -1
  }

  const handleSelectExercise = (exerciseIndex) => {
    setCurrentExerciseIndex(exerciseIndex)
    setCurrentSetIndex(0)
  }

  const handleFinishRest = () => {
    setShowRestTimer(false)
    setIsWorkoutTimerRunning(true)
  }

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
  }

  const handleUpdateRestTimes = () => {
    setShowRestSettings(false)
    showToast("Rest times updated", "success")
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p>Loading workout...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  if (!activeWorkout) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4">
        <p className="text-center text-gray-500">No active workout</p>
        <button
          onClick={() => (window.location.href = "/create")}
          className="rounded-md bg-violet-600 px-4 py-2 text-white hover:bg-violet-600/90"
        >
          Create Workout
        </button>
      </div>
    )
  }

  const isWorkoutComplete = activeWorkout.exercises.every((ex) => ex.sets.every((set) => set.completed))

  return (
    <div className="space-y-6">
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-md p-4 shadow-md ${
            toast.type === "error"
              ? "bg-red-500 text-white"
              : toast.type === "info"
                ? "bg-blue-500 text-white"
                : "bg-violet-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {showRestTimer ? (
        <RestTimer
          duration={restDuration}
          onFinish={handleFinishRest}
          onCancel={() => {
            setShowRestTimer(false)
            setIsWorkoutTimerRunning(true)
          }}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{activeWorkout.name}</h2>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="font-medium">{formatTime(workoutTimer)}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{completionPercentage}% Complete</span>
              <span>Est. remaining: {formatTime(estimatedTime)}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-violet-600 transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Rest timer buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => startRestTimer(shortRestTime)}
              className="flex-1 rounded-md bg-blue-100 px-4 py-2 text-blue-700 hover:bg-blue-200"
            >
              Short Rest ({Math.floor(shortRestTime / 60)}:{(shortRestTime % 60).toString().padStart(2, "0")})
            </button>
            <button
              onClick={() => startRestTimer(longRestTime)}
              className="flex-1 rounded-md bg-purple-100 px-4 py-2 text-purple-700 hover:bg-purple-200"
            >
              Long Rest ({Math.floor(longRestTime / 60)}:{(longRestTime % 60).toString().padStart(2, "0")})
            </button>
            <button onClick={() => setShowRestSettings(true)} className="rounded-md border px-3 py-2 hover:bg-gray-50">
              ⚙️
            </button>
          </div>

          {isWorkoutComplete ? (
            <div className="rounded-lg border bg-violet-50 p-6 text-center">
              <CheckCircle className="mx-auto mb-2 h-12 w-12 text-violet-600" />
              <h3 className="text-xl font-bold">Workout Complete!</h3>
              <p className="mt-2 text-gray-600">Great job! You've completed all exercises in this workout.</p>
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  onClick={() => (window.location.href = "/history")}
                  className="rounded-md bg-violet-600 px-4 py-2 text-white hover:bg-violet-600/90"
                >
                  View History
                </button>
                <button
                  onClick={() => (window.location.href = "/create")}
                  className="rounded-md border px-4 py-2 hover:bg-gray-50"
                >
                  New Workout
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Exercise List */}
              <div className="rounded-lg border p-4">
                <h3 className="mb-3 font-bold">Exercises</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {activeWorkout.exercises.map((exercise, idx) => {
                    const completedSets = exercise.sets.filter((s) => s.completed).length
                    const totalSets = exercise.sets.length
                    const isComplete = completedSets === totalSets
                    const isActive = idx === currentExerciseIndex

                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between rounded-md border p-2 cursor-pointer ${
                          isActive ? "bg-blue-50 border-blue-300" : isComplete ? "bg-violet-50 border-violet-300" : ""
                        }`}
                        onClick={() => handleSelectExercise(idx)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              isComplete ? "bg-violet-500" : isActive ? "bg-blue-500" : "bg-gray-300"
                            }`}
                          ></div>
                          <div>
                            <h4 className="font-medium">{exercise.name}</h4>
                            <p className="text-xs text-gray-500">
                              {completedSets}/{totalSets} sets completed
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSkipExercise(idx)
                            }}
                            className="p-1 text-gray-500 hover:text-blue-500"
                            title="Skip Exercise"
                          >
                            <SkipForward className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCompleteExercise(idx)
                            }}
                            className="p-1 text-gray-500 hover:text-violet-500"
                            title="Complete Exercise"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Current Exercise */}
              {activeWorkout.exercises[currentExerciseIndex] && (
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">{activeWorkout.exercises[currentExerciseIndex].name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSkipExercise(currentExerciseIndex)}
                        className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
                      >
                        Skip
                      </button>
                      <button
                        onClick={() => handleCompleteExercise(currentExerciseIndex)}
                        className="rounded-md bg-violet-500 px-2 py-1 text-sm text-white hover:bg-violet-600"
                      >
                        Complete All
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {activeWorkout.exercises[currentExerciseIndex].muscleGroup.charAt(0).toUpperCase() +
                      activeWorkout.exercises[currentExerciseIndex].muscleGroup.slice(1)}{" "}
                    •
                    {activeWorkout.exercises[currentExerciseIndex].category.charAt(0).toUpperCase() +
                      activeWorkout.exercises[currentExerciseIndex].category.slice(1)}
                  </p>

                  <div className="mt-4">
                    <div className="rounded-md border">
                      <div className="grid grid-cols-5 gap-2 border-b p-2 text-xs font-medium">
                        <div>Set</div>
                        <div>Target</div>
                        <div>Completed</div>
                        <div>Weight</div>
                        <div>Status</div>
                      </div>
                      <div className="divide-y">
                        {activeWorkout.exercises[currentExerciseIndex].sets.map((set, idx) => (
                          <div
                            key={idx}
                            className={`grid grid-cols-5 gap-2 p-2 text-sm ${
                              idx === currentSetIndex && !set.completed ? "bg-blue-50" : ""
                            }`}
                          >
                            <div>{set.setNumber}</div>
                            <div>{set.targetReps || set.reps || "-"}</div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={set.completedReps || ""}
                                onChange={(e) => handleRepsChange(currentExerciseIndex, idx, e.target.value)}
                                className="w-16 rounded-md border px-2 py-1"
                                placeholder="Reps"
                              />
                            </div>
                            <div>
                              <input
                                type="number"
                                value={set.weight || ""}
                                onChange={(e) => handleWeightChange(currentExerciseIndex, idx, e.target.value)}
                                className="w-16 rounded-md border px-2 py-1"
                                placeholder="Weight"
                              />
                              <span className="ml-1 text-xs">{set.weightUnit || "lbs"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              {set.completed ? (
                                <span className="text-violet-500">Completed</span>
                              ) : idx === currentSetIndex ? (
                                <span className="text-blue-500">Current</span>
                              ) : (
                                <span className="text-gray-400">Pending</span>
                              )}
                              <button onClick={() => handleSetCompletion(currentExerciseIndex, idx)} className="p-1">
                                {set.completed ? (
                                  <div className="h-5 w-5 rounded-full border-2 border-violet-500 bg-violet-500 flex items-center justify-center">
                                    <Check className="h-3 w-3 text-white" />
                                  </div>
                                ) : (
                                  <div className="h-5 w-5 rounded-full border-2 border-gray-300 hover:border-violet-500"></div>
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {showRestSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Rest Timer Settings</h2>
              <button onClick={() => setShowRestSettings(false)} className="text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="short-rest" className="block text-sm font-medium">
                  Short Rest (seconds)
                </label>
                <input
                  id="short-rest"
                  type="number"
                  value={shortRestTime}
                  onChange={(e) => setShortRestTime(Number.parseInt(e.target.value))}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="long-rest" className="block text-sm font-medium">
                  Long Rest (seconds)
                </label>
                <input
                  id="long-rest"
                  type="number"
                  value={longRestTime}
                  onChange={(e) => setLongRestTime(Number.parseInt(e.target.value))}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                className="rounded-md border px-4 py-2 hover:bg-gray-50"
                onClick={() => setShowRestSettings(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-violet-600 px-4 py-2 text-white hover:bg-violet-600/90"
                onClick={handleUpdateRestTimes}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
