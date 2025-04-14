import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { workoutsState, workoutFiltersState } from '../state/workoutState';
import { format, parseISO } from 'date-fns';
import apiConfig from '../config/api';
import { Activity, Clock, TrendingUp, Calendar, List, BarChart2 } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

function WorkoutHistory() {
  const [workouts, setWorkouts] = useRecoilState(workoutsState);
  const [filters, setFilters] = useRecoilState(workoutFiltersState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [exerciseData, setExerciseData] = useState([]);
  const [activeTab, setActiveTab] = useState('history');

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiConfig.baseURL}/api/workouts`, {
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch workouts');
        }
        
        const data = await response.json();
        setWorkouts(data);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError('Failed to load your workout history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkouts();
  }, [setWorkouts]);

  useEffect(() => {
    if (workouts.length === 0) return;

    // Filter workouts based on time range
    const now = new Date();
    let filteredWorkouts = [];
    
    switch (filters.dateRange) {
      case '1month':
        filteredWorkouts = workouts.filter((workout) => {
          const workoutDate = new Date(workout.date);
          const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          return workoutDate >= oneMonthAgo;
        });
        break;
      case '3months':
        filteredWorkouts = workouts.filter((workout) => {
          const workoutDate = new Date(workout.date);
          const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          return workoutDate >= threeMonthsAgo;
        });
        break;
      case '6months':
        filteredWorkouts = workouts.filter((workout) => {
          const workoutDate = new Date(workout.date);
          const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
          return workoutDate >= sixMonthsAgo;
        });
        break;
      case '1year':
        filteredWorkouts = workouts.filter((workout) => {
          const workoutDate = new Date(workout.date);
          const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          return workoutDate >= oneYearAgo;
        });
        break;
      default:
        filteredWorkouts = workouts;
    }
    
    // Prepare data for workout frequency chart
    const workoutsByMonth = {};
    filteredWorkouts.forEach((workout) => {
      const monthYear = format(parseISO(workout.date), 'MMM yyyy');
      workoutsByMonth[monthYear] = (workoutsByMonth[monthYear] || 0) + 1;
    });
    
    const chartData = Object.keys(workoutsByMonth).map((month) => ({
      month,
      workouts: workoutsByMonth[month],
    }));
    
    setChartData(chartData);
    
    // Prepare data for exercise frequency chart
    const exerciseCounts = {};
    filteredWorkouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exerciseCounts[exercise.name] = (exerciseCounts[exercise.name] || 0) + 1;
      });
    });
    
    // Sort and take top 10 exercises
    const sortedExercises = Object.entries(exerciseCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
    
    setExerciseData(sortedExercises);
  }, [workouts, filters.dateRange]);

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

  if (workouts.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4 rounded-lg border border-violet-100 bg-violet-50 p-6">
        <Activity className="h-10 w-10 text-violet-600" />
        <p className="text-center text-violet-800">No workout history found</p>
        <button className="rounded-lg bg-violet-600 px-4 py-2 text-white hover:bg-violet-700">
          Start Your First Workout
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h2 className="text-2xl font-bold text-violet-900">Workout History</h2>
        <select
          value={filters.dateRange}
          onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
          className="rounded-lg border border-violet-200 bg-white px-4 py-2 text-violet-800 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        >
          <option value="1month">Last Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-violet-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-violet-700">Total Workouts</h3>
            <Activity className="h-5 w-5 text-violet-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-violet-900">{workouts.length}</div>
        </div>

        <div className="rounded-xl border border-violet-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-violet-700">Avg. Duration</h3>
            <Clock className="h-5 w-5 text-violet-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-violet-900">
            {Math.round(workouts.reduce((sum, w) => sum + (w.duration || 0), 0) / workouts.length)} min
          </div>
        </div>

        <div className="rounded-xl border border-violet-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-violet-700">Most Common</h3>
            <TrendingUp className="h-5 w-5 text-violet-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-violet-900 truncate">
            {exerciseData.length > 0 ? exerciseData[0].name : 'N/A'}
          </div>
        </div>

        <div className="rounded-xl border border-violet-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-violet-700">Last Workout</h3>
            <Calendar className="h-5 w-5 text-violet-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-violet-900">
            {workouts.length > 0 ? format(parseISO(workouts[0].date), 'MMM d') : 'N/A'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-violet-100">
        <button
          className={`flex items-center gap-2 px-4 py-3 ${activeTab === 'history' ? 'border-b-2 border-violet-600 font-medium text-violet-600' : 'text-violet-500 hover:text-violet-700'}`}
          onClick={() => setActiveTab('history')}
        >
          <List className="h-5 w-5" />
          History
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-3 ${activeTab === 'charts' ? 'border-b-2 border-violet-600 font-medium text-violet-600' : 'text-violet-500 hover:text-violet-700'}`}
          onClick={() => setActiveTab('charts')}
        >
          <BarChart2 className="h-5 w-5" />
          Charts
        </button>
      </div>

      {activeTab === 'charts' ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-violet-100 bg-white p-5 shadow-sm">
            <h3 className="mb-1 text-lg font-medium text-violet-900">Workout Frequency</h3>
            <p className="mb-4 text-sm text-violet-500">Number of workouts over time</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                  <XAxis dataKey="month" stroke="#7c3aed" />
                  <YAxis stroke="#7c3aed" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#f5f3ff',
                      borderColor: '#ddd6fe',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="workouts" 
                    stroke="#7c3aed" 
                    strokeWidth={2}
                    activeDot={{ r: 8, fill: '#5b21b6' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-violet-100 bg-white p-5 shadow-sm">
            <h3 className="mb-1 text-lg font-medium text-violet-900">Most Common Exercises</h3>
            <p className="mb-4 text-sm text-violet-500">Your most frequently performed exercises</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exerciseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9d5ff" />
                  <XAxis dataKey="name" stroke="#7c3aed" />
                  <YAxis stroke="#7c3aed" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#f5f3ff',
                      borderColor: '#ddd6fe',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    fill="#7c3aed" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-violet-100 bg-white p-5 shadow-sm">
          <h3 className="mb-1 text-lg font-medium text-violet-900">Workout Timeline</h3>
          <p className="mb-4 text-sm text-violet-500">Your recent workout history</p>
          <div className="space-y-8">
            {workouts.slice(0, 10).map((workout, index) => (
              <div key={workout._id} className="flex">
                <div className="mr-4 flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-violet-600 bg-violet-600/10 text-violet-600 font-medium">
                    {index + 1}
                  </div>
                  {index < workouts.length - 1 && <div className="h-full w-px bg-violet-200" />}
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <h3 className="font-semibold text-violet-900">{workout.name}</h3>
                    <span className="text-sm text-violet-500">
                      {format(parseISO(workout.date), 'MMMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-sm text-violet-500">
                    Duration: {workout.duration} minutes • {workout.exercises.length} exercises
                  </p>
                  <div className="mt-2 rounded-lg border border-violet-100 bg-violet-50 p-4">
                    <h4 className="mb-2 text-sm font-medium text-violet-700">Exercises:</h4>
                    <ul className="space-y-2 text-sm">
                      {workout.exercises.map((exercise) => (
                        <li key={exercise.name} className="flex items-center justify-between">
                          <span className="text-violet-800">{exercise.name}</span>
                          <span className="rounded-full bg-violet-100 px-2 py-1 text-xs font-medium text-violet-600">
                            {exercise.sets.length} sets
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkoutHistory;