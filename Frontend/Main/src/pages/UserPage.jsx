import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { fetchUserSubmissions } from "../utils/upload";
import "./UserPage.css";

const DOCUMENTS = [
  { key: "fhr", label: "FHR" },
  { key: "fvr", label: "FVR" },
  { key: "glsr", label: "GLSR" },
  { key: "gtr", label: "GTR" },
  { key: "pacs", label: "PACS Balance Sheet" },
  { key: "dct2", label: "DCT-2" },
];

export default function UserPage() {
  const [uploaded, setUploaded] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // This function fetches the user's submissions and updates the table
  const refreshUploads = useCallback(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    fetchUserSubmissions(userId)
      .then((data) => {
        const uploadedDocs = {};
        data.forEach((doc) => {
          uploadedDocs[doc.documentType] = doc.filePath || doc.fileUrl;
        });
        setUploaded(uploadedDocs);
        data.forEach((doc) => {
          uploadedDocs[doc.documentType] = doc; // Store the whole doc, not just filePath
           });
        })
      .catch((error) => {
        console.error("Error fetching submissions:", error);
      });
  }, []);

  useEffect(() => {
    refreshUploads();
    // Listen for a custom event to refresh uploads after a successful upload
    const handler = () => refreshUploads();
    window.addEventListener("uploadSuccess", handler);
    return () => window.removeEventListener("uploadSuccess", handler);
  }, [refreshUploads]);

    const handleSidebarToggle = () => setSidebarOpen((open) => !open);

      const handleDeleteFile = async (id, docKey) => {
      if (!window.confirm("Are you sure you want to delete this file?")) return;
      try {
            await fetch(`http://localhost:5000/api/submissions/delete/${id}`, {
            method: "DELETE",
           credentials: "include"
    });
    // Remove from UI
      setUploaded((prev) => {
       const updated = { ...prev };
       delete updated[docKey];
       return updated;
      });
  } catch (err) {
    alert("Failed to delete file.");
  }
};
 

  return (
    <div className="user-layout">
      <Navbar onSidebarToggle={handleSidebarToggle} />
      <div className="user-main">
        <Sidebar expanded={sidebarOpen} onToggle={handleSidebarToggle} />
        <div className="user-content table-split">
          <div className="left-blank"></div>
          <div className="right-table">
            <h2 className="table-title">Document Status</h2>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    
                    <th>Document Uploaded</th>
                    <th>File Name</th>
                    <th>Document Submitted Successfully</th>
                    <th>Admin Approval</th>
                    <th>Delete File</th>
                  </tr>
                </thead>
                <tbody>
                  {DOCUMENTS.map((doc) => (
                    <tr key={doc.key}>
                      {/* Document Uploaded */}
                      <td>
                        {uploaded[doc.key] ? (
                          <span style={{ color: "#43a047", fontWeight: 600 }}>
                            {doc.label} uploaded
                          </span>
                        ) : (
                          <span className="not-uploaded">
                            {doc.label} not uploaded
                          </span>
                        )}
                       </td>
                    {/* File Name */}
                     <td>
                      {uploaded[doc.key]?.originalName || ""}
                     </td>
                      {/* Document Submitted Successfully*/}
                      <td>
                        {uploaded[doc.key] ? (
                          <span className="status-success">Yes</span>
                        ) : (
                          <span className="status-failed">No</span>
                        )}
                      </td>
                      {/*Admin Approval  */}
                      <td>
                        <span className="admin-approval">Pending</span>
                      </td>
                       {/* Delete File */}
                      <td>
                      {uploaded[doc.key] && (
                       <button
                       className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteFile(uploaded[doc.key]._id, doc.key)}
                      >
                     Delete
                   </button>
                   )}
                    </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
