import React from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import useStore from "../../useStore";
import { useEffect, useMemo } from "react";

export const Dashboard = () => {
  // Get data from your store
  const { currentUserId, fetchUserData, expenses } = useStore();

  // Fetch user data when component loads
  useEffect(() => {
    if (currentUserId) fetchUserData(currentUserId);
  }, [currentUserId, fetchUserData]);

  // CALCULATION 1: Total Expenses
  const totalExpenses = useMemo(() => {
    return expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  }, [expenses]);

  // CALCULATION 2: Count of Expenses
  const expenseCount = expenses?.length || 0;

  // CALCULATION 3: Average Expense
  const averageExpense = useMemo(() => {
    return expenseCount > 0 ? (totalExpenses / expenseCount).toFixed(2) : 0;
  }, [totalExpenses, expenseCount]);

  // CALCULATION 4: Category Data for Charts
  const categoryData = useMemo(() => {
    const totals = {};
    expenses?.forEach((exp) => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });
    return Object.entries(totals).map(([name, value]) => ({
      name,
      amount: value,
    }));
  }, [expenses]);

  // CALCULATION 5: Monthly Data for Charts
  const monthlyData = useMemo(() => {
    const totals = {};
    expenses?.forEach((exp) => {
      const date = new Date(exp.date);
      const monthKey = date.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });
      totals[monthKey] = (totals[monthKey] || 0) + exp.amount;
    });
    return Object.entries(totals).map(([name, value]) => ({
      name,
      amount: value,
    }));
  }, [expenses]);

  // Colors for the pie chart
  const COLORS = [
    "#8b5cf6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
    "#ec4899",
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 ml-64">
        <h1 className="text-gray-900 text-3xl font-bold mb-8">
          Analytics Dashboard
        </h1>
        {/* Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* total Expenses */}
          <div className="bg-slate-100 p-6 rounded-lg shadow-md border border-emerald-500">
            <p className="text-slate-600 text-sm font-medium mb-2">
              Total Expenses
            </p>
            <p className="text-3xl font-bold text-slate-800">
              Rs {totalExpenses.toLocaleString()}
            </p>
          </div>

          {/* Number of Expenses  */}
          <div className="bg-slate-100 rounded-lg shadow p-6 border border-emerald-500">
            <p className="text-slate-600 text-sm font-medium mb-2">
              Number of Expenses
            </p>
            <p className="text-3xl font-bold text-slate-800">{expenseCount}</p>
          </div>

          {/* Average Expense */}
          <div className="bg-slate-100 rounded-lg shadow p-6 border border-emerald-500">
            <p className="text-slate-600 text-sm font-medium mb-2">
              Average Expense
            </p>
            <p className="text-3xl font-bold text-slate-800">
              Rs {averageExpense}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Expenses by Category
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#10b981" /> {/* Emerald Green */}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2: Category Pie Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Category Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 3: Monthly Trends (Full Width) */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Monthly Trends
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 3: TOP CATEGORIES LIST */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Top Categories
          </h2>
          <div className="space-y-3">
            {categoryData
              .sort((a, b) => b.amount - a.amount)
              .map((cat, index) => (
                <div
                  key={cat.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    >
                      {index + 1}
                    </div>
                    <span className="text-gray-800 font-medium">
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-gray-900 font-bold">
                    Rs {cat.amount.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
