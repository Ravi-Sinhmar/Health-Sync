"use client"

import { useState, useEffect } from "react"
import { useRecoilState } from "recoil"
import { exercisesLibraryState } from "../state/workoutState"
import apiConfig from "../config/api"
import { Search, Info, Grid, List, ChevronRight, X } from 'lucide-react'

export default function ExerciseLibrary() {
  const [exercises, setExercises] = useRecoilState(exercisesLibraryState)
  const [filteredExercises, setFilteredExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const muscleGroups = ["all", "chest", "back", "shoulders", "biceps", "triceps", "legs", "core", "cardio"]
  const categories = ["all", "strength", "cardio", "flexibility", "balance", "plyometric"]

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${apiConfig.baseURL}/api/exercises`, {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch exercises")
        }

        const data = await response.json()
        setExercises(data)
        setFilteredExercises(data)
      } catch (err) {
        console.error("Error fetching exercises:", err)
        setError("Failed to load exercise library. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [setExercises])

  useEffect(() => {
    // Filter exercises based on search query and filters
    let filtered = exercises

    if (searchQuery) {
      filtered = filtered.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exercise.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((exercise) => exercise.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    if (selectedMuscleGroup !== "all") {
      filtered = filtered.filter((exercise) => exercise.muscleGroup.toLowerCase() === selectedMuscleGroup.toLowerCase())
    }

    setFilteredExercises(filtered)
  }, [searchQuery, selectedCategory, selectedMuscleGroup, exercises])

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise)
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-600 border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-3 text-[13px] text-red-600">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
          <input
            placeholder="Search exercises..."
            className="w-full rounded-md border border-gray-200 pl-8 py-2 text-[13px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border border-gray-200 px-2 py-2 text-[13px]"
          >
            <option value="" disabled>
              Category
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={selectedMuscleGroup}
            onChange={(e) => setSelectedMuscleGroup(e.target.value)}
            className="rounded-md border border-gray-200 px-2 py-2 text-[13px]"
          >
            <option value="" disabled>
              Muscle Group
            </option>
            {muscleGroups.map((group) => (
              <option key={group} value={group}>
                {group.charAt(0).toUpperCase() + group.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          className={`flex items-center px-3 py-2 text-[13px] ${
            viewMode === "grid" ? "border-b-2 border-violet-600 font-medium text-violet-600" : "text-gray-600"
          }`}
          onClick={() => setViewMode("grid")}
        >
          <Grid className="mr-1.5 h-3.5 w-3.5" />
          Grid View
        </button>
        <button
          className={`flex items-center px-3 py-2 text-[13px] ${
            viewMode === "list" ? "border-b-2 border-violet-600 font-medium text-violet-600" : "text-gray-600"
          }`}
          onClick={() => setViewMode("list")}
        >
          <List className="mr-1.5 h-3.5 w-3.5" />
          List View
        </button>
      </div>

      {filteredExercises.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-[13px] text-gray-500">
          <p>No exercises found matching your criteria</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExercises.map((exercise) => (
            <div key={exercise._id} className="rounded-md border border-gray-200 shadow-[13px] overflow-hidden">
              <div className="p-3">
                <h3 className="text-[13px] font-medium text-gray-900">{exercise.name}</h3>
                <p className="text-[13px] text-gray-500">
                  {exercise.muscleGroup.charAt(0).toUpperCase() + exercise.muscleGroup.slice(1)} •{" "}
                  {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
                </p>
              </div>
              <div className="px-3 pb-2">
                <p className="line-clamp-2 text-[13px] text-gray-500">{exercise.description}</p>
              </div>
              <div className="flex justify-between p-3 border-t border-gray-200 bg-gray-50">
                <button
                  className="rounded-md border border-gray-200 px-2 py-1 text-[13px] hover:bg-gray-50"
                  onClick={() => handleExerciseClick(exercise)}
                >
                  <Info className="mr-1 inline h-3 w-3 text-violet-600" />
                  Details
                </button>
                <button className="rounded-md bg-violet-600 px-2 py-1 text-[13px] text-white hover:bg-violet-700">
                  Add to Workout
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredExercises.map((exercise) => (
            <div key={exercise._id} className="flex items-center justify-between rounded-md border border-gray-200 p-3 shadow-[13px]">
              <div>
                <h3 className="text-[13px] font-medium text-gray-900">{exercise.name}</h3>
                <p className="text-[13px] text-gray-500">
                  {exercise.muscleGroup.charAt(0).toUpperCase() + exercise.muscleGroup.slice(1)} •{" "}
                  {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded-md border border-gray-200 px-2 py-1 text-[13px] hover:bg-gray-50"
                  onClick={() => handleExerciseClick(exercise)}
                >
                  Details
                </button>
                <button className="rounded-md bg-violet-600 px-2 py-1 text-[13px] text-white hover:bg-violet-700">
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-md bg-white p-4 shadow-lg border border-gray-200">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[13px] font-medium text-gray-900">{selectedExercise.name}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-2 text-[13px] text-gray-500">
              {selectedExercise.muscleGroup.charAt(0).toUpperCase() + selectedExercise.muscleGroup.slice(1)} •{" "}
              {selectedExercise.category.charAt(0).toUpperCase() + selectedExercise.category.slice(1)}
            </p>
            <div className="space-y-3">
              <div className="bg-white shadow-[13px] rounded-md p-3 border border-gray-200">
                <div className="flex items-center mb-2">
                  <Info className="h-3.5 w-3.5 text-violet-600 mr-1.5" />
                  <h2 className="text-[13px] font-medium text-gray-900">Description</h2>
                </div>
                <p className="text-[13px] text-gray-500">{selectedExercise.description}</p>
              </div>
              
              <div className="bg-white shadow-[13px] rounded-md p-3 border border-gray-200">
                <div className="flex items-center mb-2">
                  <Info className="h-3.5 w-3.5 text-violet-600 mr-1.5" />
                  <h2 className="text-[13px] font-medium text-gray-900">Instructions</h2>
                </div>
                <ol className="ml-4 list-decimal text-[13px] text-gray-500">
                  {selectedExercise.instructions?.map((instruction, index) => (
                    <li key={index} className="mt-1">
                      {instruction}
                    </li>
                  )) || <li>No instructions available</li>}
                </ol>
              </div>
              
              <div className="bg-white shadow-[13px] rounded-md p-3 border border-gray-200">
                <div className="flex items-center mb-2">
                  <Info className="h-3.5 w-3.5 text-violet-600 mr-1.5" />
                  <h2 className="text-[13px] font-medium text-gray-900">Equipment</h2>
                </div>
                <p className="text-[13px] text-gray-500">
                  {selectedExercise.equipment?.join(", ") || "No equipment required"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="rounded-md bg-violet-600 px-3 py-1.5 text-[13px] text-white hover:bg-violet-700"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
