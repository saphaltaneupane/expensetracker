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

  const totalExpenses = useMemo(() => {
    return expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  }, [expenses]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-8 ml-64">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Overview of your expenses</p>
        </div>

        {/* Total Summary */}
        <div className="bg-white rounded-xl p-6 mb-8 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
          <h2 className="text-4xl font-bold text-gray-900">
            Rs {totalExpenses.toLocaleString()}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Section */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              By Category
            </h2>
            <div className="space-y-3">
              {Object.entries(categoryTotals).map(([cat, amount]) => (
                <div
                  key={cat}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700 font-medium">{cat}</span>
                  <span className="text-gray-900 font-semibold">
                    Rs {amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Section */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              By Month
            </h2>
            <div className="space-y-3">
              {Object.entries(monthlyTotals)
                .sort((a, b) => new Date(b[0]) - new Date(a[0]))
                .map(([month, amount]) => (
                  <div
                    key={month}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-700 font-medium">{month}</span>
                    <span className="text-gray-900 font-semibold">
                      Rs {amount.toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {(!expenses || expenses.length === 0) && (
          <div className="text-center py-16">
            <p className="text-gray-500">No expenses to display</p>
          </div>
        )}
      </div>
    </div>
  );
};
