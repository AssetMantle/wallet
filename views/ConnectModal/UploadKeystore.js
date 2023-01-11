import React from "react";

export default function UploadKeystore({ close, setStep, setFile }) {
  const handleChange = (e) => {
    setFile(URL.createObjectURL(e.target.files[0]));
    setStep(5);
  };
  return (
    <div className="bg-gray-800 p-4 rounded-4 w-100 my-auto">
      <div className="d-flex align-items-center justify-content-between ">
        <h1 className="body1 text-primary d-flex align-items-center gap-2">
          <button className="" onClick={() => setStep(1)}>
            <i className="bi bi-chevron-left" />
          </button>
          Connect with Keystore
        </h1>
        <button className="btn text-primary body1" onClick={() => close()}>
          <span className="text-primary">
            <i className="bi bi-x-lg" />
          </span>
        </button>
      </div>
      <p className="text-white-200 caption my-1 ps-2">
        Connect your wallet using any of the options below
      </p>
      <div
        className="d-flex align-items-center justify-content-center border-color-white rounded-0 position-relative mt-4"
        style={{ border: "1px dashed" }}
      >
        <div className="d-flex flex-column text-primary p-3 text-center gap-3">
          <span className="h4 text-primary mx-auto">
            <i className="bi bi-upload" />
          </span>
          <p className="caption text-white">Drop file here</p>
          <p className="caption text-white-200">or</p>
          <div className="button-secondary py-2 px-5 d-flex align-items-center gap-2">
            Browse <i className="bi bi-search" />
          </div>
        </div>
        <input
          type="file"
          className="position-absolute top-0 bottom-0 start-0 end-0"
          accept=".json"
          style={{ opacity: "0" }}
          onChange={(e) => handleChange(e)}
        />
      </div>
      <p className="caption2 mt-3">
        Do not have one?{" "}
        <button className="am-link" onClick={() => setStep(8)}>
          Create keystore
        </button>
      </p>
    </div>
  );
}
