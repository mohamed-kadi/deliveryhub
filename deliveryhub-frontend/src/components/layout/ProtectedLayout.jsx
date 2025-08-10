import React from "react";
import Navbar from "./Navbar";

const ProtectedLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main style={{ padding: "20px" }}>{children}</main>
    </div>
  );
};

export default ProtectedLayout;
