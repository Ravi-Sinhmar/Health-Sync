// import { atom, selector } from 'recoil';

// // Atoms
// export const workoutsState = atom({
//   key: 'workoutsState',
//   default: [],
// });

// export const activeWorkoutState = atom({
//   key: 'activeWorkoutState',
//   default: null,
// });

// export const exercisesLibraryState = atom({
//   key: 'exercisesLibraryState',
//   default: [],
// });

// export const workoutFiltersState = atom({
//   key: 'workoutFiltersState',
//   default: {
//     dateRange: '3months',
//     muscleGroup: 'all',
//     category: 'all',
//   },
// });

// // Selectors
// export const filteredWorkoutsSelector = selector({
//   key: 'filteredWorkoutsSelector',
//   get: ({ get }) => {
//     const workouts = get(workoutsState);
//     const filters = get(workoutFiltersState);
    
//     let filtered = [...workouts];
    
//     // Apply date range filter
//     if (filters.dateRange !== 'all') {
//       const now = new Date();
//       const months = parseInt(filters.dateRange);
//       const cutoffDate = new Date(now.setMonth(now.getMonth() - months));
      
//       filtered = filtered.filter(workout => new Date(workout.date) >= cutoffDate);
//     }
    
//     return filtered;
//   },
// });

// export const workoutStatsSelector = selector({
//   key: 'workoutStatsSelector',
//   get: ({ get }) => {
//     const workouts = get(filteredWorkoutsSelector);
    
//     if (workouts.length === 0) {
//       return {
//         totalWorkouts: 0,
//         avgDuration: 0,
//         mostFrequentExercise: 'N/A',
//         totalSets: 0
//       };
//     }
    
//     // Calculate total workouts
//     const totalWorkouts = workouts.length;
    
//     // Calculate average duration
//     const totalDuration = workouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
//     const avgDuration = Math.round(totalDuration / totalWorkouts);
    
//     // Find most frequent exercise
//     const exerciseCounts = {};
//     workouts.forEach(workout => {
//       workout.exercises.forEach(exercise => {
//         exerciseCounts[exercise.name] = (exerciseCounts[exercise.name] || 0) + 1;
//       });
//     });
    
//     let mostFrequentExercise = 'N/A';
//     let maxCount = 0;
    
//     Object.entries(exerciseCounts).forEach(([name, count]) => {
//       if (count > maxCount) {
//         mostFrequentExercise = name;
//         maxCount = count;
//       }
//     });
    
//     // Calculate total sets
//     const totalSets = workouts.reduce((sum, workout) => {
//       return sum + workout.exercises.reduce((exerciseSum, exercise) => {
//         return exerciseSum + (exercise.sets ? exercise.sets.length : 0);
//       }, 0);
//     }, 0);
    
//     return {
//       totalWorkouts,
//       avgDuration,
//       mostFrequentExercise,
//       totalSets
//     };
//   }
// });

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
