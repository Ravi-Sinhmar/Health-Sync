"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import apiConfig from './../../config/api';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || '';
  const isPasswordReset = location.state?.isPasswordReset || false; // Get flag from route state
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email]);

  const handleResendOTP = async () => {
    setIsResending(true);

    try {
      // API call to resend OTP
      await fetch(`${apiConfig.baseURL}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, isPasswordReset }), // Pass flag to indicate password reset
      });

      setTimeLeft(120); // Reset timer
      toast.success('OTP resent successfully');
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    setIsVerifying(true);

    try {
      // API call to verify OTP
      const response = await fetch(`${apiConfig.baseURL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, isPasswordReset }), // Pass flag to backend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      toast.success('OTP verified successfully');
      // Redirect based on API response
      if (data.redirectTo) {
        console.log("data", data);
        console.log("Email",email); 
        navigate(data.redirectTo, { state: { email, token : data.token } });
      }
    } catch (error) {
      setError(error.message || 'Failed to verify OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a verification code to<br />
          <span className="font-medium text-violet-600">{email}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleVerifyOTP}>
            <Input
              label="Verification Code"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              error={error}
              placeholder="Enter the 6-digit code"
              required
            />

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Time remaining: <span className="font-medium">{formatTime(timeLeft)}</span>
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResendOTP}
                disabled={timeLeft > 0 || isResending}
                isLoading={isResending}
              >
                Resend Code
              </Button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isVerifying}
            >
              Verify
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
