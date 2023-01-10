import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import { BsChevronLeft, BsDownload, BsPlusCircle } from "react-icons/bs";

export default function GenerateKeystore({ close, setStep }) {
  const handleImportExistingMnemonic = () => {
    console.log("Importing Existing Mnemonic");
  };
  return (
    <div className="bg-gray-800 p-4 rounded-4 w-100 my-auto">
      <div className="d-flex align-items-center justify-content-between ">
        <h1 className="body1 text-primary d-flex align-items-center gap-2">
          <button className="" onClick={() => setStep(4)}>
            <BsChevronLeft />
          </button>
          Create Keystore
        </h1>
        <button className="btn text-primary body1" onClick={() => close()}>
          <span className="text-primary">
            <IoCloseSharp />
          </span>
        </button>
      </div>
      <p className="text-white-200 caption my-1 ps-2">
        Connect your wallet using any of the options below.
      </p>
      <div className="d-flex align-items-center justify-content-center flex-column mt-5 gap-4">
        <button
          className="button-secondary px-3 py-2 d-flex align-items-center gap-2"
          onClick={handleImportExistingMnemonic}
        >
          Import Existing Mnemonic <BsDownload />
        </button>
        <div
          className="d-flex align-items-center gap-2 body2"
          style={{ width: "min(300px, 100%)" }}
        >
          <hr className="flex-grow-1 w-100" />
          Or
          <hr className="flex-grow-1 w-100" />
        </div>
        <button
          className="button-secondary px-3 py-2 d-flex align-items-center gap-2"
          onClick={() => setStep(9)}
        >
          Generate New mnemonic <BsPlusCircle />
        </button>
      </div>
    </div>
  );
}
