import React from "react";
import { Stack } from "react-bootstrap";

export default function ScrollableSectionContainer({ className, children }) {
  return (
    <Stack className={`h-100 pb-5 overflow-y-auto ${className}`} gap={2}>
      {children}
      <div className="p-2"></div>
    </Stack>
  );
}
