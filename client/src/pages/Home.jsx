import Header from "./../components/layout/Header"
import { Activity, Apple, Utensils, LineChart, Calendar, Award } from "lucide-react"
import { Link } from "react-router-dom"


const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-12 md:py-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Explore your <span className="text-violet-600">student's health</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg">
                Delve into your student's health journey with comprehensive insights in one app
              </p>
              <div className="mt-8">
                <Link to='/register'>
                <button className="bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors">
                  Get Started
                </button>
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                <div className="absolute -top-10 right-0 w-32 h-32 bg-yellow-300 rounded-full opacity-70"></div>
                <div className="relative z-10 flex space-x-4">
                  <div className="w-40 h-40 overflow-hidden rounded-full">
                    <img
                      src="images/StudentStudying.jpg"
                      alt="Student studying"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-48 h-48 overflow-hidden rounded-full mt-16">
                    <img
                      src="images/StudentWithTeacher.jpeg"
                      alt="Student with teacher"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Middle section with health tracking features */}
      <section className="py-16 bg-gray-50 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Comprehensive Health Tracking</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform helps you monitor and improve student health with personalized insights and recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-[13px] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-6">
                <Activity className="text-violet-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Regular Health Data</h3>
              <p className="text-gray-600">
                Track vital health metrics like BMI, physical activity, sleep patterns, and more to get a complete
                picture of student health.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-[13px] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <LineChart className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Health Analytics</h3>
              <p className="text-gray-600">
                Visualize health trends over time with easy-to-understand charts and graphs that highlight areas of
                improvement.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-[13px] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-6">
                <Utensils className="text-violet-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Nutrition Guidance</h3>
              <p className="text-gray-600">
                Receive personalized food recommendations based on health data to ensure students get the nutrition they
                need.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-xl shadow-[13px] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <Apple className="text-orange-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Healthy Habits</h3>
              <p className="text-gray-600">
                Build lasting healthy habits with daily challenges, reminders, and achievement tracking for students.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-xl shadow-[13px] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Calendar className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Health Calendar</h3>
              <p className="text-gray-600">
                Schedule health check-ups, physical activities, and nutrition plans with our integrated calendar system.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-xl shadow-[13px] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-6">
                <Award className="text-pink-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Health Achievements</h3>
              <p className="text-gray-600">
                Celebrate health milestones with badges and certificates that motivate students to maintain healthy
                lifestyles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Section - Based on second image */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              It's never too late to get to know your student better
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our app helps you to be aware of students' health achievements, progress, and success
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl overflow-hidden">
              <img
                src="images/StudentFood.jpg"
                alt="Student with healthy food"
                className="w-full h-auto"
              />
            </div>

  <div className="bg-yellow-100 p-8 rounded-2xl shadow-[13px] border border-gray-100 h-full ">
    <h3 className="text-2xl font-bold text-gray-800 mb-6">Nutrition & Wellness Benefits</h3>
    
    <div className="space-y-6">
      <div className="flex">
        <div className="bg-yellow-100 p-2 rounded-lg mr-4">
          <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">Improved Energy Levels</h4>
          <p className="text-gray-600 text-[13px] mt-1">Balanced nutrition provides sustained energy throughout the day</p>
        </div>
      </div>

      <div className="flex">
        <div className="bg-violet-100 p-2 rounded-lg mr-4">
          <svg className="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">Stronger Immunity</h4>
          <p className="text-gray-600 text-[13px] mt-1">Nutrient-rich foods boost your body's natural defenses</p>
        </div>
      </div>

      <div className="flex">
        <div className="bg-green-100 p-2 rounded-lg mr-4">
          <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">Better Mental Health</h4>
          <p className="text-gray-600 text-[13px] mt-1">Proper nutrition supports brain function and emotional wellbeing</p>
        </div>
      </div>
    </div>
  </div>

          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

