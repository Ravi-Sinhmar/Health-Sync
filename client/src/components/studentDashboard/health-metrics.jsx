import React, { useEffect, useState } from "react";
import { Activity, Heart, Droplet, LineChart } from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Sample data generation functions remain the same
const generateBloodPressureData = () => {
  const systolic = Array.from({ length: 7 }, (_, i) => ({
    day: (i + 1) * 5,
    value: Math.floor(Math.random() * 10) + 110,
  }));

  const diastolic = Array.from({ length: 7 }, (_, i) => ({
    day: (i + 1) * 5,
    value: Math.floor(Math.random() * 10) + 65,
  }));

  return { systolic, diastolic };
};

const generateHeartRateData = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    day: (i + 1) * 5,
    value: Math.floor(Math.random() * 30) + 100,
  }));
};

const generateBloodCountData = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    day: (i + 1) * 5,
    value: Math.floor(Math.random() * 10) + 80,
  }));
};

const generateGlucoseData = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    day: (i + 1) * 5,
    value: Math.floor(Math.random() * 20) + 220,
  }));
};

export default function HealthMetrics() {
  const [loading, setLoading] = useState(true);
  const [bloodPressureData, setBloodPressureData] = useState({ systolic: [], diastolic: [] });
  const [heartRateData, setHeartRateData] = useState([]);
  const [bloodCountData, setBloodCountData] = useState([]);
  const [glucoseData, setGlucoseData] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBloodPressureData(generateBloodPressureData());
      setHeartRateData(generateHeartRateData());
      setBloodCountData(generateBloodCountData());
      setGlucoseData(generateGlucoseData());
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Your Health Metrics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Blood Pressure Card */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center mb-4">
            <Activity className="h-5 w-5 text-blue-500 mr-2" />
            <span className="font-medium">Blood Pressure</span>
          </div>
          <div className="text-2xl font-bold">116/70</div>
          <div className="h-[200px] mt-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse w-full h-4 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSystolic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    type="number"
                    domain={[0, 30]}
                    ticks={[1, 5, 10, 15, 20, 25, 30]}
                    tickLine={false}
                  />
                  <YAxis hide domain={[60, 130]} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="value"
                    data={bloodPressureData.systolic}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorSystolic)"
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    data={bloodPressureData.diastolic}
                    stroke="#3b82f6"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    fill="none"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Heart Rate Card */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center mb-4">
            <Heart className="h-5 w-5 text-blue-500 mr-2" />
            <span className="font-medium">Heart Rate</span>
          </div>
          <div className="text-2xl font-bold">120 bpm</div>
          <div className="h-[200px] mt-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse w-full h-4 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart 
                  data={heartRateData} 
                  margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="day"
                    type="number"
                    domain={[0, 30]}
                    ticks={[1, 5, 10, 15, 20, 25, 30]}
                    tickLine={false}
                  />
                  <YAxis hide domain={[90, 140]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#3b82f6" }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Blood Count Card */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center mb-4">
            <Droplet className="h-5 w-5 text-blue-500 mr-2" />
            <span className="font-medium">Blood Count</span>
          </div>
          <div className="text-2xl font-bold">80-90</div>
          <div className="h-[200px] mt-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse w-full h-4 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart 
                  data={bloodCountData} 
                  margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="day"
                    type="number"
                    domain={[0, 30]}
                    ticks={[1, 5, 10, 15, 20, 25, 30]}
                    tickLine={false}
                  />
                  <YAxis hide domain={[75, 95]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#3b82f6" }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Glucose Level Card */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center mb-4">
            <LineChart className="h-5 w-5 text-blue-500 mr-2" />
            <span className="font-medium">Glucose Level</span>
          </div>
          <div className="text-2xl font-bold">230/ml</div>
          <div className="h-[200px] mt-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse w-full h-4 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart 
                  data={glucoseData} 
                  margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="day"
                    type="number"
                    domain={[0, 30]}
                    ticks={[1, 5, 10, 15, 20, 25, 30]}
                    tickLine={false}
                  />
                  <YAxis hide domain={[210, 250]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#3b82f6" }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}