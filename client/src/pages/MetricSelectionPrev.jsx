import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { selectedMetricsState } from '../recoil/atoms';
import { useNavigate } from 'react-router-dom';

import {
    // General Health
    FaRulerVertical, FaWeight, FaRunning,
    // Vital Signs
    FaHeartbeat, FaLungs, FaThermometerHalf,
    // Fitness
    FaTachometerAlt, FaDumbbell, FaArrowUp,
    // Nutrition
    FaUtensils, FaCarrot, FaTint,
    // Sleep
    FaMoon, FaBed,
    // Mental
    FaBrain, FaSmile, FaFrown,
    // Medical
    FaClinicMedical, FaBandAid,
    // UI
    FaChevronDown, FaChevronUp, FaCheck
} from 'react-icons/fa';
import {
    // Specialized icons
    GiBodyHeight, GiMuscleUp, GiSprint,
    GiSandsOfTime, GiStethoscope, GiPill
} from 'react-icons/gi';
import {
    // Additional icons
    IoMdSpeedometer, IoMdTime
} from 'react-icons/io';

const MetricSelectionPage = () => {
    const [selectedMetrics, setSelectedMetrics] = useRecoilState(selectedMetricsState);
    const [expandedMetric, setExpandedMetric] = useState(null);
    const navigate = useNavigate();

    const metricGroups = [
        {
            title: "Core Body Metrics",
            metrics: [
                {
                    id: 'height',
                    name: 'Height',
                    icon: <GiBodyHeight className="w-5 h-5 text-gray-700" />,
                    description: 'Vertical body measurement in cm/inches',
                    importance: 'Critical for growth tracking and BMI calculation'
                },
                {
                    id: 'weight',
                    name: 'Weight',
                    icon: <FaWeight className="w-5 h-5 text-gray-700" />,
                    description: 'Body mass in kg/lbs',
                    importance: 'Key indicator of overall health and nutrition status'
                },
                {
                    id: 'bmi',
                    name: 'BMI',
                    icon: <FaRunning className="w-5 h-5 text-gray-700" />,
                    description: 'Body Mass Index (weight/height²)',
                    importance: 'Screening tool for weight categories'
                },
                {
                    id: 'bodyFat',
                    name: 'Body Fat %',
                    icon: <GiMuscleUp className="w-5 h-5 text-gray-700" />,
                    description: 'Percentage of body weight that is fat',
                    importance: 'Helps assess fitness level and health risks'
                },
                {
                    id: 'boneDensity',
                    name: 'Bone Density',
                    icon: <GiBodyHeight className="w-5 h-5 text-gray-700" />,
                    description: 'Mineral content in bones',
                    importance: 'Indicates osteoporosis risk and skeletal health'
                }
            ]
        },
        {
            title: "Vital Signs",
            metrics: [
                {
                    id: 'bloodPressure',
                    name: 'Blood Pressure',
                    icon: <FaHeartbeat className="w-5 h-5 text-gray-700" />,
                    description: 'Systolic/Diastolic pressure in mmHg',
                    importance: 'Hypertension (>140/90) increases cardiovascular risk'
                },
                {
                    id: 'heartRate',
                    name: 'Heart Rate',
                    icon: <FaHeartbeat className="w-5 h-5 text-gray-700" />,
                    description: 'Beats per minute at rest and during activity',
                    importance: 'Indicates cardiovascular fitness and stress levels'
                },
                {
                    id: 'spo2',
                    name: 'Oxygen Saturation',
                    icon: <FaLungs className="w-5 h-5 text-gray-700" />,
                    description: 'Blood oxygen level percentage',
                    importance: 'Low levels may indicate respiratory issues'
                },
                {
                    id: 'temperature',
                    name: 'Body Temperature',
                    icon: <FaThermometerHalf className="w-5 h-5 text-gray-700" />,
                    description: 'Core body temperature in °C/°F',
                    importance: 'Fever indicates infection; hypothermia is dangerous'
                }
            ]
        },
        {
            title: "Athlete Performance",
            metrics: [
                {
                    id: 'vo2max',
                    name: 'VO2 Max',
                    icon: <IoMdSpeedometer className="w-5 h-5 text-gray-700" />,
                    description: 'Maximum oxygen uptake during exercise',
                    importance: 'Gold standard measure of aerobic fitness'
                },
                {
                    id: 'gripStrength',
                    name: 'Grip Strength',
                    icon: <FaDumbbell className="w-5 h-5 text-gray-700" />,
                    description: 'Force exerted by hand muscles',
                    importance: 'Indicator of overall muscle strength'
                },
                {
                    id: 'verticalJump',
                    name: 'Vertical Jump',
                    icon: <FaArrowUp className="w-5 h-5 text-gray-700" />,
                    description: 'Maximum jump height from standing',
                    importance: 'Measures explosive leg power'
                },
                {
                    id: 'sprintSpeed',
                    name: 'Sprint Speed',
                    icon: <GiSprint className="w-5 h-5 text-gray-700" />,
                    description: 'Time to complete short distances (10m/40m)',
                    importance: 'Key metric for many sports'
                }
            ]
        },
        {
            title: "Health & Wellness",
            metrics: [
                {
                    id: 'sleepQuality',
                    name: 'Sleep Quality',
                    icon: <FaMoon className="w-5 h-5 text-gray-700" />,
                    description: 'Deep vs light sleep and REM cycles',
                    importance: 'Poor sleep affects recovery and cognitive function'
                },
                {
                    id: 'stressLevel',
                    name: 'Stress Level',
                    icon: <FaBrain className="w-5 h-5 text-gray-700" />,
                    description: 'Psychological and physiological stress indicators',
                    importance: 'Chronic stress impacts performance and health'
                },
                {
                    id: 'injuryHistory',
                    name: 'Injury History',
                    icon: <FaBandAid className="w-5 h-5 text-gray-700" />,
                    description: 'Record of previous injuries',
                    importance: 'Helps prevent re-injury and guide rehab'
                }
            ]
        }
    ];

    const toggleMetric = (metricId) => {
        setSelectedMetrics(prev =>
            prev.includes(metricId)
                ? prev.filter(id => id !== metricId)
                : [...prev, metricId]
        );
    };

    const toggleExpand = (metricId) => {
        setExpandedMetric(expandedMetric === metricId ? null : metricId);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Comprehensive Health Metrics</h1>
            <p className="text-gray-600 mb-6">Select all metrics relevant to your health monitoring needs</p>
            
            {metricGroups.map((group, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
                  {group.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-[minmax(60px,auto)]">
                  {group.metrics.map(metric => (
                    <div 
                      key={metric.id}
                      className={`border rounded-lg overflow-hidden transition-all duration-150 ${
                        selectedMetrics.includes(metric.id) 
                          ? 'bg-violet-50 border-violet-200' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      {/* Fixed-height header */}
                      <div className="flex items-center justify-between p-4 h-[60px]">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleMetric(metric.id)}
                            className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                              selectedMetrics.includes(metric.id) 
                                ? 'bg-violet-600 border-violet-600' 
                                : 'border-gray-300'
                            }`}
                          >
                            {selectedMetrics.includes(metric.id) && (
                              <FaCheck className="w-2.5 h-2.5 text-white" />
                            )}
                          </button>
                          <div className="flex-shrink-0">
                            {metric.icon}
                          </div>
                          <span className="font-medium text-gray-800">{metric.name}</span>
                        </div>
                        <button 
                          onClick={() => toggleExpand(metric.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {expandedMetric === metric.id ? (
                            <FaChevronUp className="w-4 h-4" />
                          ) : (
                            <FaChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      
                      {/* Isolated expandable content */}
                      <div 
                        className={`transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${
                          expandedMetric === metric.id 
                            ? 'max-h-[200px] opacity-100' 
                            : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="px-4 pb-4 pt-0 text-gray-600 space-y-2 text-sm">
                          <p><span className="font-semibold">Definition:</span> {metric.description}</p>
                          <p><span className="font-semibold">Clinical Importance:</span> {metric.importance}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => navigate('/register')}
                disabled={selectedMetrics.length === 0}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  selectedMetrics.length === 0 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-violet-600 hover:bg-violet-700 text-white'
                }`}
              >
                Continue ({selectedMetrics.length} selected)
              </button>
            </div>
          </div>
        </div>
      );
};

export default MetricSelectionPage;