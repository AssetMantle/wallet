import React from "react";

export default function Success({ close, connect }) {
  const address = "dwafegrtefdvfhresv -39i539w0rej";
  const handleCopy = () => {
    navigator.clipboard.writeText(address);
  };

  const handleConnect = () => {
    connect(true);
    close(0);
  };
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
          className="text-success"
          style={{ fontSize: "calc(10px + 10vmin)" }}
        >
          <i className="bi bi-check-circle" />
        </span>
        <h1 className="body2 text-primary">Wallet created successfully</h1>
        <p className="caption">
          Congratulations, your wallet has been created successfully
        </p>
        <div className="nav-bg d-flex align-items-center justify-content-between flex-wrap w-100 p-3 rounded-2 caption">
          <span className="text-gray">Identity Address:</span>
          {`${address.substring(0, 17)}-${address.substring(
            address.length - 9,
            address.length
          )}`}
          <button className="text-primary" onClick={handleCopy}>
            <i className="bi bi-files" />
          </button>
        </div>
        <p className="d-flex align-items-start gap-1">
          <span className="mt-1">
            <i className="bi bi-info-circle" />
          </span>
          Please securely store the above to store and transfer your assets and
          funds in the future
        </p>
        <div className="d-flex w-100 mt-2">
          <button className="am-link ms-auto px-3" onClick={handleConnect}>
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}
