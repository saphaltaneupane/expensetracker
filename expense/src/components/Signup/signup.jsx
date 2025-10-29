import React from "react";
import { Link } from "react-router-dom";
export const Signup = () => {
  return (
    <div className="text-white bg-gray-900 min-h-screen flex justify-center items-center">
      <div className="bg-gray-800/60 border border-gray-700 shadow-xl shadow-emerald-500/10 rounded-2xl p-10 w-full max-w-lg backdrop-blur-md text-center transition-transform hover:scale-105 hover:shadow-emerald-500/30">
        <h1 className="flex justify-center text-4xl md:text-5xl font-extrabold text-emerald-500 space-x-3 mb-8 tracking-wide">
          <span>Signup</span>
          <span className="text-white">Page</span>
        </h1>

        <form className="flex flex-col items-center w-full space-y-6">
          <div className="w-4/5 md:w-3/4 text-left">
            <label className="text-base text-gray-300 mb-2 block font-medium">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full text-lg p-3 rounded-lg border border-gray-700 bg-gray-100 text-black focus:outline-none focus:ring-4 focus:ring-emerald-500/50 shadow-inner transition-all duration-200"
            />
          </div>

          <div className="w-4/5 md:w-3/4 text-left">
            <label className="text-base text-gray-300 mb-2 block font-medium">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full text-lg p-3 rounded-lg border border-gray-700 bg-gray-100 text-black focus:outline-none focus:ring-4 focus:ring-emerald-500/50 shadow-inner transition-all duration-200"
            />
          </div>

          <div className="w-4/5 md:w-3/4 text-left">
            <label className="text-base text-gray-300 mb-2 block font-medium">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full text-lg p-3 rounded-lg border border-gray-700 bg-gray-100 text-black focus:outline-none focus:ring-4 focus:ring-emerald-500/50 shadow-inner transition-all duration-200"
            />
          </div>

          <div className="w-4/5 md:w-3/4 text-left">
            <label className="text-base text-gray-300 mb-2 block font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full text-lg p-3 rounded-lg border border-gray-700 bg-gray-100 text-black focus:outline-none focus:ring-4 focus:ring-emerald-500/50 shadow-inner transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-4/5 md:w-3/4 text-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg shadow-xl hover:shadow-emerald-500/50 transition-all duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="text-gray-400 text-base mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-400 hover:underline font-semibold"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};
