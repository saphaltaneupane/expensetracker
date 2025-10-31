import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

export const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="text-white bg-gray-900 min-h-screen flex">
      <div className="w-64 bg-gray-800 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-center py-6 border-b border-gray-700">
            <span className="text-emerald-500">Expense</span>
            <span className="text-white">Ease</span>
          </h2>
          {/* Sidebar Links */}
          <nav className="flex flex-col gap-4 p-6">
            <Link to="/addincome" className="hover:text-emerald-400 transition">
              Add Income
            </Link>
            <Link
              to="/addexpense"
              className="hover:text-emerald-400 transition"
            >
              Add Expenses
            </Link>
            <Link to="/report" className="hover:text-emerald-400 transition">
              Report
            </Link>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="m-6 py-2 px-4 bg-emerald-500 hover:bg-emerald-600 rounded text-white font-semibold"
        >
          Logout
        </button>
      </div>

      <div className="flex-1 p-8">
        <h1>Welcome to the Dashboard</h1>
      </div>
    </div>
  );
};
