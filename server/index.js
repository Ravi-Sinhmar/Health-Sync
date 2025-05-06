const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config()
const authRoutes = require("./routes/auth")
const studentRoutes = require("./routes/students")
const supportRoutes = require("./routes/support")
const cookieParser = require('cookie-parser');
const test = require('./models/test');
// Add these lines to your existing imports
const workoutRoutes = require('./routes/workouts');
const exerciseRoutes = require('./routes/exercises');

// Meal Routes
const healthMetricsRoute = require('./routes/healthMetrics');
const mealLogsRoute = require('./routes/mealLogs');
const mealPlanRoute = require('./routes/mealPlans');
const mealsRoute = require('./routes/meals');
// Chat Routes
const chatRoute = require('./routes/chatRoutes');



const Remote_url = process.env.NODE_ENV == 'Production' ? process.env.Remote_url : 'http://localhost:5173'


// Load environment variables


// Initialize Express app
const app = express()
const PORT = process.env.PORT || 5000

// CORS configuration
app.use(cors({
  origin: Remote_url, // Frontend domain
  credentials: true, // Allow cookies
}));


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", Remote_url); // Frontend URL
  next();
});
// Add this after your CORS middleware
app.use(cookieParser());
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/health-tracker", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/auth", authRoutes)
app.use("/students", studentRoutes)
app.use("/support", supportRoutes)


// Add these lines after your existing routes
app.use("/api/workouts", workoutRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/meals",mealsRoute);
app.use("/api/meal-logs",mealLogsRoute);
app.use("/api/meal-plans",mealPlanRoute);
app.use("/api/health-metrics",healthMetricsRoute);
app.use("/chat",chatRoute)



// Add this to seed initial exercise data (run once)
const seedExercises = async () => {
  const Exercise = require('./models/Exercise');
  
  try {
    // Check if exercises already exist
    const count = await Exercise.countDocuments();
    
    if (count === 0) {
      console.log('Seeding exercise data...');
      
      // Sample exercise data
      const exercises = [
        {
          name: 'Bench Press',
          description: 'A compound exercise that targets the chest, shoulders, and triceps.',
          instructions: [
            'Lie on a flat bench with your feet flat on the floor.',
            'Grip the barbell with hands slightly wider than shoulder-width apart.',
            'Lower the barbell to your chest, keeping your elbows at a 45-degree angle.',
            'Press the barbell back up to the starting position.'
          ],
          muscleGroup: 'chest',
          category: 'strength',
          equipment: ['barbell', 'bench'],
          difficulty: 'intermediate'
        },
        {
          name: 'Squat',
          description: 'A compound exercise that primarily targets the quadriceps, hamstrings, and glutes.',
          instructions: [
            'Stand with feet shoulder-width apart, toes slightly turned out.',
            'Keep your chest up and back straight.',
            'Bend at the knees and hips to lower your body as if sitting in a chair.',
            'Lower until thighs are parallel to the ground or as low as you can go with good form.',
            'Push through your heels to return to the starting position.'
          ],
          muscleGroup: 'legs',
          category: 'strength',
          equipment: ['barbell', 'squat rack'],
          difficulty: 'intermediate'
        },
        {
          name: 'Deadlift',
          description: 'A compound exercise that targets the back, glutes, and hamstrings.',
          instructions: [
            'Stand with feet hip-width apart, toes under the barbell.',
            'Bend at the hips and knees, keeping your back straight.',
            'Grip the barbell with hands just outside your legs.',
            'Lift the bar by extending your hips and knees, keeping the bar close to your body.',
            'Stand up straight, then reverse the movement to return the bar to the floor.'
          ],
          muscleGroup: 'back',
          category: 'strength',
          equipment: ['barbell'],
          difficulty: 'intermediate'
        },
        {
          name: 'Pull-up',
          description: 'A compound exercise that targets the back, biceps, and shoulders.',
          instructions: [
            'Hang from a pull-up bar with hands slightly wider than shoulder-width apart.',
            'Pull your body up until your chin is over the bar.',
            'Lower yourself back down with control.'
          ],
          muscleGroup: 'back',
          category: 'strength',
          equipment: ['pull-up bar'],
          difficulty: 'advanced'
        },
        {
          name: 'Shoulder Press',
          description: 'A compound exercise that targets the shoulders and triceps.',
          instructions: [
            'Sit or stand with feet shoulder-width apart.',
            'Hold dumbbells at shoulder height with palms facing forward.',
            'Press the weights up until your arms are fully extended overhead.',
            'Lower the weights back to shoulder height with control.'
          ],
          muscleGroup: 'shoulders',
          category: 'strength',
          equipment: ['dumbbells'],
          difficulty: 'intermediate'
        },
        {
          name: 'Bicep Curl',
          description: 'An isolation exercise that targets the biceps.',
          instructions: [
            'Stand with feet shoulder-width apart, holding dumbbells at your sides.',
            'Keep your elbows close to your torso and palms facing forward.',
            'Curl the weights up to shoulder level while keeping your upper arms stationary.',
            'Lower the weights back to the starting position with control.'
          ],
          muscleGroup: 'biceps',
          category: 'strength',
          equipment: ['dumbbells'],
          difficulty: 'beginner'
        },
        {
          name: 'Tricep Dip',
          description: 'An isolation exercise that targets the triceps.',
          instructions: [
            'Sit on the edge of a bench with hands gripping the edge beside your hips.',
            'Slide your butt off the bench with legs extended.',
            'Lower your body by bending your elbows until they reach a 90-degree angle.',
            'Push yourself back up to the starting position.'
          ],
          muscleGroup: 'triceps',
          category: 'strength',
          equipment: ['bench'],
          difficulty: 'intermediate'
        },
        {
          name: 'Plank',
          description: 'A core exercise that targets the abdominals and improves stability.',
          instructions: [
            'Start in a push-up position, then bend your elbows and rest your weight on your forearms.',
            'Your body should form a straight line from head to feet.',
            'Engage your core and hold the position.'
          ],
          muscleGroup: 'core',
          category: 'strength',
          equipment: [],
          difficulty: 'beginner'
        },
        {
          name: 'Running',
          description: 'A cardiovascular exercise that improves endurance and burns calories.',
          instructions: [
            'Start with a warm-up walk or light jog.',
            'Maintain good posture with a slight forward lean.',
            'Land midfoot and roll through to push off with your toes.',
            'Keep a comfortable pace that allows you to maintain proper form.'
          ],
          muscleGroup: 'cardio',
          category: 'cardio',
          equipment: ['running shoes'],
          difficulty: 'beginner'
        },
        {
          name: 'Jumping Jacks',
          description: 'A full-body cardio exercise that raises your heart rate.',
          instructions: [
            'Stand with feet together and arms at your sides.',
            'Jump up, spreading your feet beyond shoulder width and bringing your arms above your head.',
            'Jump again, returning to the starting position.',
            'Repeat at a quick pace.'
          ],
          muscleGroup: 'cardio',
          category: 'cardio',
          equipment: [],
          difficulty: 'beginner'
        }
      ];
      
      await Exercise.insertMany(exercises);
      console.log('Exercise data seeded successfully!');
    }
  } catch (error) {
    console.error('Error seeding exercise data:', error);
  }
};

// Call the seed function when the app starts
seedExercises();
// Error handling middleware

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})