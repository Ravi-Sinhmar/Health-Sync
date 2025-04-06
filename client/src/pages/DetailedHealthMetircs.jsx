"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Card from "../components/ui/Card"
import apiConfig from './config/api';
import HealthStatusBox from "../components/ui/HealthStatusBox"
import {
  FaWeight,
  FaRulerVertical,
  FaHeartbeat,
  FaLungs,
  FaThermometerHalf,
  FaDumbbell,
  FaRunning,
  FaBrain,
  FaArrowLeft,
  FaTint,
  FaVenusMars,
  FaBirthdayCake,
  FaPhone,
  FaUser,
  FaUniversity,
  FaIdCard
} from "react-icons/fa"
import HealthMetricCard from "../components/ui/HealthMetricCard"
import toast from "react-hot-toast"

const DetailedHealthMetrics = () => {
  const { studentEmail } = useParams()
  const { currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isHealthy, setIsHealthy] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiConfig.baseURL}/students/profile`, {
          method: "GET",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) throw new Error("Failed to fetch profile data")

        const profileData = await response.json()
        setProfile(profileData)

        // Check health status
    
const hasAbnormalMetrics = 
profileData.bloodPressure?.systolic?.status !== "normal" ||
profileData.bloodPressure?.diastolic?.status !== "normal" ||
profileData.heartRate?.status !== "normal" ||
profileData.temperature?.status !== "normal" ||
profileData.oxygenSaturation?.status !== "normal"

setIsHealthy(!hasAbnormalMetrics)
      } catch (error) {
        console.error("Error:", error)
        toast.error("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [studentEmail])

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center mb-6">
          <Link to="/dashboard" className="mr-4">
            <FaArrowLeft className="text-gray-600 hover:text-violet-600" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Student Health Profile</h1>
        </div>

        {/* Profile Header */}
        <Card className="mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-gray-500">{profile.name?.charAt(0) || 'U'}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800">{profile.name || 'Unknown'}</h2>
              <p className="text-sm text-gray-500 mb-2">{profile.email}</p>
              <HealthStatusBox isHealthy={isHealthy} />
            </div>
          </div>
        </Card>

        {/* Compact Personal Details */}
        <Card title="Personal Details" className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <FaIdCard className="text-gray-400" />
              <span className="text-gray-600">Admission:</span>
              <span className="font-medium">{profile.admissionNumber || '--'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaUniversity className="text-gray-400" />
              <span className="text-gray-600">Course:</span>
              <span className="font-medium">{profile.course || '--'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaTint className="text-gray-400" />
              <span className="text-gray-600">Blood:</span>
              <span className="font-medium">{profile.bloodGroup || '--'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaVenusMars className="text-gray-400" />
              <span className="text-gray-600">Gender:</span>
              <span className="font-medium">{profile.gender || '--'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaBirthdayCake className="text-gray-400" />
              <span className="text-gray-600">DOB:</span>
              <span className="font-medium">
                {profile.dob ? new Date(profile.dob).toLocaleDateString() : '--'}
              </span>
            </div>
          </div>
        </Card>

        {/* Health Metrics */}
        <div className="space-y-6">
          <Card title="Vital Signs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <HealthMetricCard
                title="Blood Pressure"
                value={profile.bloodPressure?.systolic?.value && profile.bloodPressure?.diastolic?.value 
                  ? `${profile.bloodPressure.systolic.value}/${profile.bloodPressure.diastolic.value}`
                  : '--'}
                unit="mmHg"
                status={
                  profile.bloodPressure?.systolic?.status === "normal" && 
                  profile.bloodPressure?.diastolic?.status === "normal" 
                    ? "normal" 
                    : "high"
                }
                icon={FaHeartbeat}
                normalRange="90-120/60-80 mmHg"
              />

              <HealthMetricCard
                title="Heart Rate"
                value={profile.heartRate?.value || '--'}
                unit="bpm"
                status={profile.heartRate?.status || "normal"}
                icon={FaHeartbeat}
                normalRange="60-100 bpm"
              />

              <HealthMetricCard
                title="Oxygen Saturation"
                value={profile.oxygenSaturation?.value || '--'}
                unit="%"
                status={profile.oxygenSaturation?.status || "normal"}
                icon={FaLungs}
                normalRange="95-100%"
              />

              <HealthMetricCard
                title="Body Temperature"
                value={profile.temperature?.value || '--'}
                unit="°C"
                status={profile.temperature?.status || "normal"}
                icon={FaThermometerHalf}
                normalRange="36.1-37.2°C"
              />
            </div>
          </Card>

          {/* Additional Info */}
          <Card title="Additional Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-medium text-gray-900 mb-2">Sports & Activities</h3>
                <ul className="list-disc pl-5">
                  {profile.sports.map((sport, index) => (
                    <li key={index} className="text-gray-700">{sport}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-medium text-gray-900 mb-2">Allergies</h3>
                {profile.allergies.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {profile.allergies.map((allergy, index) => (
                      <li key={index} className="text-gray-700">{allergy}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No allergies recorded</p>
                )}
              </div>

              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-medium text-gray-900 mb-2">Chronic Conditions</h3>
                {profile.chronicConditions.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {profile.chronicConditions.map((condition, index) => (
                      <li key={index} className="text-gray-700">{condition}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No chronic conditions recorded</p>
                )}
              </div>

              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-medium text-gray-900 mb-2">Medications</h3>
                {profile.medications.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {profile.medications.map((medication, index) => (
                      <li key={index} className="text-gray-700">{medication}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No medications recorded</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DetailedHealthMetrics