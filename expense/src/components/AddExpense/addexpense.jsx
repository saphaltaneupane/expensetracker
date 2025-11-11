import React from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { useState, useEffect } from "react";
import useStore from "../../useStore";
export const AddExpense = () => {
  const [expenseName, setexpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { categories, fetchUserData, addExpense } = useStore();
  const userId = "testuser";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!expenseName || !amount || !selectedCategory) {
      alert("Please fill all fields!");
      return;
    }

    console.log("Submitting expense:", {
      name: expenseName,
      amount: amount,
      category: selectedCategory,
      userId: userId,
    });

    try {
      await addExpense(userId, {
        name: expenseName,
        amount: amount,
        category: selectedCategory,
      });
      console.log("Expense added successfully!");
      alert("Expense added successfully!");
      setexpenseName("");
      setAmount("");
      setSelectedCategory("");
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense. Please try again.");
    }
  };

  useEffect(() => {
    fetchUserData(userId);
  }, []);
  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-8 ml-64">
        <h1 className="text-white text-3xl font-bold mb-6">Add Expenses</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Expense Title"
            className="block mb-4 w-full p-3 rounded bg-gray-800 text-white border border-gray-800"
            value={expenseName}
            onChange={(e) => setexpenseName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            className="block mb-4 w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block mb-4 w-full p-3 rounded bg-gray-800 text-white border border-gray-700"
          >
            <option value="">Select Category </option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded transition"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};
