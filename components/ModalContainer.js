import React, { useEffect } from "react";

export default function ModalContainer({ active, children }) {
  useEffect(() => {
    active
      ? (document.querySelector("body").style.overflow = "hidden")
      : (document.querySelector("body").style.overflow = "auto");
  }, [active]);

  return (
    <>
      {active && active !== 0 ? (
        <div
          className="position-fixed top-0 bottom-0 left-0 right-0 d-flex  pb-4"
          style={{
            width: "100dvw",
            height: "100dvh",
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(5px)",
            zIndex: "500",
            paddingTop: "80px",
          }}
        >
          <div
            className="d-flex m-auto p-2 align-items-center justify-content-center"
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
      ) : (
        ""
      )}
    </>
  );
}
