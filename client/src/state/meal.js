import { atom } from "recoil"

// Protein needs state - stores the calculated protein requirement
export const proteinNeedsState = atom({
  key: "proteinNeedsState",
  default: 0,
})

// Tracked meals state - stores all meals the user has tracked
export const trackedMealsState = atom({
  key: "trackedMealsState",
  default: [],
})

// Available meals state - stores all meals that can be added to the tracker
export const availableMealsState = atom({
  key: "availableMealsState",
  default: [
    {
      id: 1,
      name: "Grilled Chicken Breast",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      ingredients: ["Chicken breast", "Olive oil", "Salt", "Pepper", "Garlic powder"],
      image: "/placeholder.svg?height=100&width=100",
      category: "protein",
    },
    {
      id: 2,
      name: "Protein Smoothie",
      calories: 320,
      protein: 30,
      carbs: 34,
      fat: 8,
      ingredients: ["Whey protein", "Banana", "Almond milk", "Peanut butter", "Ice"],
      image: "/placeholder.svg?height=100&width=100",
      category: "breakfast",
    },
    {
      id: 3,
      name: "Salmon with Asparagus",
      calories: 370,
      protein: 34,
      carbs: 5,
      fat: 24,
      ingredients: ["Salmon fillet", "Asparagus", "Lemon", "Olive oil", "Dill"],
      image: "/placeholder.svg?height=100&width=100",
      category: "dinner",
    },
    {
      id: 4,
      name: "Greek Yogurt with Berries",
      calories: 200,
      protein: 20,
      carbs: 16,
      fat: 4,
      ingredients: ["Greek yogurt", "Mixed berries", "Honey", "Almonds"],
      image: "/placeholder.svg?height=100&width=100",
      category: "snack",
    },
    {
      id: 5,
      name: "Quinoa Bowl",
      calories: 420,
      protein: 15,
      carbs: 68,
      fat: 10,
      ingredients: ["Quinoa", "Black beans", "Avocado", "Cherry tomatoes", "Lime juice"],
      image: "/placeholder.svg?height=100&width=100",
      category: "lunch",
    },
    {
      id: 6,
      name: "Egg White Omelette",
      calories: 240,
      protein: 28,
      carbs: 6,
      fat: 12,
      ingredients: ["Egg whites", "Spinach", "Feta cheese", "Bell peppers", "Onions"],
      image: "/placeholder.svg?height=100&width=100",
      category: "breakfast",
    },
    {
      id: 7,
      name: "Turkey and Avocado Wrap",
      calories: 350,
      protein: 25,
      carbs: 30,
      fat: 15,
      ingredients: ["Turkey breast", "Whole wheat wrap", "Avocado", "Lettuce", "Tomato"],
      image: "/placeholder.svg?height=100&width=100",
      category: "lunch",
    },
    {
      id: 8,
      name: "Protein Bar",
      calories: 220,
      protein: 20,
      carbs: 24,
      fat: 8,
      ingredients: ["Whey protein", "Oats", "Peanut butter", "Honey", "Dark chocolate"],
      image: "/placeholder.svg?height=100&width=100",
      category: "snack",
    },
    {
      id: 9,
      name: "Tofu Stir Fry",
      calories: 320,
      protein: 18,
      carbs: 24,
      fat: 16,
      ingredients: ["Tofu", "Broccoli", "Carrots", "Brown rice", "Soy sauce"],
      image: "/placeholder.svg?height=100&width=100",
      category: "dinner",
    },
    {
      id: 10,
      name: "Cottage Cheese with Fruit",
      calories: 180,
      protein: 24,
      carbs: 12,
      fat: 2,
      ingredients: ["Cottage cheese", "Pineapple", "Peach", "Cinnamon"],
      image: "/placeholder.svg?height=100&width=100",
      category: "snack",
    },
    {
      id: 11,
      name: "Lentil Soup",
      calories: 230,
      protein: 16,
      carbs: 40,
      fat: 2,
      ingredients: ["Lentils", "Carrots", "Celery", "Onion", "Vegetable broth"],
      image: "/placeholder.svg?height=100&width=100",
      category: "lunch",
    },
    {
      id: 12,
      name: "Beef and Vegetable Stir Fry",
      calories: 380,
      protein: 30,
      carbs: 20,
      fat: 18,
      ingredients: ["Lean beef", "Bell peppers", "Broccoli", "Carrots", "Garlic"],
      image: "/placeholder.svg?height=100&width=100",
      category: "dinner",
    },
  ],
})

// Meal preferences state - stores user preferences for meal planning
export const mealPreferencesState = atom({
  key: "mealPreferencesState",
  default: {
    dietType: "balanced", // balanced, high-protein, low-carb, vegetarian
    calorieTarget: 2000,
    proteinTarget: 150,
    mealCount: 3, // 3, 4, 5, 6
    excludeSugar: false,
    excludeDairy: false,
    excludeGluten: false,
  },
})

// Daily nutrition targets
export const nutritionTargetsState = atom({
  key: "nutritionTargetsState",
  default: {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
  },
})
