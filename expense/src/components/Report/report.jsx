import React from "react";
import { Sidebar } from "../Sidebar/Sidebar";
export const Report = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-8 ml-64">
        <h1 className="text-gray-800 text-3xl font-bold mb-6">Reports</h1>
      </div>
    </div>
  );
};
