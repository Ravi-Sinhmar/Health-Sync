"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import apiConfig from './config/api';
import HealthStatusBox from "../components/ui/HealthStatusBox"
import {
  FaUser,
  FaSchool,
  FaPhone,
  FaCalendarAlt,
  FaTint,
  FaVenusMars,
  FaChevronDown,
  FaChevronUp,
  FaGraduationCap,
  FaHome,
} from "react-icons/fa"
import { GiHealthNormal } from "react-icons/gi"
import { PlusCircle, FileEdit, ClipboardPlus, ClipboardEdit } from "lucide-react"
import HealthMetricCard from "../components/ui/HealthMetricCard"
import toast from "react-hot-toast"

const Profile = () => {
  const { currentUser } = useAuth()
  const [profile, setProfile] = useState({
    name: "N/A",
    email: "N/A",
    dob: "N/A",
    gender: "N/A",
    sports: "N/A",
    admissionNumber: "N/A",
    course: "N/A",
    bloodGroup: "N/A",
    phone: "N/A",
    fatherName: "N/A",
    address: "N/A",
    healthStatus: "unknown",
  })
  const [loading, setLoading] = useState(true)
  const [expandedProfile, setExpandedProfile] = useState(false)
  const [expandedHealth, setExpandedHealth] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hasHealthData, setHasHealthData] = useState(false)

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
      // Auto-expand on large screens
      if (window.innerWidth >= 1024) {
        setExpandedProfile(true)
        setExpandedHealth(true)
      } else {
        setExpandedProfile(false)
        setExpandedHealth(false)
      }
    }

    // Initial check
    checkScreenSize()

    // Add event listener
    window.addEventListener("resize", checkScreenSize)

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch combined profile and health data
        const response = await fetch(`${apiConfig.baseURL}/students/profile`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch profile data")
        }

        const data = await response.json()

        // Check if health data exists
        const hasHealth = !!(
          data.height ||
          data.weight ||
          data.bmi ||
          data.bloodPressure?.systolic?.value ||
          data.heartRate?.value ||
          data.temperature?.value ||
          data.oxygenSaturation?.value
        )

        setHasHealthData(hasHealth)

        const healthStatus =
          data.bloodPressure?.systolic?.status === "normal" &&
          data.bloodPressure?.diastolic?.status === "normal" &&
          data.heartRate?.status === "normal" &&
          data.temperature?.status === "normal" &&
          data.oxygenSaturation?.status === "normal"
            ? "healthy"
            : "unhealthy"

        // Set profile data with defaults for missing fields
        setProfile({
          name: data.name || "N/A",
          email: data.email || "N/A",
          dob: data.dob || "N/A",
          gender: data.gender || "N/A",
          sports: data.sports?.[0] || "N/A",
          admissionNumber: data.admissionNumber || "N/A",
          course: data.course || "N/A",
          bloodGroup: data.bloodGroup || "N/A",
          phone: data.phone || "N/A",
          fatherName: data.fatherName || "N/A",
          address: "N/A", // Not in schema
          healthStatus: hasHealth ? healthStatus : "unknown",
          allergies: data.allergies?.join(", ") || "None reported",
          medications: data.medications?.join(", ") || "None reported",
          emergencyContact: data.emergencyContact
            ? `${data.emergencyContact.name} (${data.emergencyContact.relationship}) - ${data.emergencyContact.phone}`
            : "Not specified",
          // Health metrics
          height: data.height,
          weight: data.weight,
          bmi: data.bmi,
          bloodPressure: data.bloodPressure,
          heartRate: data.heartRate,
          temperature: data.temperature,
          oxygenSaturation: data.oxygenSaturation,
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load data")

        // Set fallback data
        setProfile((prev) => ({
          ...prev,
          healthStatus: "unhealthy",
          allergies: "Peanuts, Dust",
          medications: "None reported",
          emergencyContact: "John Doe (Father) - +1234567890",
        }))

        // Assume no health data in error case
        setHasHealthData(false)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentUser])

  // Format health metrics for display
  const formatHealthMetrics = () => {
    return {
      weight: {
        value: profile.weight || "--",
        unit: "kg",
        status: "normal",
        normalRange: "60-75 kg",
      },
      height: {
        value: profile.height || "--",
        unit: "cm",
        status: "normal",
        normalRange: "160-190 cm",
      },
      bmi: {
        value: profile.bmi || "--",
        unit: "",
        status: "normal",
        normalRange: "18.5-24.9",
      },
      bloodPressure: {
        value: profile.bloodPressure
          ? `${profile.bloodPressure.systolic?.value || "--"}/${profile.bloodPressure.diastolic?.value || "--"}`
          : "--/--",
        unit: "mmHg",
        status: profile.bloodPressure?.systolic?.status || "normal",
        normalRange: "90-120/60-80 mmHg",
      },
      heartRate: {
        value: profile.heartRate?.value || "--",
        unit: "bpm",
        status: profile.heartRate?.status || "normal",
        normalRange: "60-100 bpm",
      },
      temperature: {
        value: profile.temperature?.value || "--",
        unit: "°C",
        status: profile.temperature?.status || "normal",
        normalRange: "36.1-37.2°C",
      },
      oxygenSaturation: {
        value: profile.oxygenSaturation?.value || "--",
        unit: "%",
        status: profile.oxygenSaturation?.status || "normal",
        normalRange: "95-100%",
      },
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <HealthStatusBox isHealthy={profile.healthStatus === "healthy"} />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - All Student Details in One Box */}
          <div>
            <Card>
              <div className="flex justify-end p-4">
                <Link
                  to="/profile/edit"
                  className="group flex items-center gap-1.5 text-violet-600 hover:text-violet-800 transition-colors"
                >
                  <FileEdit className="size-4" />
                  <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Edit Profile
                  </span>
                </Link>
              </div>
              <div className="flex flex-col items-center p-4 border-b">
                <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center mb-2">
                  <FaUser className="text-violet-600 text-lg" />
                </div>
                <h2 className="text-base font-medium text-gray-800">{profile.name}</h2>
                <p className="text-xs text-gray-500 mb-2">{profile.email}</p>

                {isMobile && (
                  <button
                    onClick={() => setExpandedProfile(!expandedProfile)}
                    className="mt-2 px-4 py-1.5 bg-violet-50 text-violet-600 rounded-full text-xs font-medium flex items-center hover:bg-violet-100 transition-colors"
                  >
                    {expandedProfile ? (
                      <>
                        Hide Details <FaChevronUp className="ml-1.5" />
                      </>
                    ) : (
                      <>
                        Show Details <FaChevronDown className="ml-1.5" />
                      </>
                    )}
                  </button>
                )}
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedProfile ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {/* Personal Information */}
                <div className="p-4 border-b">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-start">
                      <FaCalendarAlt className="text-gray-400 mt-0.5 mr-2 flex-shrink-0 text-xs" />
                      <div>
                        <p className="text-xs text-gray-500">Date of Birth</p>
                        <p className="text-gray-700">{profile.dob}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaVenusMars className="text-gray-400 mt-0.5 mr-2 flex-shrink-0 text-xs" />
                      <div>
                        <p className="text-xs text-gray-500">Gender</p>
                        <p className="text-gray-700">{profile.gender}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaTint className="text-gray-400 mt-0.5 mr-2 flex-shrink-0 text-xs" />
                      <div>
                        <p className="text-xs text-gray-500">Blood Group</p>
                        <p className="text-gray-700">{profile.bloodGroup}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaPhone className="text-gray-400 mt-0.5 mr-2 flex-shrink-0 text-xs" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-gray-700">{profile.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="p-4 border-b">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Academic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-start">
                      <FaSchool className="text-gray-400 mt-0.5 mr-2 flex-shrink-0 text-xs" />
                      <div>
                        <p className="text-xs text-gray-500">Institute</p>
                        <p className="text-gray-700">{profile.instituteName}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaGraduationCap className="text-gray-400 mt-0.5 mr-2 flex-shrink-0 text-xs" />
                      <div>
                        <p className="text-xs text-gray-500">Admission Number</p>
                        <p className="text-gray-700">{profile.admissionNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaGraduationCap className="text-gray-400 mt-0.5 mr-2 flex-shrink-0 text-xs" />
                      <div>
                        <p className="text-xs text-gray-500">Course</p>
                        <p className="text-gray-700">{profile.course}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaGraduationCap className="text-gray-400 mt-0.5 mr-2 flex-shrink-0 text-xs" />
                      <div>
                        <p className="text-xs text-gray-500">Sports/Activities</p>
                        <p className="text-gray-700">{profile.sports}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Family Information */}
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Family Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-start">
                      <FaUser className="text-gray-400 mt-0.5 mr-2 flex-shrink-0 text-xs" />
                      <div>
                        <p className="text-xs text-gray-500">Father's Name</p>
                        <p className="text-gray-700">{profile.fatherName}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaHome className="text-gray-400 mt-0.5 mr-2 flex-shrink-0 text-xs" />
                      <div>
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="text-gray-700">{profile.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - All Health Details in One Box */}
          <div>
            <Card>
              <div className="flex justify-end p-4">
                {hasHealthData ? (
                  <Link
                    to="/health/edit"
                    className="group flex items-center gap-1.5 text-emerald-600 hover:text-emerald-800 transition-colors"
                  >
                    <ClipboardEdit className="size-4" />
                    <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Edit Health Data
                    </span>
                  </Link>
                ) : (
                  <Link
                    to="/health/save"
                    className="group flex items-center gap-1.5 text-emerald-600 hover:text-emerald-800 transition-colors"
                  >
                    <ClipboardPlus className="size-4" />
                    <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Add Health Data
                    </span>
                  </Link>
                )}
              </div>

              <div className="flex flex-col items-center p-4 border-b">
                <div
                  className={`w-16 h-16 ${hasHealthData ? "bg-emerald-50" : "bg-amber-50"} rounded-full flex items-center justify-center mb-2 transition-colors`}
                >
                  <GiHealthNormal
                    className={`${hasHealthData ? "text-emerald-600" : "text-amber-600"} text-lg transition-colors`}
                  />
                </div>
                <h2 className="text-base font-medium text-gray-800">Health Overview</h2>
                <p className="text-xs text-gray-500 mb-2">
                  {!hasHealthData
                    ? "No health data available"
                    : profile.healthStatus === "healthy"
                      ? "All metrics normal"
                      : "Some metrics need attention"}
                </p>

                {isMobile && (
                  <button
                    onClick={() => setExpandedHealth(!expandedHealth)}
                    className={`mt-2 px-4 py-1.5 ${hasHealthData ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-amber-50 text-amber-600 hover:bg-amber-100"} rounded-full text-xs font-medium flex items-center transition-colors`}
                  >
                    {expandedHealth ? (
                      <>
                        Hide Details <FaChevronUp className="ml-1.5" />
                      </>
                    ) : (
                      <>
                        Show Details <FaChevronDown className="ml-1.5" />
                      </>
                    )}
                  </button>
                )}
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedHealth ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {!hasHealthData ? (
                  <div className="p-8 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center">
                        <ClipboardPlus className="text-amber-600 size-6" />
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">No Health Data Available</h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Add health information to track and monitor student's health metrics
                    </p>
                    <Link
                      to="/health/save"
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-xs font-medium rounded-md hover:bg-emerald-700 transition-colors"
                    >
                      <PlusCircle className="size-3.5 mr-1.5" />
                      Add Health Information
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Health Summary */}
                    <div className="p-4 border-b">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Health Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="flex items-start">
                          <GiHealthNormal className="text-gray-400 mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <div>
                            <p className="text-xs text-gray-500">Allergies</p>
                            <p className="text-gray-700">{profile.allergies}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <GiHealthNormal className="text-gray-400 mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <div>
                            <p className="text-xs text-gray-500">Medications</p>
                            <p className="text-gray-700">{profile.medications}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <FaPhone className="text-gray-400 mt-0.5 mr-2 flex-shrink-0 text-xs" />
                          <div>
                            <p className="text-xs text-gray-500">Emergency Contact</p>
                            <p className="text-gray-700">{profile.emergencyContact}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Health Metrics */}
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Health Metrics</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(formatHealthMetrics()).map(([key, metric]) => (
                          <HealthMetricCard
                            key={key}
                            title={key.split(/(?=[A-Z])/).join(" ")}
                            value={metric.value}
                            unit={metric.unit}
                            status={metric.status}
                            normalRange={metric.normalRange}
                            className="text-xs"
                          />
                        ))}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link to={`/profile/health`}>
                          <Button variant="outline" size="sm">
                            View Full Report
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

