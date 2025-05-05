import { useState } from 'react';

export default function MealList() {
  const [meals, setMeals] = useState([
    { id: 1, name: 'Breakfast' },
    { id: 2, name: 'Lunch' },
    { id: 3, name: 'Dinner' },
    { id: 4, name: 'Snack' }
  ]);

  const [draggedItem, setDraggedItem] = useState(null);

  const handleRemove = (id) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(meals[index]);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  const handleDragOver = (index) => {
    const draggedOverItem = meals[index];

    // If the item is dragged over itself, ignore
    if (draggedItem === draggedOverItem) {
      return;
    }

    // Filter out the currently dragged item
    let items = meals.filter(meal => meal !== draggedItem);

    // Add the dragged item after the dragged over item
    items.splice(index, 0, draggedItem);

    setMeals(items);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="content p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Which meals do you eat each day?</h1>
      
      <div>
        <ol className="space-y-3">
          {meals.map((meal, index) => (
            <li 
              key={meal.id}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={() => handleDragOver(index)}
              onDragEnd={handleDragEnd}
              className="bg-white rounded-lg shadow-[13px] p-3 border border-gray-200 cursor-move"
            >
              <div className="flex items-center justify-between">
                <span className="grip mr-3 text-gray-400">
                  <svg 
                    viewBox="0 0 24 24" 
                    width="20" 
                    height="20" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    fill="none" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="12" r="1"></circle>
                    <circle cx="9" cy="5" r="1"></circle>
                    <circle cx="9" cy="19" r="1"></circle>
                    <circle cx="15" cy="12" r="1"></circle>
                    <circle cx="15" cy="5" r="1"></circle>
                    <circle cx="15" cy="19" r="1"></circle>
                  </svg>
                </span>
                
                <span className="title flex-grow font-medium">{meal.name}</span>
                
                <button 
                  onClick={() => handleRemove(meal.id)}
                  title={`Remove ${meal.name}`}
                  className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    width="20" 
                    height="20" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    fill="none" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ol>
        
        <aside className="mt-4 text-[13px] text-gray-500 italic">
          <p>You can edit individual meal settings or create brand new meal types later.</p>
        </aside>
      </div>
    </div>
  );
}