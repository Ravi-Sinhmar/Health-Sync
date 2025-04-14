import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { exercisesLibraryState } from '../state/workoutState';
import apiConfig from '../config/api'

function ExerciseLibrary() {
  const [exercises, setExercises] = useRecoilState(exercisesLibraryState);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const muscleGroups = ['all', 'chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'core', 'cardio'];
  const categories = ['all', 'strength', 'cardio', 'flexibility', 'balance', 'plyometric'];

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiConfig.baseURL}/api/exercises`,{
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch exercises');
        }
        
        const data = await response.json();
        setExercises(data);
        setFilteredExercises(data);
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError('Failed to load exercise library. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchExercises();
  }, [setExercises]);

  useEffect(() => {
    // Filter exercises based on search query and filters
    let filtered = exercises;
    
    if (searchQuery) {
      filtered = filtered.filter(
        (exercise) =>
          exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exercise.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((exercise) => exercise.category.toLowerCase() === selectedCategory.toLowerCase());
    }
    
    if (selectedMuscleGroup !== 'all') {
      filtered = filtered.filter((exercise) => exercise.muscleGroup.toLowerCase() === selectedMuscleGroup.toLowerCase());
    }
    
    setFilteredExercises(filtered);
  }, [searchQuery, selectedCategory, selectedMuscleGroup, exercises]);

  const handleExerciseClick = (exercise) => {
    setSelectedExercise(exercise);
    setShowModal(true);
  };

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
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            placeholder="Search exercises..."
            className="w-full rounded-md border pl-8 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border px-3 py-2"
          >
            <option value="" disabled>Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <select 
            value={selectedMuscleGroup} 
            onChange={(e) => setSelectedMuscleGroup(e.target.value)}
            className="rounded-md border px-3 py-2"
          >
            <option value="" disabled>Muscle Group</option>
            {muscleGroups.map((group) => (
              <option key={group} value={group}>
                {group.charAt(0).toUpperCase() + group.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex border-b">
        <button
          className={`px-4 py-2 ${viewMode === 'grid' ? 'border-b-2 border-violet-600 font-medium' : ''}`}
          onClick={() => setViewMode('grid')}
        >
          Grid View
        </button>
        <button
          className={`px-4 py-2 ${viewMode === 'list' ? 'border-b-2 border-violet-600 font-medium' : ''}`}
          onClick={() => setViewMode('list')}
        >
          List View
        </button>
      </div>

      {filteredExercises.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-gray-500">
          <p>No exercises found matching your criteria</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExercises.map((exercise) => (
            <div key={exercise._id} className="rounded-lg border overflow-hidden">
              <div className="p-4">
                <h3 className="text-lg font-medium">{exercise.name}</h3>
                <p className="text-sm text-gray-500">
                  {exercise.muscleGroup.charAt(0).toUpperCase() + exercise.muscleGroup.slice(1)} •{' '}
                  {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
                </p>
              </div>
              <div className="px-4 pb-2">
                <p className="line-clamp-2 text-sm text-gray-500">{exercise.description}</p>
              </div>
              <div className="flex justify-between p-4 border-t">
                <button 
                  className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
                  onClick={() => handleExerciseClick(exercise)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-1 inline h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Details
                </button>
                <button className="rounded-md bg-violet-600 px-3 py-1 text-sm text-white hover:bg-violet-600/90">
                  Add to Workout
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredExercises.map((exercise) => (
            <div key={exercise._id} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <h3 className="font-medium">{exercise.name}</h3>
                <p className="text-sm text-gray-500">
                  {exercise.muscleGroup.charAt(0).toUpperCase() + exercise.muscleGroup.slice(1)} •{' '}
                  {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
                  onClick={() => handleExerciseClick(exercise)}
                >
                  Details
                </button>
                <button className="rounded-md bg-violet-600 px-3 py-1 text-sm text-white hover:bg-violet-600/90">
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedExercise.name}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mb-2 text-sm text-gray-500">
              {selectedExercise.muscleGroup.charAt(0).toUpperCase() + selectedExercise.muscleGroup.slice(1)} •{' '}
              {selectedExercise.category.charAt(0).toUpperCase() + selectedExercise.category.slice(1)}
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Description</h4>
                <p className="text-sm text-gray-500">{selectedExercise.description}</p>
              </div>
              <div>
                <h4 className="font-medium">Instructions</h4>
                <ol className="ml-4 list-decimal text-sm text-gray-500">
                  {selectedExercise.instructions.map((instruction, index) => (
                    <li key={index} className="mt-1">
                      {instruction}
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h4 className="font-medium">Equipment</h4>
                <p className="text-sm text-gray-500">{selectedExercise.equipment.join(', ')}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                className="rounded-md bg-violet-600 px-4 py-2 text-white hover:bg-violet-600/90"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExerciseLibrary;