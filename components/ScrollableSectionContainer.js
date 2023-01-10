import React from "react";

export default function ScrollableSectionContainer({ className, children }) {
  return (
    <div
      className={`h-100 d-flex flex-column gap-2 pb-5 ${className}`}
      style={{ overflowY: "auto" }}
    >
      {children}
      <div className="p-2"></div>
    </div>
  );
}
