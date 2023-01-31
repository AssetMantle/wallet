import React, { useEffect } from "react";

export default function ModalContainer({ active, children }) {
  useEffect(() => {
    active
      ? (document.querySelector("body").style.overflow = "hidden")
      : (document.querySelector("body").style.overflow = "auto");
  }, [active]);

  return (
    <div
      className={`position-fixed top-0 bottom-0 start-0 right-0 ${
        active ? "d-flex" : "d-none"
      }  py-4`}
      style={{
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(5px)",
        zIndex: "1100",
      }}
    >
      <div
        className="d-flex m-auto p-2 align-items-start justify-content-center position-relative"
        style={{
          width: "min(600px,100%)",
          height: "100%",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}
