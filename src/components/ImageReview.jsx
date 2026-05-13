import React, { useState } from "react";

const staticImages = [
  { type: "Web Banner", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" },
  { type: "Social Post", url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80" },
  { type: "Product Image", url: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=300&q=80" }
];

const feedbackOptions = [
  { label: "Price Match", value: "price" },
  { label: "Date Validated", value: "date" },
  { label: "Item Match", value: "item" },
  { label: "Other", value: "other" }
];

const ImageReview = () => {
  const [feedback, setFeedback] = useState([]);
  const [otherText, setOtherText] = useState("");

  const handleCheckbox = (value) => {
    setFeedback((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "2rem", background: "#f8f9fa", borderRadius: 12 }}>
      <h2>Review AI Generated Images</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {staticImages.map((img, idx) => (
          <div key={idx} style={{ textAlign: "center" }}>
            <h4>{img.type}</h4>
            <img src={img.url} alt={img.type} style={{ maxWidth: "100%", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }} />
          </div>
        ))}
      </div>
      {/* Feedback Section */}
      <div style={{ marginTop: "2rem", background: "#fff", padding: "1rem", borderRadius: 8 }}>
        <h3>Feedback (before regenerate)</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {feedbackOptions.map(opt => (
            <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={feedback.includes(opt.value)}
                onChange={() => handleCheckbox(opt.value)}
              />
              {opt.label}
            </label>
          ))}
          {feedback.includes("other") && (
            <textarea
              placeholder="Please provide additional feedback"
              value={otherText}
              onChange={e => setOtherText(e.target.value)}
              style={{ marginTop: "0.5rem", minHeight: 60, borderRadius: 6, border: "1px solid #cbd5e0", padding: "0.5rem" }}
            />
          )}
        </div>
      </div>
      {/* Buttons */}
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button style={{ padding: "0.7rem 2rem", background: "#3182ce", color: "#fff", border: "none", borderRadius: 6, fontSize: "1rem", cursor: "pointer" }}>
          Save
        </button>
        <button style={{ padding: "0.7rem 2rem", background: "#f59e42", color: "#fff", border: "none", borderRadius: 6, fontSize: "1rem", cursor: "pointer" }}>
          Regenerate
        </button>
      </div>
    </div>
  );
};

export default ImageReview;