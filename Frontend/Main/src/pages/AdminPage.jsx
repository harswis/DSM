import React from "react";


export default function AdminPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#f4f8fb", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header
        style={{
          background: "linear-gradient(90deg,#2196f3 0%,#00bcd4 100%)",
          color: "#fff",
          padding: "2.2rem 0 1rem 0",
          borderBottomLeftRadius: "60px 30px",
          borderBottomRightRadius: "60px 30px",
          textAlign: "center",
        }}
      >
        <img src="/assets/nectar-logo.png" alt="Nectar Infotel" style={{ height: 38, marginRight: 12, verticalAlign: "middle" }} />
        <span style={{ fontSize: "2.2rem", fontWeight: 700, verticalAlign: "middle" }}>Nectar Infotel</span>
        <h2 style={{ margin: "1.2rem 0 0.3rem 0", fontWeight: 700, fontSize: "2.1rem" }}>
          Admin Dashboard
        </h2>
      </header>

      {/* Main content (empty for now) */}
      <main style={{ flex: 1 }}></main>

      {/* Footer */}
      <footer
        style={{
          background: "#2196f3",
          color: "#fff",
          textAlign: "center",
          padding: "0.9rem 0",
          borderTopLeftRadius: "60px 30px",
          borderTopRightRadius: "60px 30px",
        }}
      >
        © {new Date().getFullYear()} Nectar Infotel. All rights reserved.
      </footer>
    </div>
  );
}
