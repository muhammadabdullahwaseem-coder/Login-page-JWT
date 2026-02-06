import React, { useState } from "react";
import { Routes, Route, useLocation, Link, Navigate } from "react-router-dom";
import Header from "./comp/header/header";
import "./App.css";

import Signup from "./comp/signup/signup";
import Login from "./comp/login/login";
import Dashboard from "./comp/dashbord/dashboard";
import ForgetPassword from "./comp/forgetpw/ForgotPassword";

function App() {
  const location = useLocation();

  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  const isRegister = location.pathname === "/register";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const isForgotPwPage = location.pathname === "/forgot-password";

  return (
    <div className={`app-wrapper ${theme}`}>
      
      {!isForgotPwPage && (
        <Header theme={theme} toggleTheme={toggleTheme} />
      )}

      {isAuthPage ? (
        <div className="auth-body">
          <div className={`auth-container ${isRegister ? "right-panel-active" : ""}`}>
            
            <div className="form-container sign-up-container">
              <Signup />
            </div>
            <div className="form-container sign-in-container">
              <Login />
            </div>

            <div className="overlay-container">
              <div className="overlay">
                <div className="overlay-panel overlay-left">
                  <h1>Welcome Back!</h1>
                  <p className="ww">Access your Galaxy Dashboard</p>
                  <Link to="/login">
                    <button className="ghost-btn">Sign In</button>
                  </Link>
                </div>
                <div className="overlay-panel overlay-right">
                  <h1 className="ww">Hello, Traveler!</h1>
                  <p className="ww">Join the Galaxy journey</p>
                  <Link to="/register">
                    <button className="ghost-btn">Sign Up</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
        </Routes>
      )}
    </div>
  );
}

export default App;