"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import apiConfig from '../config/api';
import {
  FaUser,
  FaArrowLeft,
  FaSave,
  FaCalendarAlt,
  FaVenusMars,
  FaTint,
  FaPhone,
  FaSchool,
  FaGraduationCap,
  FaHome,
} from "react-icons/fa"
import toast from "react-hot-toast"

const EditProfile = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    fatherName: "",
    instituteName: "",
    admissionNumber: "",
    course: "",
    sports: "",
    address: "",
    allergies: "",
    medications: "",
    emergencyContact: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${apiConfig.baseURL}/students/profile`, {
            method: "GET",
            credentials: 'include',
            headers: {
              "Content-Type": "application/json",
            },
          })

        if (!response.ok) {
          throw new Error("Failed to fetch profile data")
        }

        const profileData = await response.json()
        setFormData(profileData)
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Failed to load profile data")

        // Mock data fallback
        setFormData({
          name: "John Doe",
          email: currentUser.email,
          dob: "2006-05-15",
          gender: "Male",
          bloodGroup: "O+",
          phone: "1234567890",
          fatherName: "Robert Doe",
          instituteName: "Springfield High School",
          admissionNumber: "SHS2023001",
          course: "Science",
          sports: "Football, Swimming",
          address: "123 Main St, Springfield",
          allergies: "None",
          medications: "None",
          emergencyContact: "Jane Doe (Mother) - 9876543210",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [currentUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const response = await fetch(`${apiConfig.baseURL}/students/profile/edit`, {
        method: "PUT",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      toast.success("Profile updated successfully")
      navigate("/profile")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <a href="/profile" className="inline-flex items-center text-[13px] font-medium text-violet-600 hover:text-violet-800">
            <FaArrowLeft size={16} className="mr-1" />
            Back to Profile
          </a>
        </div>
        <form onSubmit={handleSubmit}>
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4 rounded-t-md">
            <h1 className="text-xl font-medium text-white">Edit Profile Information</h1>
            <p className="text-violet-100 text-[13px] mt-1">
              Update the profile details of {formData.name || "the student"}
            </p>
          </div>
          <Card>
            <div className="flex flex-col items-center p-4 border-b">
              <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center mb-2">
                <FaUser className="text-violet-600 text-lg" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-center text-base font-medium text-gray-800 border-b border-transparent hover:border-gray-300 focus:border-violet-600 focus:outline-none py-1 px-2"
                required
              />
              <p className="text-[13px] text-gray-500 mb-2">{formData.email}</p>
            </div>

            <div className="p-4 border-b">
              <h3 className="text-[13px] font-medium text-gray-700 mb-3">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
                <div className="space-y-1">
                  <label className="flex items-center text-[13px] text-gray-500">
                    <FaCalendarAlt className="text-gray-400 mr-2 text-[13px]" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md text-[13px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="flex items-center text-[13px] text-gray-500">
                    <FaVenusMars className="text-gray-400 mr-2 text-[13px]" />
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md text-[13px]"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center text-[13px] text-gray-500">
                    <FaTint className="text-gray-400 mr-2 text-[13px]" />
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md text-[13px]"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center text-[13px] text-gray-500">
                    <FaPhone className="text-gray-400 mr-2 text-[13px]" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md text-[13px]"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-b">
              <h3 className="text-[13px] font-medium text-gray-700 mb-3">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
                <div className="space-y-1">
                  <label className="flex items-center text-[13px] text-gray-500">
                    <FaSchool className="text-gray-400 mr-2 text-[13px]" />
                    Institute
                  </label>
                  <input
                    type="text"
                    name="instituteName"
                    value={formData.instituteName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md text-[13px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="flex items-center text-[13px] text-gray-500">
                    <FaGraduationCap className="text-gray-400 mr-2 text-[13px]" />
                    Admission Number
                  </label>
                  <input
                    type="text"
                    name="admissionNumber"
                    value={formData.admissionNumber}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md text-[13px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="flex items-center text-[13px] text-gray-500">
                    <FaGraduationCap className="text-gray-400 mr-2 text-[13px]" />
                    Course
                  </label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md text-[13px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="flex items-center text-[13px] text-gray-500">
                    <FaGraduationCap className="text-gray-400 mr-2 text-[13px]" />
                    Sports/Activities
                  </label>
                  <input
                    type="text"
                    name="sports"
                    value={formData.sports}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md text-[13px]"
                  />
                </div>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-[13px] font-medium text-gray-700 mb-3">Family Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
                <div className="space-y-1">
                  <label className="flex items-center text-[13px] text-gray-500">
                    <FaUser className="text-gray-400 mr-2 text-[13px]" />
                    Father's Name
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md text-[13px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="flex items-center text-[13px] text-gray-500">
                    <FaHome className="text-gray-400 mr-2 text-[13px]" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md text-[13px]"
                  />
                </div>

              </div>
            </div>

            <div className="p-4 border-t flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="flex items-center bg-violet-600 hover:bg-violet-600 text-white"
              >
                {saving ? (
                  "Saving..."
                ) : (
                  <>
                    <FaSave className="mr-1.5" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  )
}

export default EditProfile

