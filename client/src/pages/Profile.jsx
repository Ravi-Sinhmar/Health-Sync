"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import apiConfig from "../config/api"


const Card = ({ children, className = "" }) => {
  return <div className={`bg-white rounded-lg shadow-sm border border-gray-100 ${className}`}>{children}</div>
}

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium text-[13px] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variantStyles = {
    primary: "bg-violet-600 text-white hover:bg-violet-700 focus:ring-violet-500",
    outline: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus:ring-violet-500",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  }

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

const Badge = ({ children, variant = "default", className = "" }) => {
  const variantStyles = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-emerald-100 text-emerald-800",
    destructive: "bg-red-100 text-red-800",
    outline: "bg-transparent border border-gray-200 text-gray-700",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

const Tabs = ({ children, defaultValue, className = "" }) => {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <div className={`w-full ${className}`}>
      {React.Children.map(children, (child) => {
        if (child.type === TabsList) {
          return React.cloneElement(child, { activeTab, setActiveTab })
        }
        if (child.type === TabsContent) {
          return React.cloneElement(child, { activeTab })
        }
        return child
      })}
    </div>
  )
}

const TabsList = ({ children, activeTab, setActiveTab, className = "" }) => {
  return (
    <div className={`flex space-x-1 rounded-lg bg-gray-50 p-1 ${className}`}>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          isActive: activeTab === child.props.value,
          onClick: () => setActiveTab(child.props.value),
        })
      })}
    </div>
  )
}

const TabsTrigger = ({ children, value, isActive, onClick, className = "" }) => {
  return (
    <button
      className={`px-3 py-1.5 text-[13px] font-medium rounded-md transition-all ${
        isActive ? "bg-white text-violet-700 shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

const TabsContent = ({ children, value, activeTab, className = "" }) => {
  if (value !== activeTab) return null

  return <div className={`mt-4 ${className}`}>{children}</div>
}

const toast = {
  error: (message) => {
    console.error(message)
    alert(message)
  },
}

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
  const [hasHealthData, setHasHealthData] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
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
          address: "N/A",
          healthStatus: hasHealth ? healthStatus : "unknown",
          allergies: data.allergies?.join(", ") || "None reported",
          medications: data.medications?.join(", ") || "None reported",
          emergencyContact: data.emergencyContact
            ? `${data.emergencyContact.name} (${data.emergencyContact.relationship}) - ${data.emergencyContact.phone}`
            : "Not specified",
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
        toast.error("Failed to load profile data")

        setProfile((prev) => ({
          ...prev,
          healthStatus: "unhealthy",
          allergies: "Peanuts, Dust",
          medications: "None reported",
          emergencyContact: "John Doe (Father) - +1234567890",
        }))

        setHasHealthData(false)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentUser])

  const formatHealthMetrics = () => {
    return {
      weight: {
        value: profile.weight || "--",
        unit: "kg",
        status: "normal",
        normalRange: "60-75 kg",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="5" r="3" />
            <path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z" />
          </svg>
        ),
      },
      height: {
        value: profile.height || "--",
        unit: "cm",
        status: "normal",
        normalRange: "160-190 cm",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Z" />
            <path d="M3 7h18" />
            <path d="M3 11h18" />
            <path d="M3 15h18" />
            <path d="M7 3v18" />
            <path d="M11 3v18" />
            <path d="M15 3v18" />
          </svg>
        ),
      },
      bmi: {
        value: profile.bmi || "--",
        unit: "",
        status: "normal",
        normalRange: "18.5-24.9",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        ),
      },
      bloodPressure: {
        value: profile.bloodPressure
          ? `${profile.bloodPressure.systolic?.value || "--"}/${profile.bloodPressure.diastolic?.value || "--"}`
          : "--/--",
        unit: "mmHg",
        status: profile.bloodPressure?.systolic?.status || "normal",
        normalRange: "90-120/60-80 mmHg",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        ),
      },
      heartRate: {
        value: profile.heartRate?.value || "--",
        unit: "bpm",
        status: profile.heartRate?.status || "normal",
        normalRange: "60-100 bpm",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        ),
      },
      temperature: {
        value: profile.temperature?.value || "--",
        unit: "°C",
        status: profile.temperature?.status || "normal",
        normalRange: "36.1-37.2°C",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
          </svg>
        ),
      },
      oxygenSaturation: {
        value: profile.oxygenSaturation?.value || "--",
        unit: "%",
        status: profile.oxygenSaturation?.status || "normal",
        normalRange: "95-100%",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 13C8.13 13 5 9.87 5 6h14c0 3.87-3.13 7-7 7z" />
            <path d="M12 3a3 3 0 0 0-3 3" />
          </svg>
        ),
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
    <div className="min-h-screen bg-gray-50">
      

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Student Profile</h1>
            <p className="text-gray-500 text-[13px]">View and manage your personal and health information</p>
          </div>
          <div>
            <Badge
              variant={
                profile.healthStatus === "healthy"
                  ? "success"
                  : profile.healthStatus === "unhealthy"
                    ? "destructive"
                    : "outline"
              }
            >
              {profile.healthStatus === "healthy"
                ? "Healthy"
                : profile.healthStatus === "unhealthy"
                  ? "Needs Attention"
                  : "No Health Data"}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="health">Health Information</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-violet-100 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-violet-600"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{profile.name}</h2>
                    <p className="text-gray-500 text-[13px]">{profile.email}</p>
                  </div>
                </div>
                <Link to="/profile/edit">
                  <Button variant="outline">Edit Profile</Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <h3 className="text-base font-medium text-gray-800 mb-3">Personal Details</h3>
                  <div className="space-y-3">
                    <DetailItem icon="calendar" label="Date of Birth" value={profile.dob} />
                    <DetailItem icon="user" label="Gender" value={profile.gender} />
                    <DetailItem icon="heart" label="Blood Group" value={profile.bloodGroup} />
                    <DetailItem icon="phone" label="Phone" value={profile.phone} />
                  </div>
                </div>

                <div className="space-y-5">
                  <h3 className="text-base font-medium text-gray-800 mb-3">Academic & Family</h3>
                  <div className="space-y-3">
                    <DetailItem icon="school" label="Institute" value={profile.instituteName || "N/A"} />
                    <DetailItem icon="id-card" label="Admission Number" value={profile.admissionNumber} />
                    <DetailItem icon="book" label="Course" value={profile.course} />
                    <DetailItem icon="home" label="Address" value={profile.address} />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="health">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-emerald-600"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Health Overview</h2>
                    <p className="text-gray-500 text-[13px]">
                      {!hasHealthData
                        ? "No health data available"
                        : profile.healthStatus === "healthy"
                          ? "All metrics normal"
                          : "Some metrics need attention"}
                    </p>
                  </div>
                </div>
                <Link to="/health/save">
                  <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    {hasHealthData ? "Update Health Data" : "Add Health Data"}
                  </Button>
                </Link>
              </div>

              {!hasHealthData ? (
                <div className="text-center py-10">
                  <div className="mx-auto w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-amber-600"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" x2="12" y1="8" y2="12" />
                      <line x1="12" x2="12.01" y1="16" y2="16" />
                    </svg>
                  </div>
                  <h3 className="text-base font-medium text-gray-800 mb-1">No Health Data Available</h3>
                  <p className="text-gray-500 text-[13px] max-w-md mx-auto mb-5">
                    Add health information to track and monitor your health metrics
                  </p>
                  <Link to="/health/save">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">Add Health Information</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    <h3 className="text-base font-medium text-gray-800 mb-3">Health Summary</h3>
                    <div className="space-y-3">
                      <DetailItem icon="alert-circle" label="Allergies" value={profile.allergies} />
                      <DetailItem icon="check-circle" label="Medications" value={profile.medications} />
                      <DetailItem icon="phone" label="Emergency Contact" value={profile.emergencyContact} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-medium text-gray-800 mb-3">Health Metrics</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(formatHealthMetrics()).map(([key, metric]) => (
                        <MetricCard key={key} metric={metric} name={key} />
                      ))}
                    </div>

                    <div className="mt-5 flex justify-end">
                      <Link to="/dashboard">
                        <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                          View Full Health Report
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

const DetailItem = ({ icon, label, value }) => {
  const icons = {
    calendar: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-violet-500 mt-0.5"
      >
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </svg>
    ),
    user: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-violet-500 mt-0.5"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    heart: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-violet-500 mt-0.5"
      >
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
      </svg>
    ),
    phone: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-violet-500 mt-0.5"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    school: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-violet-500 mt-0.5"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
      </svg>
    ),
    "id-card": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-violet-500 mt-0.5"
      >
        <rect width="18" height="14" x="3" y="5" rx="2" />
        <line x1="7" x2="17" y1="9" y2="9" />
        <line x1="7" x2="17" y1="12" y2="12" />
        <line x1="7" x2="12" y1="15" y2="15" />
      </svg>
    ),
    book: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-violet-500 mt-0.5"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    home: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-violet-500 mt-0.5"
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    "alert-circle": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-emerald-500 mt-0.5"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
      </svg>
    ),
    "check-circle": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-emerald-500 mt-0.5"
      >
        <path d="m9 12 2 2 4-4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  }

  return (
    <div className="flex items-start gap-3">
      {icons[icon]}
      <div>
        <p className="text-[13px] text-gray-500">{label}</p>
        <p className="font-medium text-[13px]">{value}</p>
      </div>
    </div>
  )
}

const MetricCard = ({ metric, name }) => {
  return (
    <div
      className={`p-3 rounded-lg border ${
        metric.status === "normal" ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        {metric.icon}
        <span className="text-[13px] font-medium capitalize">
          {name.replace(/([A-Z])/g, " $1").trim()}
        </span>
      </div>
      <div className="flex justify-between items-baseline">
        <span className="text-[15px] font-semibold">
          {metric.value} {metric.unit}
        </span>
        <span className="text-[11px] text-gray-500">{metric.normalRange}</span>
      </div>
    </div>
  )
}

export default Profile