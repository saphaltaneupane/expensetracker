import React, { useEffect } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import useStore from "../../useStore";
import { useFormik } from "formik";
import * as Yup from "yup";

export const AddIncome = () => {
  const { income, setIncome, resetIncome, currentUserId, fetchUserData } =
    useStore();

  // Fetch income automatically if logged in (no reloads)
  useEffect(() => {
    if (currentUserId) {
      fetchUserData(currentUserId); // this gets the user data from firebase
    }
  }, [currentUserId, fetchUserData]);

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
      if (!currentUserId) {
        alert("No user logged in!");
        return;
      }

      const receivedDate = new Date(values.incomeDate);
      const nextSalary = new Date(receivedDate);
      nextSalary.setDate(receivedDate.getDate() + 30);

      await setIncome(currentUserId, {
        amount: Number(values.incomeAmount),
        receivedDate: receivedDate.toISOString().split("T")[0],
        nextSalaryDate: nextSalary.toISOString().split("T")[0],
      });

      // ✅ The setIncome function now handles clearing reset flags automatically
      resetForm();
      fetchUserData(currentUserId);
    },
  });

  const handleReset = async () => {
    if (!currentUserId) {
      alert("No user logged in!");
      return;
    }

    const confirmReset = window.confirm(
      "Are you sure you want to reset your income? This will hide current expenses from Add Expense page, but they will still appear in reports."
    );

    if (confirmReset) {
      await resetIncome(currentUserId);
      fetchUserData(currentUserId);
      alert(
        "Income reset! Old expenses are now hidden from Add Expense page but remain in reports."
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 ml-64 flex items-start justify-center pt-24">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-gray-800 text-3xl font-bold mb-6 text-center">
            Add Income
          </h1>

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
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded transition w-full font-semibold"
            >
              Save Income
            </button>
          </form>

          <div className="mt-6 text-center border-t pt-6">
            <h2 className="text-gray-800 text-xl font-semibold mb-3">
              Income of this month
            </h2>
            <p className="text-4xl font-bold text-green-600 mb-2">
              Rs {income?.amount || 0}
            </p>
            {income && income.amount > 0 && (
              <>
                <p className="text-gray-600 text-sm mt-2">
                  <span className="font-medium">Received on:</span>{" "}
                  {income.receivedDate || "—"}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Next salary:</span>{" "}
                  {income.nextSalaryDate || "—"}
                </p>

                {/* Reset Button - Only shows when income exists and > 0 */}
                <button
                  onClick={handleReset}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition font-semibold shadow-md"
                >
                  Reset Income
                </button>
              </>
            )}

            {(!income || income.amount === 0) && (
              <p className="text-gray-500 text-sm mt-2">
                No income added yet. Please add your income above.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
