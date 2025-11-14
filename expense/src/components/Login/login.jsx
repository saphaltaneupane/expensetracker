import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import useStore from "../../useStore";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchUserData, setCurrentUserId, logout } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Clear any previous user's data first
      logout();

      const result = await signInWithEmailAndPassword(auth, email, password);
      const uid = result.user.uid;

      setCurrentUserId(uid);

      // Force fetch fresh data from Firebase
      await fetchUserData(uid);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white bg-gray-900 min-h-screen flex justify-center items-center">
      <div className="relative group bg-gray-800/60 border border-gray-700 shadow-xl shadow-emerald-500/10 rounded-2xl p-10 w-full max-w-lg backdrop-blur-md text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30 overflow-visible">
        <h1 className="flex justify-center text-4xl md:text-5xl font-extrabold text-emerald-500 space-x-3 mb-8 tracking-wide">
          <span>Login</span>
          <span className="text-white">Page</span>
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full space-y-6"
        >
          <div className="w-4/5 md:w-3/4 text-left">
            <label className="text-base text-gray-300 mb-2 block font-medium">
              Email
            </label>
            <input
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
              className="w-full text-lg p-3 rounded-lg border border-gray-700 bg-gray-100 text-black focus:outline-none focus:ring-4 focus:ring-emerald-500/50 shadow-inner transition-all duration-200 disabled:opacity-50"
            />
          </div>

          <div className="w-4/5 md:w-3/4 text-left">
            <label className="text-base text-gray-300 mb-2 block font-medium">
              Password
            </label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Enter your password"
              disabled={loading}
              className="w-full text-lg p-3 rounded-lg border border-gray-700 bg-gray-100 text-black focus:outline-none focus:ring-4 focus:ring-emerald-500/50 shadow-inner transition-all duration-200 disabled:opacity-50"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-4/5 md:w-3/4 text-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg shadow-xl hover:shadow-emerald-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-400 text-base mt-8">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-emerald-400 hover:underline font-semibold"
          >
            Sign up
          </Link>
        </p>

        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 h-4 rounded-full bg-emerald-500 blur-3xl opacity-30 pointer-events-none transition-all duration-300 group-hover:blur-6xl group-hover:opacity-60" />
      </div>
    </div>
  );
};

export default Login;
