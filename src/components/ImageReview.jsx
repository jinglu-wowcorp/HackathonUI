import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const feedbackOptions = [
  { label: "Price Match", value: "price" },
  { label: "Date Validated", value: "date" },
  { label: "Item Match", value: "item" },
  { label: "Other", value: "other" }
];

const ImageReview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState([]);
  const [otherText, setOtherText] = useState("");

  // Extract API data passed from the form
  const apiResult = state?.apiResult || {};
  
  // Try to find the base64 string in various common payload structures
  let base64String = null;
  if (apiResult) {
    if (apiResult.generated_assets?.image_base64) {
      base64String = apiResult.generated_assets.image_base64;
    } else if (apiResult.image_base64) {
      base64String = apiResult.image_base64;
    } else if (apiResult.data?.image_base64) {
      base64String = apiResult.data.image_base64;
    }
  }

  // Ensure the string has the data URI prefix so the browser can render it
  const imgSrc = base64String 
    ? (base64String.startsWith('data:image') ? base64String : `data:image/jpeg;base64,${base64String}`)
    : null;

  const handleCheckbox = (value) => {
    setFeedback((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "2rem", background: "#f8f9fa", borderRadius: 12 }}>
      <h2>Review AI Generated Image</h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem", alignItems: "center" }}>
        {imgSrc ? (
          <div style={{ textAlign: "center", width: "100%" }}>
            <h4 style={{ color: "#4a5568", marginBottom: "1rem" }}>Generated Promotion Asset</h4>
            <img 
              src={imgSrc} 
              alt="AI Generated Promotion" 
              style={{ maxWidth: "100%", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", border: "1px solid #e2e8f0" }} 
            />
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "3rem", background: "#e2e8f0", borderRadius: 8, width: "100%" }}>
            <p style={{ color: "#4a5568", margin: 0 }}>No image data was received from the server.</p>
            <button 
              onClick={() => navigate("/")}
              style={{ marginTop: "1rem", padding: "0.5rem 1rem", background: "#3182ce", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
            >
              Go Back
            </button>
          </div>
        )}
      </div>

      {imgSrc && (
        <>
          <div style={{ marginTop: "2rem", background: "#fff", padding: "1.5rem", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <h3 style={{ marginTop: 0, color: "#2d3748" }}>Feedback (before regenerate)</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {feedbackOptions.map(opt => (
                <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "#4a5568" }}>
                  <input
                    type="checkbox"
                    checked={feedback.includes(opt.value)}
                    onChange={() => handleCheckbox(opt.value)}
                    style={{ width: "1.1rem", height: "1.1rem" }}
                  />
                  {opt.label}
                </label>
              ))}
              {feedback.includes("other") && (
                <textarea
                  placeholder="Please provide additional feedback..."
                  value={otherText}
                  onChange={e => setOtherText(e.target.value)}
                  style={{ marginTop: "0.5rem", minHeight: 80, borderRadius: 6, border: "1px solid #cbd5e0", padding: "0.75rem", fontFamily: "inherit" }}
                />
              )}
            </div>
          </div>

          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button style={{ padding: "0.75rem 2rem", background: "#3182ce", color: "#fff", border: "none", borderRadius: 6, fontSize: "1rem", fontWeight: "600", cursor: "pointer", transition: "background 0.2s" }}>
              Save Promotion
            </button>
            <button style={{ padding: "0.75rem 2rem", background: "#ed8936", color: "#fff", border: "none", borderRadius: 6, fontSize: "1rem", fontWeight: "600", cursor: "pointer", transition: "background 0.2s" }}>
              Regenerate
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageReview;