import React, { useState, useEffect } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import useStore from "../../useStore";
import { auth } from "../../firebase";
import { useFormik } from "formik";
import * as Yup from "yup";

export const AddIncome = () => {
  const { income, fetchUserData, setIncome, loading } = useStore();
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

  const formik = useFormik({
    initialValues: {
      incomeAmount: "",
      incomeDate: new Date().toISOString().split("T")[0],
    },
    validationSchema: Yup.object({
      incomeAmount: Yup.number()
        .required("Income amount is required")
        .positive("Income must be greater than zero")
        .typeError("Please enter a valid number"),
      incomeDate: Yup.date()
        .required("Date is required")
        .min(
          new Date(new Date().setHours(0, 0, 0, 0)),
          "Cannot select a past date"
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!userId) return alert("No user logged in!");

      const receivedDate = new Date(values.incomeDate);
      const nextSalary = new Date(receivedDate);
      nextSalary.setDate(receivedDate.getDate() + 30);

      await setIncome(userId, {
        amount: Number(values.incomeAmount),
        receivedDate: receivedDate.toISOString().split("T")[0],
        nextSalaryDate: nextSalary.toISOString().split("T")[0],
      });

      resetForm();
    },
    validateOnBlur: true,
    validateOnChange: true,
  });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="text-gray-800 text-xl mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-8 ml-64">
        <h1 className="text-gray-800 text-3xl font-bold mb-6">Add Income</h1>

        <form onSubmit={formik.handleSubmit}>
          <input
            type="number"
            name="incomeAmount"
            placeholder="Enter income amount"
            value={formik.values.incomeAmount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block mb-2 w-full p-3 rounded bg-white text-gray-800 border-2 ${
              formik.touched.incomeAmount && formik.errors.incomeAmount
                ? "border-red-500"
                : "border-gray-300"
            } focus:border-blue-500 focus:outline-none`}
          />
          <input
            type="date"
            name="incomeDate"
            value={formik.values.incomeDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            min={new Date().toISOString().split("T")[0]}
            className={`block mb-2 w-full p-3 rounded bg-white text-gray-800 border-2 ${
              formik.touched.incomeDate && formik.errors.incomeDate
                ? "border-red-500"
                : "border-gray-300"
            } focus:border-blue-500 focus:outline-none appearance-none`}
            style={{
              colorScheme: "light",
              WebkitAppearance: "none",
              MozAppearance: "none",
            }}
          />

          {formik.touched.incomeAmount && formik.errors.incomeAmount && (
            <p className="text-red-500 text-sm mb-4">
              {formik.errors.incomeAmount}
            </p>
          )}

          {formik.touched.incomeDate && formik.errors.incomeDate && (
            <p className="text-red-500 text-sm mb-4">
              {formik.errors.incomeDate}
            </p>
          )}

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded transition"
          >
            Save Income
          </button>
        </form>

        <div className="mt-6">
          <h2 className="text-gray-800 text-xl font-semibold mb-3">
            Current Income
          </h2>
          <p className="text-3xl font-bold text-green-600">
            Rs {income?.amount || 0}
          </p>
          {income && (
            <p className="text-gray-700 mt-1">
              Received on: {income.receivedDate} | Next salary:{" "}
              {income.nextSalaryDate}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
