import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import apiConfig from '../config/api';

const HealthForm = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    // Non-editable student info (will be fetched)
    admissionNumber: '',
    name: '',
    age: '',
    gender: '',
    
    // Editable health fields
    height: '',
    weight: '',
    bmi: '',
    bloodPressure: {
      systolic: {
        value: '',
        status: 'normal'
      },
      diastolic: {
        value: '',
        status: 'normal'
      }
    },
    heartRate: {
      value: '',
      status: 'normal'
    },
    temperature: {
      value: '',
      status: 'normal'
    },
    oxygenSaturation: {
      value: '',
      status: 'normal'
    },
    vision: '',
    hearing: '',
    allergies: [],
    medications: [],
    chronicConditions: [],
    immunizations: [],
    dietaryRestrictions: [],
    physicalActivity: '',
    sleepHours: '',
    mentalHealthNotes: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    lastCheckupDate: '',
  });

  // Fetch student profile data on component mount
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await fetch(`${apiConfig.baseURL}/students/profile`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch student profile');
        }
        
        const data = await response.json();
        
        // Set non-editable student info
        setFormData(prev => ({
          ...prev,
          admissionNumber: data.admissionNumber || '',
          name: data.name || '',
          age: data.age || '',
          gender: data.gender || '',
          
          // Set existing health data if available
          height: data.height || '',
          weight: data.weight || '',
          bmi: data.bmi || '',
          bloodPressure: data.bloodPressure || {
            systolic: { value: '', status: 'normal' },
            diastolic: { value: '', status: 'normal' }
          },
          heartRate: data.heartRate || { value: '', status: 'normal' },
          temperature: data.temperature || { value: '', status: 'normal' },
          oxygenSaturation: data.oxygenSaturation || { value: '', status: 'normal' },
          vision: data.vision || '',
          hearing: data.hearing || '',
          allergies: data.allergies || [],
          medications: data.medications || [],
          chronicConditions: data.chronicConditions || [],
          immunizations: data.immunizations || [],
          dietaryRestrictions: data.dietaryRestrictions || [],
          physicalActivity: data.physicalActivity || '',
          sleepHours: data.sleepHours || '',
          mentalHealthNotes: data.mentalHealthNotes || '',
          emergencyContact: data.emergencyContact || {
            name: '',
            relationship: '',
            phone: ''
          },
          lastCheckupDate: data.lastCheckupDate || ''
        }));
        
      } catch (err) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    };
    
    fetchStudentProfile();
  }, []);

  const calculateBMI = (newData) => {
    const { height, weight } = { ...formData, ...newData }; // Merge new data with existing formData
  
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
  
      if (heightInMeters > 0 && weightInKg > 0) {
        return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
      }
    }
    return null; // Return null if either field is missing or invalid
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parent, child, subChild] = name.split('.');
      
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: subChild 
            ? { 
                ...prev[parent][child],
                [subChild]: value 
              }
            : value
        }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Auto-calculate BMI when height or weight changes
    if (name === 'height' || name === 'weight') {
      setTimeout(calculateBMI, 500);
    }
  };

  // const handleArrayFieldChange = (fieldName, value) => {
  //   setFormData({ ...formData, [fieldName]: value });
  //   const values = value
  //     .split(',')
  //     .map(item => item.trim())
  //     .filter(item => item !== ''); // Ensure no empty strings are added
  //   setFormData(prev => ({ ...prev, [fieldName]: values }));
  // };.

  const handleArrayFieldChange = (fieldName, value) => {
    // Store the raw string (don't split into array yet)
    setFormData({ ...formData, [fieldName]: value });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);
    
  //   try {
  //     // Prepare the data to match your schema
  //     const submissionData = {
  //       ...formData,
  //       // Convert string arrays to arrays if needed
  //       allergies: Array.isArray(formData.allergies) ? formData.allergies : formData.allergies.split(',').map(item => item.trim()),
  //       medications: Array.isArray(formData.medications) ? formData.medications : formData.medications.split(',').map(item => item.trim()),
  //       chronicConditions: Array.isArray(formData.chronicConditions) ? formData.chronicConditions : formData.chronicConditions.split(',').map(item => item.trim()),
  //       immunizations: Array.isArray(formData.immunizations) ? formData.immunizations : formData.immunizations.split(',').map(item => item.trim()),
  //       dietaryRestrictions: Array.isArray(formData.dietaryRestrictions) ? formData.dietaryRestrictions : formData.dietaryRestrictions.split(',').map(item => item.trim())
  //     };
      
  //     const response = await fetch(`${apiConfig.baseURL}/students/healthdata/save`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       credentials: 'include',
  //       body: JSON.stringify(submissionData),
  //     });
      
  //     if (!response.ok) {
  //       throw new Error('Failed to save health information');
  //     }
      
  //     setSuccess(true);
  //     setTimeout(() => setSuccess(false), 3000);
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Convert comma-separated strings to arrays before submitting
      const submissionData = {
        ...formData,
        allergies: convertToArray(formData.allergies),
        medications: convertToArray(formData.medications),
        chronicConditions: convertToArray(formData.chronicConditions),
        immunizations: convertToArray(formData.immunizations),
        dietaryRestrictions: convertToArray(formData.dietaryRestrictions),
      };
  
      const response = await fetch(`${apiConfig.baseURL}/students/healthdata/save`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(submissionData),
      });
  
      if (!response.ok) throw new Error("Failed to save health information");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to safely convert strings to arrays
  const convertToArray = (value) => {
    if (Array.isArray(value)) return value; // Already an array (from initial fetch)
    if (typeof value === "string") {
      return value.split(",").map(item => item.trim()).filter(item => item);
    }
    return []; // Fallback for unexpected types
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4">
            <h1 className="text-xl font-medium text-white">Student Health Information</h1>
            <p className="text-violet-100 text-sm mt-1">
              {formData.admissionNumber ? `Admission #: ${formData.admissionNumber}` : 'Please fill in the health details'}
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            {/* Status messages */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                Health information saved successfully!
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-center">
                <AlertCircle size={16} className="mr-2" />
                {error}
              </div>
            )}
            
            {/* Student Information (Non-editable) */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-sm font-medium text-gray-700 mb-3">Student Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Admission Number
                  </label>
                  <div className="w-full text-sm rounded-md bg-gray-100 py-2 px-3">
                    {formData.admissionNumber || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="w-full text-sm rounded-md bg-gray-100 py-2 px-3">
                    {formData.name || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <div className="w-full text-sm rounded-md bg-gray-100 py-2 px-3">
                    {formData.age || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <div className="w-full text-sm rounded-md bg-gray-100 py-2 px-3">
                    {formData.gender || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Physical Measurements */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-sm font-medium text-gray-700 mb-3">Physical Measurements</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="height" className="block text-xs font-medium text-gray-700 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full text-sm rounded-md shadow-sm focus:border-violet-500 border border-gray-300 py-2 px-3"
                  />
                </div>
                <div>
                  <label htmlFor="weight" className="block text-xs font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full text-sm rounded-md shadow-sm focus:border-violet-500 border border-gray-300 py-2 px-3"
                  />
                </div>
                <div>
                  <label htmlFor="bmi" className="block text-xs font-medium text-gray-700 mb-1">
                    BMI
                  </label>
                  <input
                    type="text"
                    id="bmi"
                    name="bmi"
                    value={formData.bmi}
                    readOnly
                    className="w-full text-sm rounded-md bg-gray-100 py-2 px-3"
                  />
                </div>
              </div>
            </div>
            
            {/* Vital Signs */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-sm font-medium text-gray-700 mb-3">Vital Signs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="bloodPressure.systolic.value" className="block text-xs font-medium text-gray-700 mb-1">
                    Blood Pressure (Systolic)
                  </label>
                  <input
                    type="number"
                    id="bloodPressure.systolic.value"
                    name="bloodPressure.systolic.value"
                    value={formData.bloodPressure.systolic.value}
                    onChange={handleChange}
                    className="w-full text-sm rounded-md shadow-sm focus:border-violet-500 border border-gray-300 py-2 px-3"
                  />
                </div>
                <div>
                  <label htmlFor="bloodPressure.diastolic.value" className="block text-xs font-medium text-gray-700 mb-1">
                    Blood Pressure (Diastolic)
                  </label>
                  <input
                    type="number"
                    id="bloodPressure.diastolic.value"
                    name="bloodPressure.diastolic.value"
                    value={formData.bloodPressure.diastolic.value}
                    onChange={handleChange}
                    className="w-full text-sm rounded-md shadow-sm focus:border-violet-500 border border-gray-300 py-2 px-3"
                  />
                </div>
                <div>
                  <label htmlFor="heartRate.value" className="block text-xs font-medium text-gray-700 mb-1">
                    Heart Rate
                  </label>
                  <input
                    type="number"
                    id="heartRate.value"
                    name="heartRate.value"
                    value={formData.heartRate.value}
                    onChange={handleChange}
                    className="w-full text-sm rounded-md shadow-sm focus:border-violet-500 border border-gray-300 py-2 px-3"
                  />
                </div>
                <div>
                  <label htmlFor="temperature.value" className="block text-xs font-medium text-gray-700 mb-1">
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    id="temperature.value"
                    name="temperature.value"
                    value={formData.temperature.value}
                    onChange={handleChange}
                    className="w-full text-sm rounded-md shadow-sm focus:border-violet-500 border border-gray-300 py-2 px-3"
                  />
                </div>
                <div>
                  <label htmlFor="oxygenSaturation.value" className="block text-xs font-medium text-gray-700 mb-1">
                    Oxygen Saturation (%)
                  </label>
                  <input
                    type="number"
                    id="oxygenSaturation.value"
                    name="oxygenSaturation.value"
                    value={formData.oxygenSaturation.value}
                    onChange={handleChange}
                    className="w-full text-sm rounded-md shadow-sm focus:border-violet-500 border border-gray-300 py-2 px-3"
                  />
                </div>
              </div>
            </div>
            
            {/* Health Assessments */}
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
                    className="w-full text-sm rounded-md shadow-sm focus:border-violet-500 border border-gray-300 py-2 px-3"
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
                    className="w-full text-sm rounded-md shadow-sm focus:border-violet-500 border border-gray-300 py-2 px-3"
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
            
            {/* Medical Information */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-sm font-medium text-gray-700 mb-3">Medical Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="allergies" className="block text-xs font-medium text-gray-700 mb-1">
                    Allergies (comma separated)
                  </label>
                  <input
                    type="text"
                    id="allergies"
                    name="allergies"
                    value={Array.isArray(formData.allergies) ? formData.allergies.join(', ') : formData.allergies}
                    onChange={(e) => handleArrayFieldChange('allergies', e.target.value)}
                    className="w-full text-sm rounded-md shadow-sm focus:border-violet-500 border border-gray-300 py-2 px-3"
                  />
                </div>
                <div>
                  <label htmlFor="medications" className="block text-xs font-medium text-gray-700 mb-1">
                    Current Medications (comma separated)
                  </label>
                  <input
                    type="text"
                    id="medications"
                    name="medications"
                    value={Array.isArray(formData.medications) ? formData.medications.join(', ') : formData.medications}
                    onChange={(e) => handleArrayFieldChange('medications', e.target.value)}
                    className="w-full text-sm rounded-md shadow-sm focus:border-violet-500 border border-gray-300 py-2 px-3"
                  />
                </div>
                <div>
                  <label htmlFor="chronicConditions" className="block text-xs font-medium text-gray-700 mb-1">
                    Chronic Conditions (comma separated)
                  </label>
                  <input
                    type="text"
                    id="chronicConditions"
                    name="chronicConditions"
                    value={Array.isArray(formData.chronicConditions) ? formData.chronicConditions.join(', ') : formData.chronicConditions}
                    onChange={(e) => handleArrayFieldChange('chronicConditions', e.target.value)}
                    className="w-full text-sm rounded-md shadow-sm focus:border-violet-500 border border-gray-300 py-2 px-3"
                  />
                </div>
                <div>
                  <label htmlFor="immunizations" className="block text-xs font-medium text-gray-700 mb-1">
                    Immunizations (comma separated)
                  </label>
                  <input
                    type="text"
                    id="immunizations"
                    name="immunizations"
                    value={Array.isArray(formData.immunizations) ? formData.immunizations.join(', ') : formData.immunizations}
                    onChange={(e) => handleArrayFieldChange('immunizations', e.target.value)}
                    className="w-full text-sm rounded-md shadow-sm focus:border-violet-500 border border-gray-300 py-2 px-3"
                  />
                </div>
              </div>
            </div>
            
            {/* Lifestyle Information */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-sm font-medium text-gray-700 mb-3">Lifestyle Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dietaryRestrictions" className="block text-xs font-medium text-gray-700 mb-1">
                    Dietary Restrictions (comma separated)
                  </label>
                  <input
                    type="text"
                    id="dietaryRestrictions"
                    name="dietaryRestrictions"
                    value={Array.isArray(formData.dietaryRestrictions) ? formData.dietaryRestrictions.join(', ') : formData.dietaryRestrictions}
                    onChange={(e) => handleArrayFieldChange('dietaryRestrictions', e.target.value)}
                    className="w-full text-sm rounded-md shadow-sm focus:border-violet-500 border border-gray-300 py-2 px-3"
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
                    className="w-full text-sm rounded-md shadow-sm focus:border-violet-500 border border-gray-300 py-2 px-3"
                  />
                </div>
                <div>
                  <label htmlFor="sleepHours" className="block text-xs font-medium text-gray-700 mb-1">
                    Sleep (hours/day)
                  </label>
                  <input
                    type="number"
                    id="sleepHours"
                    name="sleepHours"
                    value={formData.sleepHours}
                    onChange={handleChange}
                    className="w-full text-sm rounded-md shadow-sm focus:border-violet-500 border border-gray-300 py-2 px-3"
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
                    className="w-full text-sm rounded-md shadow-sm focus:border-violet-500 border border-gray-300 py-2 px-3"
                  />
                </div>
              </div>
            </div>
            
            {/* Emergency Contact */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-sm font-medium text-gray-700 mb-3">Emergency Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="emergencyContact.name" className="block text-xs font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="emergencyContact.name"
                    name="emergencyContact.name"
                    value={formData.emergencyContact.name}
                    onChange={handleChange}
                    className="w-full text-sm rounded-md shadow-sm focus:border-violet-500 border border-gray-300 py-2 px-3"
                  />
                </div>
                <div>
                  <label htmlFor="emergencyContact.relationship" className="block text-xs font-medium text-gray-700 mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    id="emergencyContact.relationship"
                    name="emergencyContact.relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={handleChange}
                    className="w-full text-sm rounded-md shadow-sm focus:border-violet-500 border border-gray-300 py-2 px-3"
                  />
                </div>
                <div>
                  <label htmlFor="emergencyContact.phone" className="block text-xs font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="emergencyContact.phone"
                    name="emergencyContact.phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleChange}
                    className="w-full text-sm rounded-md shadow-sm focus:border-violet-500 border border-gray-300 py-2 px-3"
                  />
                </div>
              </div>
            </div>
            
            {/* Last Checkup Date */}
            <div className="bg-gray-50 p-4 rounded-md">
              <label htmlFor="lastCheckupDate" className="block text-xs font-medium text-gray-700 mb-1">
                Last Checkup Date
              </label>
              <input
                type="date"
                id="lastCheckupDate"
                name="lastCheckupDate"
                value={formData.lastCheckupDate}
                onChange={handleChange}
                className="w-full text-sm rounded-md shadow-sm focus:border-violet-500 border border-gray-300 py-2 px-3"
              />
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
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save size={16} className="mr-2" />
                    Save Health Information
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HealthForm;