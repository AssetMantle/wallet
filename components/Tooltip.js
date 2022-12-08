import React from "react";

export default function Tooltip({ title, description, ...others }) {
  return (
    <div className="position-relative am-tooltip">
      {title}
      {description && (
        <p
          className="position-absolute am-tooltip-d caption2 bg-gray-800 p-2 rounded-2"
          {...others}
        >
          {description}
        </p>
      )}
    </div>
  );
}
