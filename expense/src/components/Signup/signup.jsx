import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; // ✅ make sure path is correct

export const Signup = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [firebaseError, setFirebaseError] = useState("");

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setFirebaseError("");
      try {
        await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );

        // ✅ Success message
        setSuccessMessage("✅ Account created successfully!");
        resetForm();

        // Redirect after delay
        setTimeout(() => navigate("/dashboard"), 1500);
      } catch (error) {
        console.error("Signup error:", error);

        // Log the error code to see what Firebase says
        setFirebaseError(`Error: ${error.code} - ${error.message}`);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="text-white bg-gray-900 min-h-screen flex justify-center items-center">
      <div className="bg-gray-800/60 border border-gray-700 shadow-xl shadow-emerald-500/10 rounded-2xl p-10 w-full max-w-lg backdrop-blur-md text-center transition-transform hover:scale-105 hover:shadow-emerald-500/30">
        <h1 className="flex justify-center text-4xl md:text-5xl font-extrabold text-emerald-500 space-x-3 mb-8 tracking-wide">
          <span>Signup</span>
          <span className="text-white">Page</span>
        </h1>

        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col items-center w-full space-y-6"
        >
          {/* Full Name */}
          <div className="w-4/5 md:w-3/4 text-left">
            <label className="text-base text-gray-300 mb-2 block font-medium">
              Full Name
            </label>
            <input
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              type="text"
              placeholder="Enter your full name"
              className="w-full text-lg p-3 rounded-lg border border-gray-700 bg-gray-100 text-black focus:outline-none focus:ring-4 focus:ring-emerald-500/50 shadow-inner transition-all duration-200"
            />
            {formik.errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="w-4/5 md:w-3/4 text-left">
            <label className="text-base text-gray-300 mb-2 block font-medium">
              Email Address
            </label>
            <input
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              type="email"
              placeholder="Enter your email"
              className="w-full text-lg p-3 rounded-lg border border-gray-700 bg-gray-100 text-black focus:outline-none focus:ring-4 focus:ring-emerald-500/50 shadow-inner transition-all duration-200"
            />
            {formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="w-4/5 md:w-3/4 text-left">
            <label className="text-base text-gray-300 mb-2 block font-medium">
              Password
            </label>
            <input
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              type="password"
              placeholder="Enter your password"
              className="w-full text-lg p-3 rounded-lg border border-gray-700 bg-gray-100 text-black focus:outline-none focus:ring-4 focus:ring-emerald-500/50 shadow-inner transition-all duration-200"
            />
            {formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="w-4/5 md:w-3/4 text-left">
            <label className="text-base text-gray-300 mb-2 block font-medium">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              type="password"
              placeholder="Confirm your password"
              className="w-full text-lg p-3 rounded-lg border border-gray-700 bg-gray-100 text-black focus:outline-none focus:ring-4 focus:ring-emerald-500/50 shadow-inner transition-all duration-200"
            />
            {formik.errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Firebase Error Message */}
          {firebaseError && (
            <p className="text-red-500 text-sm mt-2">{firebaseError}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="mt-6 w-4/5 md:w-3/4 text-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg shadow-xl hover:shadow-emerald-500/50 transition-all duration-300"
          >
            {formik.isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>

          {successMessage && (
            <p className="text-green-400 font-medium mt-4">{successMessage}</p>
          )}
        </form>

        <p className="text-gray-400 text-base mt-8">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-400 hover:underline font-semibold"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../../firebase"; // ✅ Make sure path is correct

// export const Signup = () => {
//   const navigate = useNavigate();

//   // Form state
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   // Message states
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");
//     setSuccessMessage("");

//     // ✅ Basic form validation
//     if (!fullName || !email || !password || !confirmPassword) {
//       setErrorMessage("Please fill in all fields.");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setErrorMessage("Passwords do not match.");
//       return;
//     }

//     if (password.length < 6) {
//       setErrorMessage("Password must be at least 6 characters.");
//       return;
//     }

//     try {
//       // ✅ Create user with Firebase
//       await createUserWithEmailAndPassword(auth, email, password);
//       setSuccessMessage("✅ Account created successfully!");

//       // Clear form
//       setFullName("");
//       setEmail("");
//       setPassword("");
//       setConfirmPassword("");

//       // Redirect after short delay
//       setTimeout(() => navigate("/dashboard"), 1500);
//     } catch (error) {
//       console.error("Signup error:", error);
//       setErrorMessage(error.message);
//     }
//   };

//   return (
//     <div className="text-white bg-gray-900 min-h-screen flex justify-center items-center">
//       <div className="bg-gray-800/60 border border-gray-700 shadow-xl shadow-emerald-500/10 rounded-2xl p-10 w-full max-w-lg backdrop-blur-md text-center transition-transform hover:scale-105 hover:shadow-emerald-500/30">
//         <h1 className="flex justify-center text-4xl md:text-5xl font-extrabold text-emerald-500 space-x-3 mb-8 tracking-wide">
//           <span>Signup</span>
//           <span className="text-white">Page</span>
//         </h1>

//         <form onSubmit={handleSubmit} className="flex flex-col items-center w-full space-y-6">
//           {/* Full Name */}
//           <div className="w-4/5 md:w-3/4 text-left">
//             <label className="text-base text-gray-300 mb-2 block font-medium">
//               Full Name
//             </label>
//             <input
//               type="text"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               placeholder="Enter your full name"
//               className="w-full text-lg p-3 rounded-lg border border-gray-700 bg-gray-100 text-black focus:outline-none focus:ring-4 focus:ring-emerald-500/50 shadow-inner transition-all duration-200"
//             />
//           </div>

//           {/* Email */}
//           <div className="w-4/5 md:w-3/4 text-left">
//             <label className="text-base text-gray-300 mb-2 block font-medium">
//               Email Address
//             </label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               className="w-full text-lg p-3 rounded-lg border border-gray-700 bg-gray-100 text-black focus:outline-none focus:ring-4 focus:ring-emerald-500/50 shadow-inner transition-all duration-200"
//             />
//           </div>

//           {/* Password */}
//           <div className="w-4/5 md:w-3/4 text-left">
//             <label className="text-base text-gray-300 mb-2 block font-medium">
//               Password
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter your password"
//               className="w-full text-lg p-3 rounded-lg border border-gray-700 bg-gray-100 text-black focus:outline-none focus:ring-4 focus:ring-emerald-500/50 shadow-inner transition-all duration-200"
//             />
//           </div>

//           {/* Confirm Password */}
//           <div className="w-4/5 md:w-3/4 text-left">
//             <label className="text-base text-gray-300 mb-2 block font-medium">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="Confirm your password"
//               className="w-full text-lg p-3 rounded-lg border border-gray-700 bg-gray-100 text-black focus:outline-none focus:ring-4 focus:ring-emerald-500/50 shadow-inner transition-all duration-200"
//             />
//           </div>

//           {/* Error message */}
//           {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

//           {/* Success message */}
//           {successMessage && <p className="text-green-400 font-medium mt-4">{successMessage}</p>}

//           {/* Submit button */}
//           <button
//             type="submit"
//             className="mt-6 w-4/5 md:w-3/4 text-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg shadow-xl hover:shadow-emerald-500/50 transition-all duration-300"
//           >
//             Sign Up
//           </button>
//         </form>

//         <p className="text-gray-400 text-base mt-8">
//           Already have an account?{" "}
//           <Link to="/login" className="text-emerald-400 hover:underline font-semibold">
//             Log in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };
// export default Signup;
