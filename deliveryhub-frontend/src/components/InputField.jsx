// src/components/InputField.jsx
import React from "react";

const InputField = ({ label, type = "text", name, value, onChange }) => {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        name={name}           // ✅ MUST be included
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputField;
