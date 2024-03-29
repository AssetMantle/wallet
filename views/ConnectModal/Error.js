import React from "react";

export default function Error({ close, setStep }) {
  return (
    <div className="bg-gray-800 p-4 rounded-4 w-100 my-auto">
      <div className="d-flex align-items-center justify-content-between ">
        <h1 className="body1 text-primary d-flex align-items-center gap-2"></h1>
        <button className="btn text-primary body1" onClick={() => close()}>
          <span className="text-primary">
            <i className="bi bi-x-lg" />
          </span>
        </button>
      </div>
      <div className="d-flex flex-column align-items-center justify-content-center text-center gap-3">
        <span
          className="text-error"
          style={{ fontSize: "calc(10px + 10vmin)" }}
        >
          <i className="bi bi-x-circle" />
        </span>
        <h1 className="body2 text-error">Error in creating Wallet</h1>
        <p className="caption">
          Your wallet could not be created. Please try again.
        </p>
        <div className="d-flex w-100 mt-2">
          <button className="am-link ms-auto px-3" onClick={() => setStep(4)}>
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
