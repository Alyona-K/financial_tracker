import React from "react";
import "./Loader.css";

export const Loader: React.FC = () => {
  return (
    <div className="loader" role="status" aria-label="loading">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};
