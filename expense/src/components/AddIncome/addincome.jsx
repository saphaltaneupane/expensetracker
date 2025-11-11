import React, { useState, useEffect } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import useStore from "../../useStore";
import { auth } from "../../firebase";

export const AddIncome = () => {
  const { income, fetchUserData, setIncome, loading } = useStore();
  const [newIncome, setNewIncome] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserData(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return alert("No user logged in!");
    await setIncome(userId, Number(newIncome));
    setNewIncome("");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-white p-8">
        <h1 className="text-2xl font-bold mb-4">Add Income</h1>
        <form onSubmit={handleIncomeSubmit} className="mb-6">
          <input
            type="number"
            placeholder="Enter income amount"
            value={newIncome}
            onChange={(e) => setNewIncome(e.target.value)}
            className="border p-2 rounded mr-4"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Income
          </button>
        </form>
        <p className="mb-4">
          Current Income: <b>{income || 0}</b>
        </p>
      </div>
    </div>
  );
};
