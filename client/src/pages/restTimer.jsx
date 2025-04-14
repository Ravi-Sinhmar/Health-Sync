"use client"

import { useState, useEffect } from "react"

export default function RestTimer({ duration, onFinish, onCancel }) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(true)

  useEffect(() => {
    setTimeLeft(duration)
    setIsRunning(true)
  }, [duration])

  useEffect(() => {
    let interval
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      onFinish()
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft, onFinish])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-center">
        <h2 className="mb-4 text-2xl font-bold">Rest Timer</h2>
        <div className="my-8 text-6xl font-bold">{formatTime(timeLeft)}</div>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="rounded-md bg-violet-600 px-4 py-2 text-white hover:bg-violet-600/90"
          >
            {isRunning ? "Pause" : "Resume"}
          </button>
          <button onClick={onCancel} className="rounded-md border px-4 py-2 hover:bg-gray-50">
            End Rest
          </button>
        </div>
      </div>
    </div>
  )
}
