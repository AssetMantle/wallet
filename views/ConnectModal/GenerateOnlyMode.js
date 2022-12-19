import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import { BsChevronLeft } from "react-icons/bs";

export default function GenerateOnlyMode({
  close,
  setStep,
  WalletAddress,
  setWalletAddress,
}) {
  const handleSubmit = () => {
    console.log("submitting.....");
  };
  return (
    <div className="bg-gray-800 p-4 rounded-4 w-100 my-auto">
      <div className="d-flex align-items-center justify-content-between ">
        <h1 className="body1 text-primary d-flex align-items-center gap-2">
          <button className="" onClick={() => setStep(1)}>
            <BsChevronLeft />
          </button>
          Generate Only Mode
        </h1>
        <button className="btn text-primary body1" onClick={() => close(0)}>
          <span className="text-primary">
            <IoCloseSharp />
          </span>
        </button>
      </div>
      <p className="text-white-200 caption my-3 ps-2">
        Use this option to view only and generate .json for transactions
      </p>
      <p className="text-white-200 caption mt-5">Wallet Address</p>
      <input
        type="text"
        className="am-input w-100 my-3 py-2 px-3 rounded-1 bg-t border-color-white"
        placeholder="Input your wallet address"
        onChange={(e) => setWalletAddress(e.target.value)}
      />
      <div className="d-flex align-items-center justify-content-end gap-3 flex-wrap mt-3">
        <button
          className="button-primary caption py-2 px-5"
          onClick={() => handleSubmit()}
          disabled={WalletAddress && WalletAddress.length === 45 ? false : true}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
