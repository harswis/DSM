import React, { useRef, useState } from "react";
import axios from "axios";
import { FaUpload, FaTimes } from "react-icons/fa";
import "./UploadModal.css";

export default function UploadModal({
  show,
  onClose,
  title = "Upload File",
  documentType = "general",
  description = "Select a file to upload",
  nested,
  mode = "upload",
  onDCT1,
  onDCT2
}) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleBrowse = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File type validation (matches your new logic)
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!validTypes.includes(file.type)) {
      setMessage("Invalid file type. Please upload PDF, Excel, or Word files.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a file first.");
      return;
    }

    setUploading(true);
    setMessage("Uploading...");

    const formData = new FormData();
    formData.append("file", selectedFile);

    // Add the current user's ID from localStorage
    const userId = localStorage.getItem("userId");
    if (userId) {
      formData.append("user", userId);
    } else {
      setMessage("User not found. Please log in again.");
      setUploading(false);
      return;
    }

    // You may add a default documentType if your backend requires it
    formData.append("documentType", documentType);
    

    try {
      const baseURL = window.location.origin.includes('localhost:5173') 
        ? 'http://localhost:5000' 
        : '';
      const response = await axios.post(
        `${baseURL}/api/submissions/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        }
      );
      setMessage("File uploaded successfully!");
      window.dispatchEvent(new Event("uploadSuccess"));
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      } 
      setTimeout(() => {
        if (!nested) onClose();
      }, 2000);
    } catch (error) {
      let errorMessage = "Failed to upload file.";
      if (error.response) {
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      setMessage(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  if (!show) return null;

  return (
    <div className={nested ? "" : "upload-modal-backdrop"}>
      <div className="upload-modal-box">
        {!nested && (
          <button className="upload-modal-close" onClick={onClose} aria-label="Close">
            <FaTimes size={22} />
          </button>
        )}
        {mode === "upload" && (
          <>
            <div className="upload-modal-icon">
              <FaUpload size={48} />
            </div>
            <h4 className="upload-modal-title">{title}</h4>
            <p className="upload-modal-desc">{description}</p>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              disabled={uploading}
            />
            <div className="upload-modal-actions">
              <button 
                className="upload-browse-btn" 
                onClick={handleBrowse}
                disabled={uploading}
              >
                Browse
              </button>
              <button
                className="upload-upload-btn"
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            {selectedFile && (
              <div style={{ marginTop: "0.5rem", color: "#1976d2" }}>
                Selected: {selectedFile.name}
              </div>
            )}
            {message && (
              <div style={{ marginTop: "0.7rem", color: message.includes("success") ? "#43a047" : "#e53935" }}>
                {message}
              </div>
            )}
          </>
        )}
        {mode === "pacs" && (
          <>
            <h4 className="upload-modal-title">{title || "PACS Balance Sheet"}</h4>
            <p className="upload-modal-desc">
              {description || "Choose an option to upload:"}
            </p>
            <div className="button-container">
              <button onClick={onDCT1}>DCT-1</button>
              <button onClick={onDCT2}>DCT-2</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
