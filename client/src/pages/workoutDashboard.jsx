import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { workoutsState, workoutStatsSelector } from '../state/workoutState';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import apiConfig from '../config/api'

function WorkoutDashboard() {
  const [workouts, setWorkouts] = useRecoilState(workoutsState);
  const stats = useRecoilValue(workoutStatsSelector);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiConfig.baseURL}/api/workouts`,{
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch workouts');
        }
        
        const data = await response.json();
        setWorkouts(data);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError('Failed to load your workout data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkouts();
  }, [setWorkouts]);

  // Find workouts for the selected date
  const selectedDateWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate.toDateString() === date.toDateString();
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500 bg-red-50 p-4 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Total Workouts</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
          <p className="text-xs text-gray-500">Lifetime workouts completed</p>
        </div>

        <div className="rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Avg Duration</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-2xl font-bold">{stats.avgDuration} min</div>
          <p className="text-xs text-gray-500">Average workout time</p>
        </div>

        <div className="rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Most Common</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="text-2xl font-bold truncate">{stats.mostFrequentExercise}</div>
          <p className="text-xs text-gray-500">Most frequent exercise</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="font-medium mb-2">Workout Calendar</h3>
          <p className="text-sm text-gray-500 mb-4">Track your workout consistency</p>
          <div className="calendar-container">
            <Calendar
              onChange={setDate}
              value={date}
              tileClassName={({ date }) => {
                // Check if there are workouts on this date
                const hasWorkout = workouts.some(workout => {
                  const workoutDate = new Date(workout.date);
                  return workoutDate.toDateString() === date.toDateString();
                });
                
                return hasWorkout ? 'bg-violet-600/10 text-violet-600 font-bold' : null;
              }}
              className="rounded-md border w-full"
            />
          </div>
        </div>

        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="font-medium mb-2">
            {selectedDateWorkouts.length 
              ? `Workouts on ${format(date, 'MMMM d, yyyy')}` 
              : 'No workouts on this date'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {selectedDateWorkouts.length
              ? `You completed ${selectedDateWorkouts.length} workout(s)`
              : 'Select a date with workouts to view details'}
          </p>
          
          {selectedDateWorkouts.length > 0 ? (
            <div className="space-y-4">
              {selectedDateWorkouts.map((workout) => (
                <div key={workout._id} className="rounded-lg border p-4">
                  <h4 className="font-semibold">{workout.name}</h4>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Duration: {workout.duration} minutes</p>
                    <p>Exercises: {workout.exercises.length}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center text-gray-500">
              <p>No workouts found for this date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkoutDashboard;