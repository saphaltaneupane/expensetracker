import React from "react";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
export const Sidebar = () => {
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
    <div className="w-64 bg-gray-800 border-r border-gray-700 fixed h-full flex flex-col justify-between shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-center py-6 border-b border-gray-700">
          <span className="text-emerald-500">Expense</span>
          <span className="text-white">Ease</span>
        </h2>
        {/* Sidebar Links */}
        <nav className="flex flex-col gap-4 p-6">
          <Link
            to="/dashboard"
            className="text-white hover:text-emerald-500 transition font-medium"
          >
            Dashboard
          </Link>
          <Link
            to="/addincome"
            className="text-white hover:text-emerald-500 transition font-medium"
          >
            Add Income
          </Link>
          <Link
            to="/addexpense"
            className="text-white hover:text-emerald-500 transition font-medium"
          >
            Add Expenses
          </Link>
          <Link
            to="/category"
            className="text-white hover:text-emerald-500 transition font-medium"
          >
            Add Category
          </Link>
          <Link
            to="/report"
            className="text-white hover:text-emerald-500 transition font-medium"
          >
            Report
          </Link>
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="m-6 py-2 px-4 bg-emerald-500 hover:bg-emerald-600 rounded text-white font-semibold transition"
      >
        Logout
      </button>
    </div>
  );
};
