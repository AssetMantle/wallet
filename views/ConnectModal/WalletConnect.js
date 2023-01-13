import React from "react";

export default function WalletConnect({
  ExistingWallet,
  byWallet,
  close,
  setStep,
}) {
  return (
    <div className="bg-gray-800 p-4 rounded-4 w-100 my-auto">
      <div className="d-flex align-items-center justify-content-between ">
        <h1 className="body1 text-primary d-flex align-items-center gap-2">
          <div
            className="position-relative"
            style={{ width: "28px", aspectRatio: "1/1" }}
          >
            <img
              layout="fill"
              src={
                ExistingWallet.filter(
                  (el) => el.name.toLowerCase() === byWallet
                )[0].icon
              }
              alt={
                ExistingWallet.filter(
                  (el) => el.name.toLowerCase() === byWallet
                )[0].name
              }
            />
          </div>
          Request to Connect wallet
        </h1>
        <button className="btn text-primary body1" onClick={() => close()}>
          <span className="text-primary">
            <i className="bi bi-x-lg" />
          </span>
        </button>
      </div>
      <p className="text-white-200 caption my-1">
        Click “Connect” to be redirected to {byWallet}.
      </p>
      <div className="d-flex align-items-center justify-content-end gap-3 flex-wrap mt-5">
        <button
          className="button-secondary caption py-2 px-5"
          onClick={() => setStep(1)}
        >
          Cancel
        </button>
        <button
          className="button-primary caption py-2 px-5"
          onClick={() => setStep(3)}
        >
          Connect
        </button>
      </div>
    </div>
  );
}
