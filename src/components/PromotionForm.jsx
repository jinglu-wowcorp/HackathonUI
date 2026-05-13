import React, { useState } from "react";
import "./PromotionForm.css";

// Static product list (replace with MongoDB data later)
const products = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
  { id: 3, name: "Milk" },
  { id: 4, name: "Bread" },
  { id: 5, name: "Eggs" }
];

const PromotionForm = ({ onAddPromotion }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "percentage",
    discount: "",
    startDate: "",
    endDate: "",
    products: [] // multiple products
  });

  const handleChange = (e) => {
    const { name, value, multiple, options } = e.target;
    if (multiple) {
      // For multi-select
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
      !form.title ||
      !form.discount ||
      !form.startDate ||
      !form.endDate ||
      form.products.length === 0
    )
      return;
    onAddPromotion(form);
    setForm({
      title: "",
      description: "",
      type: "percentage",
      discount: "",
      startDate: "",
      endDate: "",
      products: []
    });
  };

  return (
    <form className="promotion-form" onSubmit={handleSubmit}>
      <h2>Create Promotion</h2>
      <label>
        Title
        <input name="title" value={form.title} onChange={handleChange} required />
      </label>
      <label>
        Description
        <textarea name="description" value={form.description} onChange={handleChange} />
      </label>
      <label>
        Type
        <select name="type" value={form.type} onChange={handleChange}>
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
        Products
        <select
          name="products"
          multiple
          value={form.products}
          onChange={handleChange}
          required
          style={{ height: "100px" }}
        >
          {products.map((product) => (
            <option key={product.id} value={product.name}>
              {product.name}
            </option>
          ))}
        </select>
        <small>Hold Ctrl (Windows) or Cmd (Mac) to select multiple</small>
      </label>
      <button type="submit">Add Promotion</button>
    </form>
  );
};

export default PromotionForm;