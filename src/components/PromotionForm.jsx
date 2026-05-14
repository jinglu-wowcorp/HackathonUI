import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PromotionForm.css";

// Static article list with categories (replace with MongoDB data later)
const articles = [
  { id: 1, name: "Running Shoes", category: "Footwear" },
  { id: 2, name: "Cotton T-Shirt", category: "Apparel" },
  { id: 3, name: "Yoga Mat", category: "Equipment" },
  { id: 4, name: "Water Bottle", category: "Accessories" },
  { id: 5, name: "Protein Powder", category: "Nutrition" }
];

const PromotionForm = ({ onAddPromotion }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [form, setForm] = useState({
    description: "",
    promotionType: "standard",
    discountType: "percentage",
    discount: "",
    startDate: "",
    endDate: "",
    article: "" // single article
  });

  const handleChange = (e) => {
    const { name, value, multiple, options } = e.target;
    if (multiple) {
      // For multi-select (if any future fields need it)
      const selected = Array.from(options)
        .filter(option => option.selected)
        .map(option => option.value);
      setForm((prev) => ({ ...prev, [name]: selected }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.discount ||
      !form.startDate ||
      !form.endDate ||
      !form.article
    )
      return;
    if (onAddPromotion) {
      onAddPromotion(form);
    }
    setForm({
      description: "",
      promotionType: "standard",
      discountType: "percentage",
      discount: "",
      startDate: "",
      endDate: "",
      article: ""
    });
    setSelectedCategory("");
    // Navigate to review page
    navigate("/review");
  };

  // Get unique categories for the filter dropdown
  const uniqueCategories = [...new Set(articles.map(a => a.category))];

  // Filter articles based on the selected category dropdown
  const filteredArticles = selectedCategory 
    ? articles.filter(a => a.category === selectedCategory)
    : articles;

  // Handle category change, and reset article selection if the old article is filtered out
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    setForm(prev => ({ ...prev, article: "" })); // Clear article selection when category changes
  };

  return (
    <form className="promotion-form" onSubmit={handleSubmit}>
      <h2>Create Promotion</h2>
      <label>
        Description
        <textarea name="description" value={form.description} onChange={handleChange} />
      </label>
      <label>
        Promotion Type
        <select name="promotionType" value={form.promotionType} onChange={handleChange}>
          <option value="standard">Standard</option>
          <option value="bogo">Buy One Get One</option>
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
        Discount
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
          <option value="">All Categories</option>
          {uniqueCategories.map((category, idx) => (
            <option key={idx} value={category}>{category}</option>
          ))}
        </select>
      </label>

      <label>
        Article
        <select
          name="article"
          value={form.article}
          onChange={handleChange}
          required
        >
          <option value="" disabled>-- Select an Article --</option>
          {filteredArticles.map((article) => (
            <option key={article.id} value={article.name}>
              {article.name}
            </option>
          ))}
        </select>
      </label>
      
      <button type="submit">Add Promotion</button>
    </form>
  );
};

export default PromotionForm;