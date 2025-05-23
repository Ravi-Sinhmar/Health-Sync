"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { RecoilRoot, useRecoilValue } from "recoil"
import { Toaster } from "react-hot-toast"
import { overlayState } from "./recoil/atoms"

// Auth Pages
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import ForgotPassword from "./pages/auth/ForgotPassword"
import VerifyOTP from "./pages/auth/VerifyOTP"
import SetPassword from "./pages/auth/SetPassword"
import CompleteProfile from "./pages/auth/CompleteProfile"
import StudentHealthDashboard from "./pages/StudentHealthDashboard"

// Main pages
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import EditProfile from './pages/EditProfile';
import DetailedHealthMetrics from "./pages/DetailedHealthMetircs"
import HealthData from "./pages/HealthData"
import NotFound from "./pages/NotFound"
import Users from "./pages/Users"
import Help from "./pages/Help"

// Workout Tracking Pages
import WorkoutApp from "./pages/WorkApp"
import WorkoutDashboard from "./pages/WorkDashboard"
import ActiveWorkout from "./pages/ActiveWork"
import ExerciseLibrary from "./pages/ExerciseLib"
import WorkoutHistory from "./pages/WorkHistory"
import CreateWorkout from "./pages/CreateWork"


// Meal planner/tracker , protein calculator
import ProteinCalculator from "./pages/ProteinCalculator"
import BasicDetails from "./pages/BasicDetails"
import MealType from "./pages/MealType"


import OverlayBackround from "./components/layout/OverlayBackround"

// Layout Components
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"

// Auth Provider
import { AuthProvider, useAuth } from "./context/AuthContext"
import HealthEdit from "./pages/HealthEdit"
import MealPlanner from "./pages/MealPlanner"
import MealTracker from "./pages/MealTracker"
import ChatPage from "./pages/ChatPage"
import StandaloneAuthenticationConfig from "./pages/Test/StandaloneAuthenticationConfig"
import StandaloneConfiguration from "./pages/Test/StandaloneConfiguration"

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
}

// Public Route Component (redirects to profile if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/profile" />
  }

  return children
}

function AppLayout({ children }) {
  const isOverlay = useRecoilValue(overlayState);
  return (
    <>
      {isOverlay && <OverlayBackround />}
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  )
}

function App() {
  return (
    <RecoilRoot>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
           



{/* Ignore these , testing route */}
            <Route
              path="/t1"
              element={
                <PublicRoute>
                  <StandaloneAuthenticationConfig />
                </PublicRoute>
              }
            />

<Route
              path="/t2"
              element={
                <PublicRoute>
                  <StandaloneConfiguration />
                </PublicRoute>
              }
            />


{/* Start from here */}


            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <StudentHealthDashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ChatPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />


            <Route
              path="/"
              element={
                <AppLayout>
                  <Home />
                </AppLayout>
              }
            />

            {/* Auth Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/verify-otp"
              element={
                <PublicRoute>
                  <VerifyOTP />
                </PublicRoute>
              }
            />
            <Route
              path="/set-password"
              element={
                <SetPassword />
              }
            />
            <Route
              path="/complete-profile"
              element={
                <CompleteProfile />
              }
            />

            {/* Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <EditProfile />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile/health"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DetailedHealthMetrics />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/health/save"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <HealthData />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/health/edit"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <HealthEdit />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Workout Tracking Routes */}
            <Route
              path="/workouts"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <WorkoutApp />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/workouts/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <WorkoutDashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/workouts/active"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ActiveWorkout />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/workouts/exercises"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ExerciseLibrary />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/workouts/history"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <WorkoutHistory />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/workouts/create"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CreateWorkout />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            {/* Protein Calculator */}
            <Route
              path="/meal/protein/calculator"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ProteinCalculator />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/meal/details"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <BasicDetails />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/meal/type"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <MealType />
                  </AppLayout>
                </ProtectedRoute>
              }
            />


            {/* Meal Planner and Meal tracker */}
            <Route
              path="/meal/planner"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <MealPlanner />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/meal/tracker"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <MealTracker />
                  </AppLayout>
                </ProtectedRoute>
              }
            />


            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Users />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Help />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <AppLayout>
                  <NotFound />
                </AppLayout>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </RecoilRoot>
  )
}

export default App