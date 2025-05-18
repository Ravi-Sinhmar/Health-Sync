

import { atom, selector } from "recoil"

// Atoms
export const activeWorkoutState = atom({
  key: "activeWorkoutState",
  default: null,
})

export const workoutsState = atom({
  key: "workoutsState",
  default: [],
})

export const exercisesLibraryState = atom({
  key: "exercisesLibraryState",
  default: [],
})

export const workoutFiltersState = atom({
  key: "workoutFiltersState",
  default: {
    dateRange: "1month",
    muscleGroup: "all",
    category: "all",
  },
})

// Selectors
export const workoutStatsSelector = selector({
  key: "workoutStatsSelector",
  get: ({ get }) => {
    const workouts = get(workoutsState)

    // Total workouts
    const totalWorkouts = workouts.length

    // Average duration
    const totalDuration = workouts.reduce((sum, workout) => sum + (workout.duration || 0), 0)
    const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0

    // Most frequent exercise
    const exerciseCounts = {}
    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exerciseCounts[exercise.name] = (exerciseCounts[exercise.name] || 0) + 1
      })
    })

    let mostFrequentExercise = "None"
    let maxCount = 0

    Object.entries(exerciseCounts).forEach(([name, count]) => {
      if (count > maxCount) {
        mostFrequentExercise = name
        maxCount = count
      }
    })

    return {
      totalWorkouts,
      avgDuration,
      mostFrequentExercise,
    }
  },
})
