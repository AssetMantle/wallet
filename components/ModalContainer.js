import React, { useEffect } from "react";

export default function ModalContainer({ active, setActive, children }) {
  useEffect(() => {
    active
      ? (document.querySelector("body").style.overflow = "hidden")
      : (document.querySelector("body").style.overflow = "auto");
  }, [active]);

  return (
    <div
      className={`position-fixed top-0 bottom-0 start-0 end-0 align-items-center justify-content-center ${
        active ? "d-flex" : "d-none"
      }`}
      style={{
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(5px)",
        zIndex: "1100",
      }}
    >
      <div className="position-relative w-100 h-100">
        <div
          className="position-absolute top-0 start-0 end-0 bottom-0"
          style={{ zIndex: "1" }}
          onClick={() => setActive(false)}
        ></div>
        <div
          className="position-absolute top-0 start-0 end-0 bottom-0 my-auto d-flex m-auto p-2 align-items-start justify-content-center position-relative"
          style={{
            width: "min(650px,100%)",
            height: "100%",
            zIndex: "2",
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
