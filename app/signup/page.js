"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(""); // OTP input
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

  // Handle registering the user
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Send all data including OTP to the backend
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          dob,
          aadharNumber,
          phoneNumber,
          otp,
        }),
      });

      if (res.ok) {
        // alert("Registration successful!");
        router.push("/login");
      } else {
        const error = await res.json();
        alert(error.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
            Sign Up
          </h2>
          <form className="space-y-4">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Aadhar Number */}
            <div>
              <label
                htmlFor="aadharNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Aadhar Number
              </label>
              <input
                type="text"
                id="aadharNumber"
                placeholder="Enter your Aadhar number"
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Phone Number */}
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
            <button
              type="button"
              onClick={handleSendOtp}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              disabled={!otpResendAllowed && otpSent}
            >
              {otpSent ? "Resend OTP" : "Send OTP"}
            </button>

            {/* Resend Timer */}
            {otpSent && resendTimer > 0 && (
              <p className="text-sm text-gray-600 mt-2 text-center">
                {`You can resend OTP in ${resendTimer} seconds.`}
              </p>
            )}

            {/* Register Button */}
            <button
              onClick={handleRegister}
              className={`w-full ${
                otpSent ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
              } text-white py-2 px-4 rounded-lg transition`}
              disabled={!otpSent}
            >
              Register
            </button>
          </form>

          {/* Additional Links */}
          <p className="text-sm text-gray-600 text-center mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
