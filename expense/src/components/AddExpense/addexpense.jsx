import React from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { useEffect } from "react";
import useStore from "../../useStore";
import { useFormik } from "formik";
import * as Yup from "yup";

export const AddExpense = () => {
  const { categories, fetchUserData, addExpense } = useStore();
  const userId = "testuser";

  const formik = useFormik({
    initialValues: {
      expenseName: "",
      amount: "",
      selectedCategory: "",
    },
    validationSchema: Yup.object({
      expenseName: Yup.string().required("Expense name is required"),
      amount: Yup.number()
        .required("Amount is required")
        .positive("Amount must be greater than zero")
        .typeError("Please enter a valid number"),
      selectedCategory: Yup.string().required("Category is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await addExpense(userId, {
          name: values.expenseName,
          amount: Number(values.amount),
          category: values.selectedCategory,
        });
        console.log("Expense added successfully!");
        alert("Expense added successfully!");
        resetForm();
      } catch (error) {
        console.error("Error adding expense:", error);
        alert("Failed to add expense. Please try again.");
      }
    },
    validateOnBlur: true,
    validateOnChange: true,
  });

  useEffect(() => {
    fetchUserData(userId);
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-8 ml-64">
        <h1 className="text-gray-800 text-3xl font-bold mb-6">Add Expenses</h1>
        <form onSubmit={formik.handleSubmit}>
          <input
            type="text"
            name="expenseName"
            placeholder="Expense Title"
            value={formik.values.expenseName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block mb-2 w-full p-3 rounded bg-white text-gray-800 border-2 ${
              formik.touched.expenseName && formik.errors.expenseName
                ? "border-red-500"
                : "border-gray-300"
            } focus:border-blue-500 focus:outline-none`}
          />
          {formik.touched.expenseName && formik.errors.expenseName && (
            <p className="text-red-500 text-sm mb-4">
              {formik.errors.expenseName}
            </p>
          )}

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formik.values.amount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block mb-2 w-full p-3 rounded bg-white text-gray-800 border-2 ${
              formik.touched.amount && formik.errors.amount
                ? "border-red-500"
                : "border-gray-300"
            } focus:border-blue-500 focus:outline-none`}
          />
          {formik.touched.amount && formik.errors.amount && (
            <p className="text-red-500 text-sm mb-4">{formik.errors.amount}</p>
          )}

          <select
            name="selectedCategory"
            value={formik.values.selectedCategory}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`block mb-2 w-full p-3 rounded bg-white text-gray-800 border-2 ${
              formik.touched.selectedCategory && formik.errors.selectedCategory
                ? "border-red-500"
                : "border-gray-300"
            } focus:border-blue-500 focus:outline-none`}
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {formik.touched.selectedCategory &&
            formik.errors.selectedCategory && (
              <p className="text-red-500 text-sm mb-4">
                {formik.errors.selectedCategory}
              </p>
            )}

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
