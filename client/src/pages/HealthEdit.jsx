"use client"


import { useState, useEffect } from "react"
import { Save, AlertCircle, ArrowLeft } from "lucide-react"
import apiConfig from '../config/api';
const HealthEdit = () => {
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    bmi: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    heartRate: "",
    temperature: "",
    oxygenSaturation: "",
    vision: "",
    hearing: "",
    allergies: "",
    medications: "",
    chronicConditions: "",
    immunizations: "",
    dietaryRestrictions: "",
    physicalActivity: "",
    sleepHours: "",
    mentalHealthNotes: "",
    emergencyContact: "",
    lastCheckupDate: "",
  })

  // Fetch student health data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // For demo purposes, we'll use URL search params to get the student ID
        const urlParams = new URLSearchParams(window.location.search)
        const studentId = urlParams.get("id")

        if (!studentId) {
          throw new Error("Student ID is required")
        }

        const response = await fetch(`${apiConfig.baseURL}/health/edit?id=${studentId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch student health data")
        }

        const data = await response.json()
        setFormData(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setFetchLoading(false)
      }
    }

    fetchData()
  }, [])

  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      // Height in meters (convert from cm)
      const heightInMeters = Number.parseFloat(formData.height) / 100
      const weightInKg = Number.parseFloat(formData.weight)

      if (heightInMeters > 0 && weightInKg > 0) {
        const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1)
        setFormData({ ...formData, bmi })
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle comma-separated fields
    const commaSeparatedFields = ['allergies', 'medications', 'chronicConditions', 'immunizations'];
    if (commaSeparatedFields.includes(name)) {
      setFormData({ ...formData, [name]: value.split(',').map(item => item.trim()) });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Auto-calculate BMI when height or weight changes
    if (name === "height" || name === "weight") {
      setTimeout(calculateBMI, 500);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${apiConfig.baseURL}/health/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update health information")
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-violet-600 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-3 text-sm text-gray-600">Loading student health data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <a href="/" className="inline-flex items-center text-sm font-medium text-violet-600 hover:text-violet-800">
            <ArrowLeft size={16} className="mr-1" />
            Back to Profile
          </a>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4">
            <h1 className="text-xl font-medium text-white">Edit Health Information</h1>
            <p className="text-violet-100 text-sm mt-1">
              Update the health details of {formData.name || "the student"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            {/* Status messages */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                Health information updated successfully!
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-center">
                <AlertCircle size={16} className="mr-2" />
                {error}
              </div>
            )}

            {/* Student Identification - Priority 1 */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-sm font-medium text-gray-700 mb-3">Student Identification</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="studentId" className="block text-xs font-medium text-gray-700 mb-1">
                    Student ID / Admission Number
                  </label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    className="w-full text-sm rounded-md  shadow-sm focus:border-violet-500 border outline-none border-violet-500 py-1 px-2"
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Basic Information - Priority 2 */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-sm font-medium text-gray-700 mb-3">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="age" className="block text-xs font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                   className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-xs font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="lastCheckupDate" className="block text-xs font-medium text-gray-700 mb-1">
                    Last Checkup Date
                  </label>
                  <input
                    type="date"
                    id="lastCheckupDate"
                    name="lastCheckupDate"
                    value={formData.lastCheckupDate}
                    onChange={handleChange}
                  className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Physical Measurements - Priority 3 */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-sm font-medium text-gray-700 mb-3">Physical Measurements</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="height" className="block text-xs font-medium text-gray-700 mb-1">
                    Height (cm) <span className="text-xs text-gray-500">[Normal: 100-200]</span>
                  </label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                 className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="weight" className="block text-xs font-medium text-gray-700 mb-1">
                    Weight (kg) <span className="text-xs text-gray-500">[Normal: 20-100]</span>
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                 className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="bmi" className="block text-xs font-medium text-gray-700 mb-1">
                    BMI <span className="text-xs text-gray-500">[Normal: 18.5-24.9]</span>
                  </label>
                  <input
                    type="text"
                    id="bmi"
                    name="bmi"
                    value={formData.bmi}
                    readOnly
              className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Vital Signs - Priority 4 */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-sm font-medium text-gray-700 mb-3">Vital Signs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="bloodPressureSystolic" className="block text-xs font-medium text-gray-700 mb-1">
                    Blood Pressure (Systolic) <span className="text-xs text-gray-500">[Normal: 90-120]</span>
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="bloodPressureSystolic"
                      name="bloodPressureSystolic"
                      value={formData.bloodPressureSystolic}
                      onChange={handleChange}
                  className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                    />
                    <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md">
                      mmHg
                    </span>
                  </div>
                </div>
                <div>
                  <label htmlFor="bloodPressureDiastolic" className="block text-xs font-medium text-gray-700 mb-1">
                    Blood Pressure (Diastolic) <span className="text-xs text-gray-500">[Normal: 60-80]</span>
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="bloodPressureDiastolic"
                      name="bloodPressureDiastolic"
                      value={formData.bloodPressureDiastolic}
                      onChange={handleChange}
                 className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                    />
                    <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md">
                      mmHg
                    </span>
                  </div>
                </div>
                <div>
                  <label htmlFor="heartRate" className="block text-xs font-medium text-gray-700 mb-1">
                    Heart Rate <span className="text-xs text-gray-500">[Normal: 60-100]</span>
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="heartRate"
                      name="heartRate"
                      value={formData.heartRate}
                      onChange={handleChange}
                 className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                    />
                    <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md">
                      bpm
                    </span>
                  </div>
                </div>
                <div>
                  <label htmlFor="temperature" className="block text-xs font-medium text-gray-700 mb-1">
                    Temperature <span className="text-xs text-gray-500">[Normal: 36.1-37.2]</span>
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="temperature"
                      name="temperature"
                      step="0.1"
                      value={formData.temperature}
                      onChange={handleChange}
                    className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                    />
                    <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md">
                      °C
                    </span>
                  </div>
                </div>
                <div>
                  <label htmlFor="oxygenSaturation" className="block text-xs font-medium text-gray-700 mb-1">
                    Oxygen Saturation <span className="text-xs text-gray-500">[Normal: 95-100]</span>
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="oxygenSaturation"
                      name="oxygenSaturation"
                      value={formData.oxygenSaturation}
                      onChange={handleChange}
                    className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                    />
                    <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Assessments - Priority 5 */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-sm font-medium text-gray-700 mb-3">Health Assessments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vision" className="block text-xs font-medium text-gray-700 mb-1">
                    Vision Assessment
                  </label>
                  <select
                    id="vision"
                    name="vision"
                    value={formData.vision}
                    onChange={handleChange}
                 className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                  >
                    <option value="">Select</option>
                    <option value="normal">Normal</option>
                    <option value="glasses">Requires Glasses</option>
                    <option value="impaired">Visually Impaired</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="hearing" className="block text-xs font-medium text-gray-700 mb-1">
                    Hearing Assessment
                  </label>
                  <select
                    id="hearing"
                    name="hearing"
                    value={formData.hearing}
                    onChange={handleChange}
                 className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                  >
                    <option value="">Select</option>
                    <option value="normal">Normal</option>
                    <option value="mild">Mild Impairment</option>
                    <option value="moderate">Moderate Impairment</option>
                    <option value="severe">Severe Impairment</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Medical Information - Priority 6 */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-sm font-medium text-gray-700 mb-3">Medical Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="allergies" className="block text-xs font-medium text-gray-700 mb-1">
                    Allergies
                  </label>
                  <input
                    type="text"
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="List any allergies"
                className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="medications" className="block text-xs font-medium text-gray-700 mb-1">
                    Current Medications
                  </label>
                  <input
                    type="text"
                    id="medications"
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                    placeholder="List any medications"
                 className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="chronicConditions" className="block text-xs font-medium text-gray-700 mb-1">
                    Chronic Conditions
                  </label>
                  <input
                    type="text"
                    id="chronicConditions"
                    name="chronicConditions"
                    value={formData.chronicConditions}
                    onChange={handleChange}
                    placeholder="List any chronic conditions"
                  className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="immunizations" className="block text-xs font-medium text-gray-700 mb-1">
                    Immunization Status
                  </label>
                  <input
                    type="text"
                    id="immunizations"
                    name="immunizations"
                    value={formData.immunizations}
                    onChange={handleChange}
                    placeholder="List immunizations"
                 className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Lifestyle Information - Priority 7 */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-sm font-medium text-gray-700 mb-3">Lifestyle Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dietaryRestrictions" className="block text-xs font-medium text-gray-700 mb-1">
                    Dietary Restrictions
                  </label>
                  <input
                    type="text"
                    id="dietaryRestrictions"
                    name="dietaryRestrictions"
                    value={formData.dietaryRestrictions}
                    onChange={handleChange}
                 className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="physicalActivity" className="block text-xs font-medium text-gray-700 mb-1">
                    Physical Activity (hours/week)
                  </label>
                  <input
                    type="number"
                    id="physicalActivity"
                    name="physicalActivity"
                    value={formData.physicalActivity}
                    onChange={handleChange}
                className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="sleepHours" className="block text-xs font-medium text-gray-700 mb-1">
                    Sleep (hours/day) <span className="text-xs text-gray-500">[Normal: 7-9]</span>
                  </label>
                  <input
                    type="number"
                    id="sleepHours"
                    name="sleepHours"
                    value={formData.sleepHours}
                    onChange={handleChange}
                className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="mentalHealthNotes" className="block text-xs font-medium text-gray-700 mb-1">
                    Mental Health Notes
                  </label>
                  <input
                    type="text"
                    id="mentalHealthNotes"
                    name="mentalHealthNotes"
                    value={formData.mentalHealthNotes}
                    onChange={handleChange}
                className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact - Priority 8 */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-sm font-medium text-gray-700 mb-3">Emergency Contact</h2>
              <div>
                <label htmlFor="emergencyContact" className="block text-xs font-medium text-gray-700 mb-1">
                  Emergency Contact Information
                </label>
                <input
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  placeholder="Name, relationship, phone number"
               className="w-full text-sm rounded-sm shadow-sm  border border-violet-500 py-1 px-2 focus:border-violet-500 outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save size={16} className="mr-2" />
                    Update Health Information
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default HealthEdit

