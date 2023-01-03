import React from "react";
import { BsInfoCircle } from "react-icons/bs";

export default function Tooltip({
  title = <BsInfoCircle />,
  description,
  titlePrimary,
  ...others
}) {
  return (
    <a
      href="#"
      className="position-relative am-tooltip"
      onClick={(e) => e.preventDefault()}
    >
      <span className={titlePrimary ? "text-primary" : ""}>{title}</span>
      {description && (
        <span
          className="position-absolute am-tooltip-d caption2 bg-gray-800 p-2 rounded-2"
          {...others}
        >
          {description}
        </span>
      )}
    </a>
  );
}
