import React, { useEffect, useMemo } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import useStore from "../../useStore";

export const Report = () => {
  const { currentUserId, fetchUserData, expenses } = useStore();

  useEffect(() => {
    if (currentUserId) fetchUserData(currentUserId);
  }, [currentUserId, fetchUserData]);

  const categoryTotals = useMemo(() => {
    const totals = {};
    expenses?.forEach((exp) => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });
    return totals;
  }, [expenses]);

  const monthlyTotals = useMemo(() => {
    const totals = {};
    expenses?.forEach((exp) => {
      const date = new Date(exp.date);
      const monthKey = date.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
      totals[monthKey] = (totals[monthKey] || 0) + exp.amount;
    });
    return totals;
  }, [expenses]);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 p-8 ml-64">
        <h1 className="text-gray-900 text-3xl font-bold mb-6">Reports</h1>

        {/* CATEGORY LIST */}
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Expenses by Category
        </h2>

        <div className="pl-2 mb-8">
          {Object.entries(categoryTotals).map(([cat, amount]) => (
            <p key={cat} className="text-gray-800 text-lg mb-1">
              {cat} — <span className="font-semibold">Rs {amount}</span>
            </p>
          ))}
        </div>

        {/* MONTH LIST */}
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Expenses by Month
        </h2>

        <div className="pl-2">
          {Object.entries(monthlyTotals).map(([month, amount]) => (
            <p key={month} className="text-gray-800 text-lg mb-1">
              {month} — <span className="font-semibold">Rs {amount}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
