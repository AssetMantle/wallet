import React from "react";

export default function Banner() {
  return (
    <div
      className="alert alert-warning alert-dismissible fade show m-0 rounded-0 py-1 text-center bg-yellow-100 border-0 text-dark"
      role="alert"
    >
      <a
        className="text-dark-hover"
        href="https://marketplace.assetmantle.one/"
        target="_blank"
        rel="noopener noreferrer"
      >
        🎉Click here for limited early access to{" "}
        <strong>MantlePlace NFTs</strong>
        🎉
      </a>
      <button
        type="button"
        className="btn-close py-2"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  );
}
