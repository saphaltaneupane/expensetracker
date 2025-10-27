import React from "react";

export const Login = () => {
  return (
    <div className="text-white bg-gray-900 min-h-screen flex justify-center items-center">
      <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-8 w-full max-w-md backdrop-blur-md text-center">
        <h1 className="flex justify-center text-3xl md:text-4xl font-extrabold text-emerald-500 space-x-2 mb-6">
          <span>Login</span>
          <span className="text-white">Page</span>
        </h1>

        <form className="flex flex-col items-center w-full">
          <input
            type="text"
            placeholder="Username"
            className="w-3/4 md:w-2/3 p-2 rounded-lg border border-gray-700 bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
          />
          <input
            type="password"
            placeholder=" Password"
            className="w-3/4 md:w-2/3 p-2 rounded-lg border border-gray-700 bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
          />
        </form>
        {/* loginn */}
      </div>
    </div>
  );
};
