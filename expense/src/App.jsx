import "./App.css";
import { useEffect } from "react";
import { Landing } from "./Landing/Landing";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./components/Login/login";
import { Signup } from "./components/Signup/signup";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { AddIncome } from "./components/AddIncome/addincome";
import { AddExpense } from "./components/AddExpense/addexpense";
import { Report } from "./components/Report/report";
import { Addcategory } from "./components/AddCategory/addcategory";
import useStore from "./useStore";
import { auth } from "./firebase";

function App() {
  const fetchUserData = useStore((s) => s.fetchUserData);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user.uid);
      }
    });
    return () => unsub();
  }, [fetchUserData]);

  return (
    <Router>
      <Routes>
        <Route path="/category" element={<Addcategory />} />
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addincome" element={<AddIncome />} />
        <Route path="/addexpense" element={<AddExpense />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;
