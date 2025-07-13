import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AuthPage.css";

export default function AuthPage({ defaultTab }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/login";

  // State for form fields and feedback message
  const [loginPacsId, setLoginPacsId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerPacsName, setRegisterPacsName] = useState("");
  const [registerPacsId, setRegisterPacsId] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const API_BASE = "http://localhost:5000/api/auth";

  const switchTab = (tab) => {
    navigate(tab === "login" ? "/login" : "/register");
    setMessage("");
  };

  // --- UPDATED: Login handler with role-based redirect ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginPacsId,
          password: loginPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("userId", data.userId);
        setMessage("");
        // Redirect based on role
        if (data.role === "User") {
          navigate("/user");
        } else if (data.role === "Admin") {
          navigate("/admin");
        } else if (data.role === "SuperAdmin") {
          navigate("/superadmin");
        } else {
          setMessage("Unknown role. Contact support.");
        }
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  // Register handler 
  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerPassword !== registerConfirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    setMessage("Registering...");
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: registerPacsId,
          password: registerPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Registration successful! You can now log in.");
        setRegisterPacsName("");
        setRegisterPacsId("");
        setRegisterPassword("");
        setRegisterConfirmPassword("");
        navigate("/login");
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="auth-bg">
      <header className="auth-header">
        <div className="container">
          <div className="d-flex align-items-center py-3">
            <img
              src="/assets/nectar-logo.png"
              alt="Nectar Infotel"
              className="me-2"
              style={{ height: 32 }}
            />
            <span className="auth-title">Nectar Infotel</span>
          </div>
          <div className="text-center">
            <h2 className="auth-main-title">Submit Coopsindia Portal ID with Geotag</h2>
            <p className="auth-main-desc">
              Ensure PACS accuracy using Coopsindia Portal ID with Geotag
            </p>
          </div>
        </div>
      </header>
      <div className="auth-main-content">
        <div className="auth-card">
          <ul className="nav nav-pills nav-justified mb-3" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${isLogin ? "active" : ""}`}
                onClick={() => switchTab("login")}
                type="button"
                role="tab"
              >
                Login
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${!isLogin ? "active" : ""}`}
                onClick={() => switchTab("register")}
                type="button"
                role="tab"
              >
                Register
              </button>
            </li>
          </ul>
          <div className="tab-content">
            {isLogin ? (
              <div className="tab-pane fade show active">
                <h4 className="text-center mb-4 text-primary">Login</h4>
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-primary" htmlFor="loginPacsId">
                      Coopsindia PACS ID
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="loginPacsId"
                      placeholder="Enter your Coopsindia PACS ID"
                      autoComplete="username"
                      value={loginPacsId}
                      onChange={e => setLoginPacsId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-primary" htmlFor="loginPassword">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="loginPassword"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 fw-bold">
                    Login
                  </button>
                  <div className="text-center mt-3">
                    <span>Don't have an account? </span>
                    <a
                      href="#"
                      className="text-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        switchTab("register");
                      }}
                    >
                      Register here
                    </a>
                  </div>
                </form>
              </div>
            ) : (
              <div className="tab-pane fade show active">
                <h4 className="text-center mb-4 text-info">Register</h4>
                <form onSubmit={handleRegister}>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-info" htmlFor="registerPacsName">
                      PACS Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="registerPacsName"
                      placeholder="Enter PACS Name"
                      value={registerPacsName}
                      onChange={e => setRegisterPacsName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-info" htmlFor="registerPacsId">
                      Coopsindia PACS ID
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="registerPacsId"
                      placeholder="Enter your Coopsindia PACS ID"
                      value={registerPacsId}
                      onChange={e => setRegisterPacsId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-info" htmlFor="registerPassword">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="registerPassword"
                      placeholder="Create a password"
                      value={registerPassword}
                      onChange={e => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-info" htmlFor="registerConfirmPassword">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="registerConfirmPassword"
                      placeholder="Confirm your password"
                      value={registerConfirmPassword}
                      onChange={e => setRegisterConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-info w-100 fw-bold text-white">
                    Register
                  </button>
                  <div className="text-center mt-3">
                    <span>Already have an account? </span>
                    <a
                      href="#"
                      className="text-info"
                      onClick={(e) => {
                        e.preventDefault();
                        switchTab("login");
                      }}
                    >
                      Login here
                    </a>
                  </div>
                </form>
              </div>
            )}
            {message && (
              <div className="alert alert-info mt-3 text-center" role="alert">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="auth-footer">
        <div className="container text-center text-white py-2">
          © 2025 Nectar Infotel. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
