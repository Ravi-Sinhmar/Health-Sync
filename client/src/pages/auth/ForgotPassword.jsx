"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setError("Email is required")
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid")
      return
    }

    setIsLoading(true)

    try {
      // API call to send reset password OTP
      const response = await fetch(`${apiConfig.baseURL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send verification code")
      }

      toast.success("Verification code sent to your email")
      navigate("/verify-otp", { state: { email, isForgotPassword: true } })
    } catch (error) {
      toast.error(error.message || "Failed to send verification code")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset your password</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a verification code to reset your password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              placeholder="Enter your email"
              required
            />

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Send Verification Code
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link to="/login" className="font-medium text-violet-600 hover:text-violet-600">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

