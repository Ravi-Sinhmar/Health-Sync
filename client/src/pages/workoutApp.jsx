"use client"

import { useState } from "react"
import { RecoilRoot } from "recoil"
import WorkoutDashboard from "./workoutDashboard"
import ActiveWorkout from "./activeWorkout"
import ExerciseLibrary from "./exerciseLibrary"
import WorkoutHistory from "./workoutHistory"
import CreateWorkout from "./createWorkout"


export default function WorkoutApp() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const handleWorkoutCreated = () => {
    setActiveTab("active")
  }

  return (
    <RecoilRoot>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Workout Tracker</h1>
        </div>

        <div className="mb-6">
          <div className="flex border-b">
            <button
              className={`px-4 py-2 ${activeTab === "dashboard" ? "border-b-2 border-violet-600 font-medium" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "active" ? "border-b-2 border-violet-600 font-medium" : ""}`}
              onClick={() => setActiveTab("active")}
            >
              Active Workout
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "exercises" ? "border-b-2 border-violet-600 font-medium" : ""}`}
              onClick={() => setActiveTab("exercises")}
            >
              Exercises
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "history" ? "border-b-2 border-violet-600 font-medium" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              History
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "create" ? "border-b-2 border-violet-600 font-medium" : ""}`}
              onClick={() => setActiveTab("create")}
            >
              Create
            </button>
          </div>
        </div>

        {activeTab === "dashboard" && <WorkoutDashboard />}
        {activeTab === "active" && <ActiveWorkout />}
        {activeTab === "exercises" && <ExerciseLibrary />}
        {activeTab === "history" && <WorkoutHistory />}
        {activeTab === "create" && <CreateWorkout onWorkoutCreated={handleWorkoutCreated} />}
      </div>
    </RecoilRoot>
  )
}
