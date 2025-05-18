# Health Sync

A comprehensive health management platform for students and athletes built with the MERN stack.

## Table of Contents

1. [System Overview](#system-overview)
2. [Application Architecture](#application-architecture)
3. [Backend System](#backend-system)
   - [Environment Setup](#environment-setup)
   - [Database Models](#database-models)
   - [API Routes](#api-routes)
   - [Authentication System](#authentication-system)
4. [Frontend System](#frontend-system)
   - [Core Components](#core-components)
   - [State Management](#state-management)
5. [Core Features](#core-features)
6. [Data Flow](#data-flow)
7. [Security Implementation](#security-implementation)
8. [AI Integration](#ai-integration)


## System Overview

Health Sync is a comprehensive health management platform designed for students and athletes. The system provides:

- **Health metrics tracking** (BMI, vitals, medical history)
- **Nutrition management** (meal planning, tracking, protein calculator)
- **Fitness tracking** (workouts, exercise library, progress monitoring)
- **AI-powered health assistant** for personalized recommendations
- **User profile management** with comprehensive health profiles

## Application Architecture

Health Sync follows a modern MERN stack architecture:

```
Frontend (React) ↔ Backend (Express.js) ↔ Database (MongoDB)
                     ↑
                AI Service (Google Gemini)
```

### Key Characteristics:
- **Single Page Application** (React Router)
- **RESTful API** backend
- **JWT-based authentication**
- **Recoil for state management**
- **Responsive design** (mobile-first approach)

### Project Structure

```
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic services
│   ├── index.js         # Application entry point
│   └── package.json     # Dependencies and scripts
│
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React contexts
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components
│   │   ├── recoil/      # Recoil state management
│   │   ├── services/    # API service functions
│   │   ├── utils/       # Utility functions
│   │   ├── App.js       # Main application component
│   │   └── index.js     # Entry point
│   └── package.json     # Dependencies and scripts
│
└── README.md            # Project documentation
```

## Backend System

### Environment Setup

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000                           # Server port
MONGODB_URI='mongodb+srv://...'     # MongoDB connection string
JWT_SECRET="Test"                   # Secret for JWT token signing

# Email configuration for OTP and notifications
FROM_EMAIL="techboi@gmail.com"      # Sender email address
EMAIL_PASS="mmog slzt dnzl"         # App password for email service
TO_EMAIL="bloo.ounder@gmail.com"    # Default recipient for support messages

NODE_ENV="Local"                    # Environment mode (Local/Production)
Remote_url="https://..."            # Frontend deployment URL

API_KEY="AIzaSyD..."                # Google Gemini API key
```

**Security Note**: The JWT_SECRET and API_KEY in this example should be replaced with stronger values in production.

### Core Components

1. **Authentication Service**
   - JWT token generation/validation
   - Email verification (OTP)
   - Password reset flow
   - Session management

2. **User Management**
   - Comprehensive student profiles
   - Health metrics storage
   - Profile editing capabilities

3. **Health Data Services**
   - Metrics calculation (BMI, health status)
   - Protein requirements calculator
   - Health data history

4. **Nutrition Services**
   - Meal planning by day/week
   - Meal logging with nutritional tracking
   - Meal completion statistics

5. **Fitness Services**
   - Workout creation/management
   - Exercise library
   - Workout statistics and history

6. **AI Chat Service**
   - Conversation history management
   - Gemini AI integration
   - Response regeneration

### Database Models

#### 1. User Models
##### Student (`StudentSchema`)
- Comprehensive student profile with:
  - Authentication fields (email, password)
  - Personal information (name, age, gender)
  - Academic details (institute, course)
  - Health metrics (BMI, vitals, conditions)
  - Automatic health status calculation

##### HealthUser (`UserSchema`)
- Basic user model for authentication
- Email, password, verification status
- Selected health metrics preferences

#### 2. Health Data Models
##### HealthData (`HealthDataSchema`)
- Stores student health metrics by email
- Flexible mixed-type metrics field
- Automatic timestamp updates

##### OTP (`OTPSchema`)
- Manages one-time passwords for:
  - Email verification
  - Password reset
- Includes expiration tracking

#### 3. Nutrition Models
##### Meal (`MealSchema`)
- Detailed meal information:
  - Nutritional values (calories, macros)
  - Completion status
  - Ingredients and notes

##### MealLog (`MealLogSchema`)
- Daily meal logs with date references
- Links to specific meal records

##### MealPlan (`MealPlanSchema`)
- Weekly meal planning by day
- Organized by week start date

#### 4. Fitness Models
##### Exercise (`ExerciseSchema`)
- Comprehensive exercise database:
  - Muscle groups and categories
  - Difficulty levels
  - Text search capabilities

##### Workout (`WorkoutSchema`)
- User workout sessions:
  - Exercise sets and reps
  - Completion tracking
  - Duration metrics

#### 5. Support & Chat Models
##### Support (`SupportSchema`)
- Support ticket management:
  - Status tracking
  - User contact information

##### Chat (`ChatSchema`)
- AI conversation history:
  - Message threading
  - Timestamp tracking
  - User association

### API Routes

#### Authentication (`/api/auth`)
| Endpoint           | Method | Description                      |
|--------------------|--------|----------------------------------|
| `/signup`          | POST   | Register new user                |
| `/login`           | POST   | User login                       |
| `/check`           | GET    | Verify authentication            |
| `/logout`          | POST   | Invalidate session               |
| `/verify-otp`      | POST   | Verify OTP code                  |
| `/resend-otp`      | POST   | Request new OTP                  |
| `/forgot-password` | POST   | Initiate password reset          |
| `/reset-password`  | POST   | Complete password reset          |

#### Student Profiles (`/api/students`)
| Endpoint                     | Method | Description                      |
|------------------------------|--------|----------------------------------|
| `/save`                      | POST   | Save student profile             |
| `/`                          | GET    | Get all students                 |
| `/profile`                   | GET    | Get current user profile         |
| `/:email/basic`              | GET    | Get basic profile by email       |
| `/:email/health-data`        | GET    | Get health data by email         |
| `/metrics`                   | POST   | Save health metrics              |
| `/healthdata/save`           | PUT    | Update health data               |
| `/profile/edit`              | PUT    | Edit user profile                |

#### Health Metrics (`/api/health-metrics`)
| Endpoint                     | Method | Description                      |
|------------------------------|--------|----------------------------------|
| `/`                          | GET    | Get user health metrics          |
| `/`                          | PATCH  | Update health metrics            |
| `/calculate-protein`         | POST   | Calculate protein requirements   |

#### Nutrition Management
##### Meals (`/api/meals`)
| Endpoint                     | Method | Description                      |
|------------------------------|--------|----------------------------------|
| `/`                          | POST   | Create new meal                  |
| `/`                          | GET    | Get all meals                    |
| `/date/:date`                | GET    | Get meals by date                |
| `/:id`                       | GET    | Get specific meal                |
| `/:id`                       | PATCH  | Update meal                      |
| `/:id`                       | DELETE | Delete meal                      |
| `/:id/toggle-completion`     | PATCH  | Toggle completion status         |

##### Meal Plans (`/api/meal-plans`)
| Endpoint                     | Method | Description                      |
|------------------------------|--------|----------------------------------|
| `/`                          | POST   | Create new meal plan             |
| `/week/:weekStartDate`       | GET    | Get weekly plans                 |
| `/day/:day/:weekStartDate`   | GET    | Get daily plan                   |
| `/:id/meals`                | POST   | Add meal to plan                 |
| `/:id/meals/:mealId`        | DELETE | Remove meal from plan            |
| `/:id`                      | DELETE | Delete meal plan                 |

#### Fitness Management
##### Exercises (`/api/exercises`)
| Endpoint                     | Method | Description                      |
|------------------------------|--------|----------------------------------|
| `/`                          | GET    | Get all exercises                |
| `/search`                    | GET    | Search exercises                 |
| `/:id`                       | GET    | Get exercise details             |

##### Workouts (`/api/workouts`)
| Endpoint                     | Method | Description                      |
|------------------------------|--------|----------------------------------|
| `/`                          | GET    | Get all workouts                 |
| `/`                          | POST   | Create new workout               |
| `/active`                    | GET    | Get active workout               |
| `/stats`                     | GET    | Get workout statistics           |
| `/:id`                       | PUT    | Update workout                   |
| `/:id`                       | DELETE | Delete workout                   |
| `/:id/complete`              | PUT    | Mark workout complete            |

#### AI Chat (`/api/chat`)
| Endpoint                     | Method | Description                      |
|------------------------------|--------|----------------------------------|
| `/create`                    | POST   | Create new chat                  |
| `/history`                   | GET    | Get chat history                 |
| `/:chatId`                   | GET    | Get specific chat                |
| `/:chatId/message`           | POST   | Add message to chat              |
| `/:chatId/regenerate`        | POST   | Regenerate AI response           |
| `/:chatId`                   | DELETE | Delete chat                      |

#### Support (`/api/support`)
| Endpoint                     | Method | Description                      |
|------------------------------|--------|----------------------------------|
| `/message`                   | POST   | Send support message             |

### Authentication System
- **JWT-based authentication** using jsonwebtoken
- Password hashing with bcrypt
- Two-factor authentication via email OTP
- Password reset flow
- Session management with token invalidation

## Frontend System

### Core Components

1. **Authentication Flow**
   - Login/Registration
   - Password recovery
   - Profile completion wizard

2. **Main Application Layout**
   - Responsive header/navigation
   - Protected route system
   - Global state management

3. **Health Dashboard**
   - Metrics visualization
   - Health status indicators
   - Detailed metrics view

4. **Nutrition Module**
   - Meal planner (weekly view)
   - Meal tracker (daily logging)
   - Protein calculator
   - Nutritional targets

5. **Fitness Module**
   - Workout dashboard
   - Active workout tracking
   - Exercise library
   - Workout history

6. **AI Chat Interface**
   - Conversation history
   - Message threading
   - Response regeneration

### State Management

- **Recoil Atoms**:
  - `proteinNeedsState`: Calculated protein requirements
  - `trackedMealsState`: User's meal log
  - `availableMealsState`: Meal database
  - `activeWorkoutState`: Current workout session
  - `workoutsState`: Workout history
  - `mealPreferencesState`: User meal preferences
  - `nutritionTargetsState`: Nutritional goals
  - `exercisesLibraryState`: Exercise database
  - `workoutFiltersState`: Workout filtering options
  - `overlayState`: Modal management

- **Recoil Selectors**:
  - `workoutStatsSelector`: Calculates workout statistics
  - Nutrition targets and preferences
  - Meal completion percentages
  - Exercise frequency

## Core Features

### 1. Authentication & User Management
- Secure JWT-based authentication
- Email verification flow
- Password recovery system
- Complete profile wizard
- Role-based access control

### 2. Health Metrics Tracking
- Comprehensive health profile
- Automatic BMI calculation
- Vitals tracking with status indicators
- Medical history management
- Health status evaluation

### 3. Nutrition Management
#### Meal Planning
- Weekly meal organization
- Daily meal plans
- Nutritional targets
- Meal database with:
  - 100+ meal options
  - Detailed nutritional info
  - Categorized by meal type

#### Meal Tracking
- Daily logging
- Completion tracking
- Nutritional totals
- Progress visualization

#### Protein Calculator
- Custom protein requirements
- Activity-level based
- Goal-oriented calculation

### 4. Fitness Tracking
#### Workout Management
- Workout creation
- Exercise selection
- Set/rep tracking
- Duration monitoring

#### Exercise Library
- 50+ exercises
- Filter by:
  - Muscle group
  - Equipment
  - Difficulty
- Detailed instructions

#### Progress Tracking
- Workout history
- Performance metrics
- Frequency statistics
- Visual progress charts

### 5. AI Health Assistant
- Conversational interface
- Health advice on:
  - Nutrition
  - Fitness
  - General wellness
- Context-aware responses
- Conversation history

### 6. Support System
- Help center access
- Support ticket submission
- Issue tracking

## Data Flow

### Authentication Flow
```
Frontend → /api/auth/login → Backend → MongoDB (User verification) → JWT → Frontend (stores token)
```

### Health Data Submission
```
Frontend → /api/students/healthdata/save → Backend → MongoDB (HealthData collection) → Success response
```

### Workout Tracking
```
Frontend → /api/workouts → Backend → MongoDB (Workout collection) → Updated workout list → Frontend
```

### AI Chat
```
Frontend → /api/chat/message → Backend → Gemini API → Response saved → Frontend display
```

## Security Implementation

### Backend Security
- JWT authentication middleware
- Password hashing (bcrypt)
- Protected routes
- Input validation
- Rate limiting (recommended addition)

### Frontend Security
- Protected routes
- Token storage (memory)
- Secure API calls
- Auth context provider
- Automatic token refresh

## AI Integration

### Gemini AI Service
The Gemini AI service provides health advice through:
```javascript
const { generateAIResponse } = require('./geminiAssistant');

// Example usage:
const response = await generateAIResponse(userMessage, conversationHistory);