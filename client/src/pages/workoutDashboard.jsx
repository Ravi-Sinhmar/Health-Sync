"use client"

import { useEffect, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { workoutsState, workoutStatsSelector } from "../state/workoutState"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { format } from "date-fns"
import apiConfig from "../config/api"
import { Activity, Clock, TrendingUp, CalendarIcon, ClipboardList } from "lucide-react"

export default function WorkoutDashboard() {
  const [workouts, setWorkouts] = useRecoilState(workoutsState)
  const stats = useRecoilValue(workoutStatsSelector)
  const [date, setDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${apiConfig.baseURL}/api/workouts`, {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch workouts")
        }

        const data = await response.json()
        setWorkouts(data)
      } catch (err) {
        console.error("Error fetching workouts:", err)
        setError("Failed to load your workout data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchWorkouts()
  }, [setWorkouts])

  // Find workouts for the selected date
  const selectedDateWorkouts = workouts.filter((workout) => {
    const workoutDate = new Date(workout.date)
    return workoutDate.toDateString() === date.toDateString()
  })

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-600 border-t-transparent"></div>
        <p className="ml-2 text-[13px] text-gray-500">Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-3 text-[13px] text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200">
          <div className="flex items-center mb-3">
            <Activity className="h-3.5 w-3.5 text-violet-600 mr-1.5" />
            <h2 className="text-[13px] font-medium text-gray-900">Total Workouts</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 text-[13px]">
            <div>
              <p className="text-gray-500">Count</p>
              <p className="font-medium">{stats.totalWorkouts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200">
          <div className="flex items-center mb-3">
            <Clock className="h-3.5 w-3.5 text-violet-600 mr-1.5" />
            <h2 className="text-[13px] font-medium text-gray-900">Avg. Duration</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 text-[13px]">
            <div>
              <p className="text-gray-500">Minutes</p>
              <p className="font-medium">{stats.avgDuration} min</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200">
          <div className="flex items-center mb-3">
            <TrendingUp className="h-3.5 w-3.5 text-violet-600 mr-1.5" />
            <h2 className="text-[13px] font-medium text-gray-900">Most Common</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 text-[13px]">
            <div>
              <p className="text-gray-500">Exercise</p>
              <p className="font-medium truncate">{stats.mostFrequentExercise}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200">
          <div className="flex items-center mb-3">
            <CalendarIcon className="h-3.5 w-3.5 text-violet-600 mr-1.5" />
            <h2 className="text-[13px] font-medium text-gray-900">Last Workout</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 text-[13px]">
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium">{workouts.length > 0 ? format(new Date(workouts[0].date), "MMM d") : "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200">
          <div className="flex items-center mb-3">
            <CalendarIcon className="h-3.5 w-3.5 text-violet-600 mr-1.5" />
            <h2 className="text-[13px] font-medium text-gray-900">Workout Calendar</h2>
          </div>
          <p className="mb-3 text-[10px] text-gray-500">Track your workout consistency</p>
          <div className="calendar-container">
            <Calendar
              onChange={setDate}
              value={date}
              tileClassName={({ date }) => {
                // Check if there are workouts on this date
                const hasWorkout = workouts.some((workout) => {
                  const workoutDate = new Date(workout.date)
                  return workoutDate.toDateString() === date.toDateString()
                })

                return hasWorkout ? "bg-violet-50 text-violet-600 font-medium" : null
              }}
              className="rounded-md border w-full text-[13px]"
            />
          </div>
        </div>

        <div className="bg-white shadow-[13px] rounded-md p-4 border border-gray-200">
          <div className="flex items-center mb-3">
            <ClipboardList className="h-3.5 w-3.5 text-violet-600 mr-1.5" />
            <h2 className="text-[13px] font-medium text-gray-900">
              {selectedDateWorkouts.length ? `Workouts on ${format(date, "MMMM d, yyyy")}` : "No workouts on this date"}
            </h2>
          </div>
          <p className="mb-3 text-[10px] text-gray-500">
            {selectedDateWorkouts.length
              ? `You completed ${selectedDateWorkouts.length} workout(s)`
              : "Select a date with workouts to view details"}
          </p>

          {selectedDateWorkouts.length > 0 ? (
            <div className="space-y-3">
              {selectedDateWorkouts.map((workout) => (
                <div key={workout._id} className="rounded-md border border-gray-200 p-3">
                  <h4 className="text-[13px] font-medium text-gray-900">{workout.name}</h4>
                  <div className="mt-1.5 grid grid-cols-2 gap-2 text-[10px] text-gray-500">
                    <div>
                      <p>Duration</p>
                      <p className="font-medium text-gray-900">{workout.duration} min</p>
                    </div>
                    <div>
                      <p>Exercises</p>
                      <p className="font-medium text-gray-900">{workout.exercises.length}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center text-[10px] text-gray-500">
              <p>No workouts found for this date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
