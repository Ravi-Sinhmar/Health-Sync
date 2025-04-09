import React from 'react';

export default function VitalSigns() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Vital Signs</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Blood Pressure */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <span className="font-medium">Blood Pressure</span>
            </div>
            <span className="px-3 py-1 text-white text-xs font-medium bg-red-500 rounded-full">High</span>
          </div>
          
          <div className="text-4xl font-bold text-red-500">500/400</div>
          <div className="text-sm text-gray-500">mmHg</div>
          <div className="text-xs text-gray-500 mt-1">Normal range: 90-120/60-80 mmHg</div>
        </div>
        
        {/* Heart Rate */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="font-medium">Heart Rate</span>
            </div>
            <span className="px-3 py-1 text-white text-xs font-medium bg-green-500 rounded-full">Normal</span>
          </div>
          
          <div className="text-4xl font-bold text-green-500">90</div>
          <div className="text-sm text-gray-500">bpm</div>
          <div className="text-xs text-gray-500 mt-1">Normal range: 60-100 bpm</div>
        </div>
        
        {/* Oxygen Saturation */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <span className="font-medium">Oxygen Saturation</span>
            </div>
            <span className="px-3 py-1 text-white text-xs font-medium bg-yellow-500 rounded-full">Low</span>
          </div>
          
          <div className="text-4xl font-bold text-yellow-500">44</div>
          <div className="text-sm text-gray-500">%</div>
          <div className="text-xs text-gray-500 mt-1">Normal range: 95-100%</div>
        </div>
        
        {/* Body Temperature */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
              </svg>
              <span className="font-medium">Body Temperature</span>
            </div>
            <span className="px-3 py-1 text-white text-xs font-medium bg-red-500 rounded-full">High</span>
          </div>
          
          <div className="text-4xl font-bold text-red-500">40</div>
          <div className="text-sm text-gray-500">°C</div>
          <div className="text-xs text-gray-500 mt-1">Normal range: 36.1-37.2°C</div>
        </div>
      </div>
    </div>
  );
}