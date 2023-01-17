import React from "react";

export default function Banner() {
  return (
    <div
      className="alert alert-warning alert-dismissible fade show m-0 rounded-0 py-1 text-center bg-yellow-100 border-0 text-dark"
      role="alert"
    >
      🎉<strong>Holy guacamole!</strong> You should check in on some of those
      fields below.🎉
      <button
        type="button"
        className="btn-close py-2"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  );
}
