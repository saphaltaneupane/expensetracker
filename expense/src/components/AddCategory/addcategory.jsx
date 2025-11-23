import React, { useEffect } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { useFormik } from "formik";
import * as Yup from "yup";
import useStore from "../../useStore";

export const Addcategory = () => {
  const { categories, addCategory, fetchUserData, currentUserId } = useStore();

  useEffect(() => {
    if (currentUserId) {
      fetchUserData(currentUserId);
    }
  }, [fetchUserData, currentUserId]);

  const formik = useFormik({
    initialValues: {
      categoryName: "",
    },
    validationSchema: Yup.object({
      categoryName: Yup.string()
        .required("Category name is required")
        .min(3, "Category name must be at least 3 characters")
        .max(50, "Category name must be less than 50 characters"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!currentUserId) {
        alert("No user logged in!");
        return;
      }

      try {
        await addCategory(currentUserId, values.categoryName.trim());
        alert("Category added!");
        resetForm();
      } catch (err) {
        console.error("Failed to add category", err);
        alert("Could not add category. See console for details.");
      }
    },
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Centered content */}
      <div className="flex-1 ml-64 flex items-start justify-center pt-24">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-gray-800 text-3xl font-bold mb-6 text-center">
            Add Category
          </h1>

          {/* Category Form */}
          <form onSubmit={formik.handleSubmit}>
            <input
              type="text"
              placeholder="Category Name"
              value={formik.values.categoryName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="categoryName"
              className={`block mb-2 w-full p-3 rounded bg-white text-gray-800 border-2 ${
                formik.touched.categoryName && formik.errors.categoryName
                  ? "border-red-500"
                  : "border-gray-300"
              } focus:border-blue-500 focus:outline-none`}
            />
            {formik.touched.categoryName && formik.errors.categoryName && (
              <p className="text-red-500 text-sm mb-4">
                {formik.errors.categoryName}
              </p>
            )}

            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded transition w-full"
            >
              Add Category
            </button>
          </form>

          {/* Display Categories and adding can be done here  */}
          <div className="mt-6 text-center">
            <h2 className="text-gray-800 text-xl font-semibold mb-3">
              Your Categories
            </h2>

            {categories.length === 0 ? (
              <p className="text-gray-500">No categories yet. Add one above.</p>
            ) : (
              <ul className="text-gray-700 space-y-2 text-left">
                {categories.map((cat, index) => (
                  <li
                    key={index}
                    className="border-b border-gray-200 pb-2 last:border-none"
                  >
                    {index + 1}. {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addcategory;
