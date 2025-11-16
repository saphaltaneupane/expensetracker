import React, { useEffect, useMemo } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import useStore from "../../useStore";
import { useFormik } from "formik";
import * as Yup from "yup";

export const AddExpense = () => {
  const {
    income,
    expenses,
    addExpense,
    currentUserId,
    fetchUserData,
    categories,
    resetDate,
    clearExpenseUIReset,
  } = useStore();

  useEffect(() => {
    if (currentUserId) {
      fetchUserData(currentUserId);
    }
  }, [fetchUserData, currentUserId]);

  // Use income object safely
  const incomeAmount = income?.amount ?? null;
  const incomeStartDate = income?.receivedDate
    ? new Date(income.receivedDate)
    : null;

  // ✅ Filter expenses for display in Add Expense UI
  const expensesForUI = useMemo(() => {
    // Priority 1: If we have a reset date, ONLY show expenses after that date
    if (resetDate) {
      return (expenses || []).filter(
        (e) => new Date(e.date) > new Date(resetDate)
      );
    }

    // Priority 2: If we have income start date, show expenses after that
    if (incomeStartDate) {
      return (expenses || []).filter((e) => {
        const d = new Date(e.date);
        return d >= incomeStartDate;
      });
    }

    // No filters active - show all
    return expenses || [];
  }, [expenses, incomeStartDate, resetDate]);

  // ✅ FIXED: Calculate totalSpent ONLY from filtered expenses (expensesForUI)
  // This ensures old expenses don't affect the balance after reset
  const totalSpent =
    incomeAmount !== null
      ? expensesForUI.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
      : 0;

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
      if (!currentUserId) {
        alert("No user logged in!");
        return;
      }

      // Only enforce balance when income exists
      if (incomeAmount !== null) {
        const remaining = incomeAmount - totalSpent;
        if (Number(values.amount) > remaining) {
          alert(
            `Insufficient balance! You only have Rs ${remaining} remaining.`
          );
          return;
        }
      }

      try {
        await addExpense(currentUserId, {
          name: values.expenseName,
          amount: Number(values.amount),
          category: values.selectedCategory,
          date: new Date().toISOString(),
        });
        alert("Expense added successfully!");
        resetForm();
        fetchUserData(currentUserId);
      } catch (error) {
        console.error("Error adding expense:", error);
        alert("Failed to add expense. Please try again.");
      }
    },
  });

  const handleClearExpenses = async () => {
    if (!currentUserId) {
      alert("No user logged in!");
      return;
    }

    const confirm = window.confirm(
      "This will clear the expense history from this page. Old expenses will still appear in reports. Continue?"
    );

    if (confirm) {
      await clearExpenseUIReset(currentUserId);
      fetchUserData(currentUserId);
      alert(
        "Expense view cleared! You can now add expenses with your current income."
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Center content, slightly upward */}
      <div className="flex-1 ml-64 flex items-start justify-center pt-24">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-gray-800 text-3xl font-bold mb-6 text-center">
            Add Expense
          </h1>

          {/* Always show totals when income exists */}
          {incomeAmount !== null && (
            <div className="mb-6 p-4 bg-blue-100 rounded-lg text-gray-800">
              <p className="text-lg font-semibold">
                Total Spent: Rs {totalSpent}
              </p>
              <p
                className={`text-xl font-bold ${
                  incomeAmount - totalSpent >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Remaining: Rs {incomeAmount - totalSpent}
              </p>
            </div>
          )}

          <form onSubmit={formik.handleSubmit}>
            {/* Expense name */}
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

            {/* Amount */}
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
              <p className="text-red-500 text-sm mb-4">
                {formik.errors.amount}
              </p>
            )}

            {/* Category dropdown */}
            <select
              name="selectedCategory"
              value={formik.values.selectedCategory}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`block mb-2 w-full p-3 rounded bg-white text-gray-800 border-2 ${
                formik.touched.selectedCategory &&
                formik.errors.selectedCategory
                  ? "border-red-500"
                  : "border-gray-300"
              } focus:border-blue-500 focus:outline-none`}
            >
              <option value="">Select Category</option>
              {(categories || []).map((cat, index) => (
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

            {/* Button */}
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded transition w-full"
            >
              Add Expense
            </button>
          </form>

          {/* Clear Expenses Button */}
          {expensesForUI.length > 0 && (
            <button
              onClick={handleClearExpenses}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded transition w-full mt-4"
            >
              Clear Expense History
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
