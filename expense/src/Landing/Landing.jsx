import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="font-sans min-h-screen bg-gray-900 text-white flex flex-col items-center">
      {/* Navbar */}
      <header className="w-full bg-gray-900 border-b border-gray-800">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-500">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              ExpenseEase
            </Link>
          </h1>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-base font-semibold text-emerald-400 hover:text-emerald-300 transition-all"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-base font-semibold text-emerald-400 hover:text-emerald-300 transition-all"
            >
              Signup
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((s) => !s)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
              className="p-2 rounded-md text-emerald-400 hover:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {menuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } md:hidden border-t border-gray-800`}
        >
          <div className="px-6 py-4 flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="text-base font-semibold text-emerald-400 hover:text-emerald-300 transition-all"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setMenuOpen(false)}
              className="text-base font-semibold text-emerald-400 hover:text-emerald-300 transition-all"
            >
              Signup
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center text-center mt-24 px-4">
        <h1 className="text-4xl md:text-5xl font-bold leading-snug">
          <span className="text-emerald-500">Track your </span>
          expenses. <span className="text-emerald-500">Take control </span>
          of your money.
        </h1>

        <p className="mt-4 text-lg text-gray-300 max-w-2xl">
          A smarter way to manage your finances —{" "}
          <span className="text-emerald-500 font-semibold">
            simple, secure, and stress-free.
          </span>
        </p>

        <Link
          to="login"
          className="mt-8 px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold text-lg hover:bg-emerald-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/40"
        >
          Get Started
        </Link>
      </div>

      {/* Features Section */}
      <div className=" mt-24">
        <span className="text-emerald-400 font-bold"> Amazing </span>{" "}
        <span className="text-orange-500  font-bold">Features</span>
        <h1 className="mt-8 text-3xl font-bold text-emerald-400">
          Why choose ExpenseEase?
        </h1>
        <h3 className="mt-3 text-gray-300 text-lg">
          Easy, smart, and effortless tracking of your money.
        </h3>
      </div>

      {/* Changed: Cards Section - responsive grid of feature cards */}
      <div className="w-full max-w-5xl px-4 mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">Quick Overview</h3>
            </div>
            <p className="mt-4 text-gray-300">
              See your spending at a glance with clear charts and daily
              summaries.
            </p>
            <Link
              to="login"
              className="mt-6 inline-block px-4 py-2 bg-emerald-500 text-white rounded-md text-sm font-medium hover:bg-emerald-600 transition"
            >
              Learn more
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">Fast Entry</h3>
            </div>
            <p className="mt-4 text-gray-300">
              Add expenses quickly and categorize them in one tap.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-block px-4 py-2 bg-emerald-500 text-white rounded-md text-sm font-medium hover:bg-emerald-600 transition"
            >
              Learn more
            </Link>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">Smart Reports</h3>
            </div>
            <p className="mt-4 text-gray-300">
              Generate monthly reports and spot trends to improve saving.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-block px-4 py-2 bg-emerald-500 text-white rounded-md text-sm font-medium hover:bg-emerald-600 transition"
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="mt-auto w-full bg-gray-900 border-t border-gray-800 py-6 flex items-center justify-center">
        <span className="text-sm text-gray-400">
          {" "}
          2025 ExpenseEase
          <p>By Saphalta Neupane Asmt</p>
        </span>
      </div>
    </div>
  );
};
