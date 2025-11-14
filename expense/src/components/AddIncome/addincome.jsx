import React, { useEffect } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import useStore from "../../useStore";
import { useFormik } from "formik";
import * as Yup from "yup";

export const AddIncome = () => {
  const { income, setIncome, currentUserId, fetchUserData } = useStore();

  // ✅ fetch income automatically if logged in (no reloads)
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
      if (!currentUserId) return alert("No user logged in!");

      const receivedDate = new Date(values.incomeDate);
      const nextSalary = new Date(receivedDate);
      nextSalary.setDate(receivedDate.getDate() + 30);

      await setIncome(currentUserId, {
        amount: Number(values.incomeAmount),
        receivedDate: receivedDate.toISOString().split("T")[0],
        nextSalaryDate: nextSalary.toISOString().split("T")[0],
      });

      resetForm();
      fetchUserData(currentUserId); // ✅ refresh data instantly after save
    },
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Center content, slightly upward */}
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
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded transition w-full"
            >
              Save Income
            </button>
          </form>

          <div className="mt-6 text-center">
            <h2 className="text-gray-800 text-xl font-semibold mb-3">
              Current Income
            </h2>
            <p className="text-3xl font-bold text-green-600">
              Rs {income?.amount || 0}
            </p>
            {income && (
              <p className="text-gray-700 mt-1">
                Received on: {income.receivedDate || "—"} | Next salary:{" "}
                {income.nextSalaryDate || "—"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
