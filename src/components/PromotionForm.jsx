import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PromotionForm.css";

// Static article list with IDs and categories
const articles = [
  { id: "ART-001", name: "Running Shoes", category: "Footwear" },
  { id: "ART-002", name: "Cotton T-Shirt", category: "Apparel" },
  { id: "ART-003", name: "Yoga Mat", category: "Equipment" },
  { id: "ART-004", name: "Water Bottle", category: "Accessories" },
  { id: "ART-005", name: "Protein Powder", category: "Nutrition" }
];

const PromotionForm = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    description: "",
    promotionType: "standard",
    discountType: "percentage",
    discount: "",
    startDate: "",
    endDate: "",
    articleId: "" // Stores the selected article's ID
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    setForm(prev => ({ ...prev, articleId: "" })); // Reset selection on filter change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Prepare API Data Payload
    const apiPayload = {
      description: form.description,
      promotion_type: form.promotionType,
      start_date: form.startDate,
      end_date: form.endDate,
      percentage: form.discountType === "percentage" ? Number(form.discount) : 0,
      price: form.discountType === "fixed" ? Number(form.discount) : 0,
      article_id: form.articleId // Passing the selected Article ID
    };

    try {
      const response = await fetch("https://promogen-73298798964.us-central1.run.app/process-promotion/1", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiPayload)
      });

      if (response.ok) {
        // Success: Go to review page
        navigate("/review");
      } else {
        // API returned an error (e.g., 400, 500)
        const errorData = await response.json().catch(() => ({}));
        // Show the exact JSON error returned by the API for debugging
        setError(`API Error (${response.status}): ${JSON.stringify(errorData)}`);
      }
    } catch (err) {
      // Network error
      setError(`Network error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const uniqueCategories = [...new Set(articles.map(a => a.category))];
  const filteredArticles = (selectedCategory === "" || selectedCategory === "None")
    ? articles
    : articles.filter(a => a.category === selectedCategory);

  return (
    <form className="promotion-form" onSubmit={handleSubmit}>
      <h2>Create Promotion</h2>
      
      {error && (
        <div style={{ 
          color: "#721c24", 
          backgroundColor: "#f8d7da", 
          border: "1px solid #f5c6cb", 
          padding: "0.75rem 1.25rem", 
          marginBottom: "1rem", 
          borderRadius: "4px",
          wordBreak: "break-all",
          fontSize: "0.9rem"
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <label>
        Description
        <textarea name="description" value={form.description} onChange={handleChange} required />
      </label>

      <label>
        Promotion Type
        <select name="promotionType" value={form.promotionType} onChange={handleChange}>
          <option value="standard">Standard</option>
          <option value="Multi buy">Multi buy</option>
          <option value="seasonal">Seasonal</option>
          <option value="clearance">Clearance</option>
        </select>
      </label>

      <label>
        Discount Type
        <select name="discountType" value={form.discountType} onChange={handleChange}>
          <option value="percentage">Percentage (%)</option>
          <option value="fixed">Fixed Amount ($)</option>
        </select>
      </label>

      <label>
        Discount Value
        <input
          name="discount"
          type="number"
          min="0"
          step="any"
          value={form.discount}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Start Date
        <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
      </label>

      <label>
        End Date
        <input name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
      </label>
      
      <label>
        Filter by Category
        <select value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">None / All</option>
          {uniqueCategories.map((category, idx) => (
            <option key={idx} value={category}>{category}</option>
          ))}
        </select>
      </label>

      <label>
        Article
        <select
          name="articleId"
          value={form.articleId}
          onChange={handleChange}
          required
        >
          <option value="" disabled>-- Select an Article --</option>
          {filteredArticles.map((article) => (
            <option key={article.id} value={article.id}>
              {article.name}
            </option>
          ))}
        </select>
      </label>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Add Promotion"}
      </button>
    </form>
  );
};

export default PromotionForm;