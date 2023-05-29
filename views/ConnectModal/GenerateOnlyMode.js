import React from "react";
import { Button, Stack } from "react-bootstrap";

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
    <div className="bg-light-subtle p-4 rounded-4 w-100 my-auto">
      <Stack
        className="align-items-center justify-content-between"
        direction="horizontal"
      >
        <h1 className="body1 text-primary d-flex align-items-center gap-2 m-0">
          <button className="" onClick={() => setStep(1)}>
            <i className="bi bi-chevron-left" />
          </button>
          Generate Only Mode
        </h1>
        <button className="btn text-primary body1" onClick={() => close(0)}>
          <span className="text-primary">
            <i className="bi bi-x-lg" />
          </span>
        </button>
      </Stack>
      <p className="text-white-200 caption my-3 ps-2 m-0">
        Use this option to view only and generate .json for transactions
      </p>
      <p className="text-white-200 caption mt-5 m-0">Wallet Address</p>
      <input
        type="text"
        className="w-100 my-3 py-2 px-3 rounded-1 bg-transparent border border-white"
        placeholder="Input your wallet address"
        onChange={(e) => setWalletAddress(e.target.value)}
      />
      <Stack
        className="align-items-center justify-content-end flex-wrap mt-3"
        gap={3}
        direction="horizontal"
      >
        <Button
          variant="primary"
          className="caption py-2 px-5 rounded-5"
          onClick={() => handleSubmit()}
          disabled={WalletAddress && WalletAddress.length === 45 ? false : true}
        >
          Submit
        </Button>
      </Stack>
    </div>
  );
}
