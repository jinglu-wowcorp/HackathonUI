import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PromotionForm.css";

const API_BASE_URL = "https://promogen-73298798964.us-central1.run.app";

const PromotionForm = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({
    description: "",
    promotionType: "Sweet Save",
    discountType: "percentage",
    discount: "",
    startDate: "",
    endDate: "",
    articleId: ""
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const result = await response.json();
        if (result.status === "success" || result.data) {
          setCategories(result.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch articles when category changes or on mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const url = selectedCategory && selectedCategory !== ""
          ? `${API_BASE_URL}/articles/category/${selectedCategory}`
          : `${API_BASE_URL}/articles`;
        
        const response = await fetch(url);
        const result = await response.json();
        if (result.status === "success" || result.data) {
          setArticles(result.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      }
    };
    fetchArticles();
  }, [selectedCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    setForm(prev => ({ ...prev, articleId: "" })); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Generate a unique promotion ID using timestamp + random suffix
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-:T]/g, "").split(".")[0]; // YYYYMMDDHHMMSS
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const uniquePromoId = `PROMO-${timestamp}-${randomSuffix}`;

    // Prepare API Data Payload matching your curl example exactly
    const apiPayload = {
      promotion_id: uniquePromoId, 
      start_date: form.startDate,
      end_date: form.endDate,
      promotion_type: form.promotionType,
      description: form.description || "No description",
      price: form.discountType === "fixed" ? Number(form.discount) : 0,
      percentage: form.discountType === "percentage" ? Number(form.discount) : 0
    };

    console.log("Submitting Payload:", apiPayload);

    try {
      // Use the articleId in the URL path as requested
      const response = await fetch(`${API_BASE_URL}/process-promotion/${form.articleId}`, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiPayload)
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        console.log("Success:", result);
        navigate("/review", { state: { apiResult: result } });
      } else {
        // Show detailed error if the API fails
        setError(`API Error (${response.status}): ${JSON.stringify(result)}`);
      }
    } catch (err) {
      setError(`Network error: ${err.message}. Please check your connection.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-wrapper">
      <form className={`promotion-form ${isSubmitting ? "form-loading" : ""}`} onSubmit={handleSubmit}>
        <h2>Create Promotion</h2>
        
        {error && (
          <div className="error-banner">
            <strong>Submission Failed</strong>
            <p>{error}</p>
          </div>
        )}

        <fieldset disabled={isSubmitting} style={{ border: "none", padding: 0, margin: 0 }}>
          <label>
            Description
            <textarea 
              name="description" 
              placeholder="e.g. Buy 2 get 1 free on selected snacks"
              value={form.description} 
              onChange={handleChange} 
              required 
            />
          </label>

          <label>
            Promotion Type
            <select name="promotionType" value={form.promotionType} onChange={handleChange}>
              <option value="Sweet Save">Sweet Save</option>
              <option value="Member Price">Member Price</option>
              <option value="Multi buy">Multi buy</option>
            </select>
          </label>

          <div className="form-row">
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
                placeholder="e.g. 11"
                value={form.discount} 
                onChange={handleChange} 
                required 
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Start Date
              <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
            </label>

            <label>
              End Date
              <input name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
            </label>
          </div>
          
          <label>
            Filter by Category
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">-- All Categories --</option>
              {categories.map((cat, idx) => {
                const catId = cat.CategoryID || cat.categoryId || cat._id || `cat-${idx}`;
                const catName = cat.Category || cat.CategoryName || "Unknown Category";
                return (
                  <option key={catId} value={catId}>
                    {catName}
                  </option>
                );
              })}
            </select>
          </label>

          <label>
            Article
            <select name="articleId" value={form.articleId} onChange={handleChange} required>
              <option value="" disabled>-- Select an Article --</option>
              {articles.map((article, idx) => {
                const artId = article.Article_Id || article.article_id || article._id || `art-${idx}`;
                const artName = article.Article_Name || article.article_name || "Unknown Article";
                return (
                  <option key={artId} value={artId}>
                    {artName}
                  </option>
                );
              })}
            </select>
          </label>
          
          <button 
            type="submit" 
            className={`submit-btn ${isSubmitting ? "btn-processing" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading-content">
                <span className="spinner"></span> Processing...
              </span>
            ) : (
              "Add Promotion"
            )}
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default PromotionForm;