import React, { useState } from 'react';

const UserProfileForm = () => {
  const [formData, setFormData] = useState({
    sex: '',
    heightFeet: '',
    heightInches: '',
    weight: '',
    age: '',
    bodyfat: '',
    activity_level: '1.2',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <div className=" flex items-center justify-center m-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl  overflow-hidden">
        <div className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
            <p className="text-gray-600 mt-2">Enter your details to calculate personalized nutrition needs</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Sex Selection */}
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-gray-700">Sex</label>
              <div className="grid grid-cols-3 gap-2">
                {['Male', 'Female', 'Non-Binary'].map((option) => (
                  <label 
                    key={option}
                    className={`flex items-center justify-center p-2 border rounded-md cursor-pointer transition-colors ${
                      formData.sex === option.toLowerCase() 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sex"
                      value={option.toLowerCase()}
                      checked={formData.sex === option.toLowerCase()}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <span className="ml-2 text-[13px]">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Height */}
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-gray-700">Height</label>
              <div className="flex items-center space-x-3">
                <div className="flex-1 flex items-center space-x-2">
                  <input
                    type="number"
                    name="heightFeet"
                    min="0"
                    max="10"
                    step="1"
                    value={formData.heightFeet}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-[13px] focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Feet"
                    required
                  />
                  <span className="text-gray-500 text-[13px]">ft</span>
                </div>
                <div className="flex-1 flex items-center space-x-2">
                  <input
                    type="number"
                    name="heightInches"
                    min="0"
                    max="11"
                    step="1"
                    value={formData.heightInches}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-[13px] focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Inches"
                  />
                  <span className="text-gray-500 text-[13px]">in</span>
                </div>
              </div>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-gray-700">Weight</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  name="weight"
                  min="0"
                  step="0.1"
                  max="999"
                  value={formData.weight}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-[13px] focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.0"
                  required
                />
                <span className="text-gray-500 text-[13px]">lbs</span>
              </div>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-gray-700">Age</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  name="age"
                  min="16"
                  step="1"
                  value={formData.age}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-[13px] focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Years"
                  required
                />
                <span className="text-gray-500 text-[13px]">years</span>
              </div>
            </div>

            {/* Bodyfat */}
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-gray-700">Bodyfat</label>
              <div className="grid grid-cols-3 gap-2">
                {['Low', 'Medium', 'High'].map((option) => (
                  <label 
                    key={option}
                    className={`flex items-center justify-center p-2 border rounded-md cursor-pointer transition-colors ${
                      formData.bodyfat === option.toLowerCase() 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="bodyfat"
                      value={option.toLowerCase()}
                      checked={formData.bodyfat === option.toLowerCase()}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <span className="ml-2 text-[13px]">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Activity Level */}
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-gray-700">Activity Level</label>
              <select
                name="activity_level"
                value={formData.activity_level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-[13px] focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="1.2">Sedentary (little or no exercise)</option>
                <option value="1.375">Lightly active (light exercise 1-3 days/week)</option>
                <option value="1.55">Active (moderate exercise 3-5 days/week)</option>
                <option value="1.725">Very active (hard exercise 6-7 days/week)</option>
                <option value="1.9">Extremely active (very hard exercise & physical job)</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-1/2 mx-auto block bg-blue-600 text-white py-2.5 px-4 rounded-md shadow-[13px] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Calculate Nutrition
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;