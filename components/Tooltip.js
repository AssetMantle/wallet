import React from "react";
import { BsInfoCircle } from "react-icons/bs";

export default function Tooltip({
  title = <BsInfoCircle />,
  description,
  titlePrimary,
  ...others
}) {
  return (
    <div className="position-relative am-tooltip">
      <span className={titlePrimary ? "text-primary" : ""}>{title}</span>
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
