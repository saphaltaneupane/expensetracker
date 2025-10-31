import "./App.css";
import { Landing } from "./Landing/Landing";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./components/Login/login";
import { Signup } from "./components/Signup/signup";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { AddIncome } from "./components/AddIncome/addincome";
import { AddExpense } from "./components/AddExpense/addexpense";
import { Report } from "./components/Report/report";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addincome" element={<AddIncome />} />
        <Route path="/addexpense" element={<AddExpense />} />
        <Route path="/report" element={<report />} />
      </Routes>
    </Router>
  );
}

export default App;
