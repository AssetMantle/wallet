import React from "react";

export default function ScrollableSectionContainer({ className, children }) {
  return (
    <div
      className={`am-scroll-section h-100 d-flex flex-column gap-2 pb-5 ${className}`}
    >
      {children}
      <div className="p-2"></div>
    </div>
  );
}
