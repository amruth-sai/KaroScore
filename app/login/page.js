"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0); // Countdown timer for Resend OTP
  const [otpResendAllowed, setOtpResendAllowed] = useState(false);
  const router = useRouter();

  const MAX_RESEND_TIME = 30; // Time in seconds to allow Resend OTP

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else {
      setOtpResendAllowed(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Handle sending OTP
  const handleSendOtp = async () => {
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      if (res.ok) {
        // alert("OTP sent successfully!");
        setOtpSent(true);
        setOtpResendAllowed(false); // Disable resend button
        setResendTimer(MAX_RESEND_TIME); // Start timer
      } else {
        alert("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  // Handle login with OTP
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      if (res.ok) {
        // alert("Login successful!");
        router.push("/");
      } else {
        alert("Invalid OTP. Login failed.");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
            Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Phone Number Input */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* OTP Input */}
            {otpSent && (
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Send OTP Button */}
            {!otpSent && (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Send OTP
              </button>
            )}

            {/* Resend OTP Button */}
            {otpSent && (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                disabled={!otpResendAllowed}
              >
                Resend OTP
              </button>
            )}

            {/* Resend Timer */}
            {otpSent && resendTimer > 0 && (
              <p className="text-sm text-gray-600 mt-2 text-center">
                {`You can resend OTP in ${resendTimer} seconds.`}
              </p>
            )}

            {/* Submit Button */}
            {otpSent && (
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition mt-4"
              >
                Login
              </button>
            )}
          </form>

          {/* Additional Links */}
          <p className="text-sm text-gray-600 text-center mt-4">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
