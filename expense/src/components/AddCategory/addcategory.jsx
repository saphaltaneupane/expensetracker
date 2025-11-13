import React, { useEffect } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { useFormik } from "formik";
import * as Yup from "yup";
import useStore from "../../useStore";

export const Addcategory = () => {
  const { categories, addCategory, fetchUserData } = useStore();
  const userId = "testuser";

  // ✅ Fetch user data when component loads
  useEffect(() => {
    fetchUserData(userId);
  }, [fetchUserData, userId]);

  // ✅ Setup Formik form
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
      try {
        await addCategory(userId, values.categoryName.trim());
        alert("Category added!");
        resetForm();
      } catch (err) {
        console.error("Failed to add category", err);
        alert("Could not add category. See console for details.");
      }
    },
  });

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 p-8 ml-64">
        <h1 className="text-gray-800 text-3xl font-bold mb-6">Add Category</h1>

        {/* 🧾 Form Section */}
        <form className="max-w-md mb-8" onSubmit={formik.handleSubmit}>
          <input
            type="text"
            placeholder="Category Name"
            value={formik.values.categoryName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="categoryName"
            className="block mb-4 w-full p-3 rounded bg-white text-gray-800 border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
          />
          {formik.touched.categoryName && formik.errors.categoryName && (
            <p className="text-red-500 text-sm mb-2">
              {formik.errors.categoryName}
            </p>
          )}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded transition"
          >
            Add Category
          </button>
        </form>

        {/* 📋 Display Categories Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Your Categories:
          </h2>

          {categories.length === 0 ? (
            <p className="text-gray-500">No categories yet. Add one above.</p>
          ) : (
            <ul className="space-y-1">
              {categories.map((cat, index) => (
                <li key={index} className="text-gray-700">
                  {index + 1}. {cat}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
