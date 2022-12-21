import React from "react";
import { GoInfo } from "react-icons/go";

export default function Tooltip({
  title = <GoInfo />,
  description,
  ...others
}) {
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
