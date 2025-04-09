import React, { useState } from "react";

const checkupDates = [
  { id: 1, date: "18 March 2025" },
  { id: 2, date: "26 Feb 2025" },
  { id: 3, date: "8 Feb 2025" },
  { id: 4, date: "24 Jan 2025" },
];

export default function CheckupHistory() {
  const [hoveredId, setHoveredId] = useState(null);

  const handleCheckupClick = () => {
    window.location.href = `/profile/health`; // Redirect to /profile/health
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Check Out Details Of Your Latest Checkup</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {checkupDates.map((checkup) => (
          <div key={checkup.id} className="flex flex-col items-center">
            <button
              className="w-24 h-24 p-0 mb-2 rounded-full overflow-hidden border border-purple-200 hover:border-purple-500 transition-all duration-300 focus:outline-none"
              onMouseEnter={() => setHoveredId(checkup.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={handleCheckupClick} // Use updated function
            >
              <div
                className={`flex items-center justify-center w-full h-full bg-purple-100 transition-all duration-300 ${
                  hoveredId === checkup.id ? "scale-110" : "scale-100"
                }`}
              >
                <img
                  src="/images/checkup-icon.png"
                  alt="Checkup"
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
            <p className="font-medium text-center">{checkup.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}