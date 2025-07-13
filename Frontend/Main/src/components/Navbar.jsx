import React from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";

export default function Navbar({ onSidebarToggle }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3 d-flex align-items-center">
      {/* Hamburger icon triggers the sidebar */}
      <button
        className="btn btn-link text-white me-3"
        style={{ fontSize: "1.7rem" }}
        onClick={onSidebarToggle}
        aria-label="Toggle sidebar"
      >
        <FaBars />
      </button>
      {/* Logo and brand */}
      <img src="/assets/nectar-logo.png" alt="Logo" height={32} className="me-2" />
      <span className="navbar-brand mb-0 h1">Nectar Infotel</span>
      {/* User icon on the right */}
      <div className="ms-auto">
        <FaUserCircle size={28} className="text-white" />
      </div>
    </nav>
  );
}
