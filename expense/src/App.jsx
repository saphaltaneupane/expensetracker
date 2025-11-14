import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Landing } from "./Landing/Landing";
import { Login } from "./components/Login/login";
import { Signup } from "./components/Signup/signup";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { AddIncome } from "./components/AddIncome/addincome";
import { AddExpense } from "./components/AddExpense/addexpense";
import { Report } from "./components/Report/report";
import { Addcategory } from "./components/AddCategory/addcategory";
import useAuthInit from "./useAuthInit";

function App() {
  const initialized = useAuthInit();

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          <p className="mt-4 text-gray-700 text-lg">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addincome" element={<AddIncome />} />
        <Route path="/addexpense" element={<AddExpense />} />
        <Route path="/report" element={<Report />} />
        <Route path="/category" element={<Addcategory />} />
      </Routes>
    </Router>
  );
}

export default App;
