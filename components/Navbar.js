"use client";

import Link from "next/link";
import { useState,useEffect } from "react";
import { usePathname } from "next/navigation"; // To get the current route

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname(); // Get the current route

  useEffect(() => {
    const checkLoginStatus = () => {
      const cookies = document.cookie.split("; ");
      console.log(cookies)
      const userToken = cookies.find((row) => row.startsWith("user_token="));
      setIsLoggedIn(!!userToken); // Set isLoggedIn to true if user_token exists
    };

    checkLoginStatus();
  }, []);

  return (
    <nav className="bg-blue-600 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 flex justify-between items-center py-3">
        {/* Logo */}
        <div className="text-xl font-bold">
          <Link href="/" className="hover:opacity-80 transition">
            KaroScore
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:underline">
              About
            </Link>
          </li>
          <li>
            <Link href="/register" className="hover:underline">
              Exams
            </Link>
          </li>
          <li>
            <Link href="/results" className="hover:underline">
              Results
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:underline">
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Login/Sign-Up Buttons */}
        <div className="flex space-x-4">
          {/* Hide Login button on the Login page */}
          {pathname !== "/login" && !isLoggedIn && (
            <Link
              href="/login"
              className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              Login
            </Link>
          )}
          {/* Hide Sign-Up button on the Sign-Up page */}
          {pathname !== "/signup" && !isLoggedIn &&  (
            <Link
              href="/signup"
              className="bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500 transition"
            >
              Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
