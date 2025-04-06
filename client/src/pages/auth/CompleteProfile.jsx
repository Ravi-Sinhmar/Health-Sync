"use client"

import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import Input from "../../components/ui/Input"
import Select from "../../components/ui/Select"
import Button from "../../components/ui/Button"
import { useAuth } from "../../context/AuthContext"

const CompleteProfile = () => {
  const {setIsAuthenticated} = useAuth();
  const location = useLocation()
  const navigate = useNavigate()

  const email = location.state?.email || ""

  if (!email) {
    navigate("/register")
  }

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    dob: "",
    bloodGroup: "",
    gender: "",
    phone: "",
    fatherName: "",
    instituteName: "",
    admissionNumber: "",
    course: "",
    sports: "",
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const bloodGroupOptions = [
    { value: "", label: "Select Blood Group" },
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ]

  const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const newErrors = {}
    const requiredFields = [
      "name",
      "dob",
      "bloodGroup",
      "gender",
      "phone",
      "fatherName",
      "instituteName",
      "admissionNumber",
    ]

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")} is required`
      }
    })

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Calculate age from DOB
      const dob = new Date(formData.dob)
      const today = new Date()
      let age = today.getFullYear() - dob.getFullYear()
      const monthDiff = today.getMonth() - dob.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--
      }

      // API call to save student profile
      const response = await fetch(`http://localhost:5000/students/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          email,
          age,
        }),
        credentials: 'include', // Important for cookies
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to save profile")
      }

      toast.success("Profile completed successfully");
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Failed to save profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Complete Your Profile</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please provide your personal information to complete your registration
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <Input
                label="Full Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Enter your full name"
                required
              />

              <Input
                label="Date of Birth"
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                error={errors.dob}
                required
              />

              <Select
                label="Blood Group"
                id="bloodGroup"
                name="bloodGroup"
                options={bloodGroupOptions}
                value={formData.bloodGroup}
                onChange={handleChange}
                error={errors.bloodGroup}
                required
              />

              <Select
                label="Gender"
                id="gender"
                name="gender"
                options={genderOptions}
                value={formData.gender}
                onChange={handleChange}
                error={errors.gender}
                required
              />

              <Input
                label="Phone Number"
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="Enter your phone number"
                required
              />

              <Input
                label="Father's Name"
                id="fatherName"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                error={errors.fatherName}
                placeholder="Enter your father's name"
                required
              />

              <Input
                label="Institute Name"
                id="instituteName"
                name="instituteName"
                value={formData.instituteName}
                onChange={handleChange}
                error={errors.instituteName}
                placeholder="Enter your institute name"
                required
              />

              <Input
                label="Admission Number"
                id="admissionNumber"
                name="admissionNumber"
                value={formData.admissionNumber}
                onChange={handleChange}
                error={errors.admissionNumber}
                placeholder="Enter your admission number"
                required
              />

              <Input
                label="Course (Academic)"
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                error={errors.course}
                placeholder="E.g., Computer Science, Biology"
              />

              <Input
                label="Sports"
                id="sports"
                name="sports"
                value={formData.sports}
                onChange={handleChange}
                error={errors.sports}
                placeholder="E.g., Football, Basketball"
              />
            </div>

            <div className="mt-8 flex justify-end">
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Complete Registration
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CompleteProfile

