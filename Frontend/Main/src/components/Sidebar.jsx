import React, { useState } from "react";
import {
  FaFileMedical,    // FHR
  FaFileInvoice,    // FVR
  FaFileAlt,        // GLSR
  FaMapMarkedAlt,   // GTR
  FaBalanceScale,   // PACS
} from "react-icons/fa";
import UploadModal from "./UploadModal";
import "./Sidebar.css";

const sidebarOptions = [
  {
    key: "fhr",
    label: "FHR",
    icon: <FaFileMedical />,
    description: "Upload your File Health Record (FHR) document.",
  },
  {
    key: "fvr",
    label: "FVR",
    icon: <FaFileInvoice />,
    description: "Upload your File Verification Report (FVR) document.",
  },
  {
    key: "glsr",
    label: "GLSR",
    icon: <FaFileAlt />,
    description: "Upload your General Ledger Summary Report (GLSR).",
  },
  {
    key: "gtr",
    label: "GTR",
    icon: <FaMapMarkedAlt />,
    description: "Upload your Geo Tagging Report (GTR).",
  },
  {
    key: "pacs",
    label: "PACS Balance Sheet",
    icon: <FaBalanceScale />,
    description: "",
  },
];

export default function Sidebar({ expanded }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: "", description: "", documentType: "general" });
  const [showPacsOptions, setShowPacsOptions] = useState(false);
  const [showDCT2, setShowDCT2] = useState(false);

  // Handle all sidebar button clicks
  const handleOptionClick = (option) => {
    if (option.key === "pacs") {
      setShowPacsOptions(true);
    } else {
      setModalData({ 
        title: option.label, 
        description: option.description, 
        documentType: option.key // <-- Fix: pass the correct documentType
      });
      setModalOpen(true);
    }
  };

  const handleDCTClick = (type) => {
    if (type === "DCT-1") {
      setModalData({ title: "DCT-1", description: "Upload your DCT-1 document.", documentType: "dct1" });
      setModalOpen(true);
      setShowPacsOptions(false);
    } else if (type === "DCT-2") {
      setShowDCT2(true);
      setShowPacsOptions(false);
    }
  };

  const handleD12Upload = (file) => {
    if (file) alert(`You uploaded: ${file.name}`);
    setShowDCT2(false);
  };

  const handleUpload = (file) => {
    if (file) alert(`You uploaded: ${file.name}`);
    setModalOpen(false);
  };

  return (
    <>
      <aside className={`sidebar${expanded ? " expanded" : ""}`}>
        <ul className="sidebar-menu">
          {sidebarOptions.map((option) => (
            <li key={option.label} onClick={() => handleOptionClick(option)}>
              <span className="sidebar-icon">{option.icon}</span>
              {expanded && <span>{option.label}</span>}
            </li>
          ))}
        </ul>
      </aside>

      {/* Upload modal for FHR, FVR, GLSR, GTR, DCT-1 */}
      <UploadModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalData.title}
        description={modalData.description}
        documentType={modalData.documentType} // <-- Fix: pass the correct documentType
        onUpload={handleUpload}
      />

      {/* PACS Balance Sheet Modal */}
      {showPacsOptions && (
        <div className="upload-modal-backdrop">
          <div className="upload-modal-box">
            <button className="upload-modal-close" onClick={() => setShowPacsOptions(false)} aria-label="Close">
              ×
            </button>
            <h4 className="upload-modal-title">PACS Balance Sheet</h4>
            <p className="upload-modal-desc">Choose an option to upload:</p>
            <div className="button-container">
              <button onClick={() => handleDCTClick("DCT-1")}>DCT-1</button>
              <button onClick={() => handleDCTClick("DCT-2")}>DCT-2</button>
            </div>
          </div>
        </div>
      )}

      {/* DCT-2 Modal (D-12 Upload) */}
      {showDCT2 && (
        <div className="upload-modal-backdrop">
          <div className="upload-modal-box">
            <button className="upload-modal-close" onClick={() => setShowDCT2(false)} aria-label="Close">
              ×
            </button>
            <h4 className="upload-modal-title">DCT-2</h4>
            <p className="upload-modal-desc">Upload your D-12 document below:</p>
            <div className="button-container">
              <input
                type="file"
                id="d12-upload"
                style={{ display: "none" }}
                onChange={(e) => handleD12Upload(e.target.files[0])}
              />
              <button onClick={() => document.getElementById('d12-upload').click()}>
                Browse & Upload D-12
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
