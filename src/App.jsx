import React from "react";
import { Routes, Route } from "react-router-dom";
import PromotionForm from "./components/PromotionForm";
import ImageReview from "./components/ImageReview";

const App = () => {
  const handleAddPromotion = (data) => {
    console.log("Promotion added:", data);
  };

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<PromotionForm onAddPromotion={handleAddPromotion} />} />
        <Route path="/review" element={<ImageReview />} />
      </Routes>
    </div>
  );
};

export default App;