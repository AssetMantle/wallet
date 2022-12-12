import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import Image from "next/image";

export default function ChooseOption({
  ExistingWallet,
  Ledger,
  Keystore,
  setStep,
  byWallet,
  close,
  connect,
}) {
  const handleSelect = (name, step) => {
    byWallet(name);
    setStep(step);
  };

  const handleLedger = (name) => {
    byWallet(name);
    console.log("running ledger function");
    setTimeout(() => {
      connect(true);
      close(0);
    }, 500);
  };

  return (
    <div className="bg-gray-800 p-3 rounded-4 w-100 pb-5">
      <div className="d-flex align-items-center justify-content-between ">
        <h1 className="body1 text-primary">Connect</h1>
        <button className="btn text-primary body1" onClick={() => close()}>
          <span className="text-primary">
            <IoCloseSharp />
          </span>
        </button>
      </div>
      <p className="text-white-200 caption my-1">
        Connect your wallet using any of the options below
      </p>
      <div className="d-flex flex-column gap-3 mt-5">
        <h2 className="caption text-white">Connect with existing Wallet</h2>
        <div className="d-flex gap-2 flex-wrap">
          {ExistingWallet &&
            Array.isArray(ExistingWallet) &&
            ExistingWallet.length > 0 &&
            React.Children.toArray(
              ExistingWallet.map((wallet) => (
                <button
                  className="d-flex align-items-center gap-1 button-secondary py-2 px-4 rounded-2"
                  onClick={() => handleSelect(wallet.name.toLowerCase(), 2)}
                >
                  {wallet.name}
                  <div
                    className="position-relative"
                    style={{ width: "28px", aspectRatio: "1/1" }}
                  >
                    <Image layout="fill" src={wallet.icon} alt={wallet.name} />
                  </div>
                </button>
              ))
            )}
        </div>
        <hr />
        <h2 className="caption text-white">Connect with Ledger</h2>
        <div className="d-flex">
          <button
            className="d-flex align-items-center gap-1 button-secondary py-2 px-4 rounded-2"
            onClick={() => handleLedger(Ledger.name.toLowerCase())}
          >
            {Ledger.name}
            <div
              className="position-relative"
              style={{ width: "28px", aspectRatio: "1/1" }}
            >
              <Image layout="fill" src={Ledger.icon} alt={Ledger.name} />
            </div>
          </button>
        </div>
        <hr />
        <h2 className="caption text-white">Connect with Keystore</h2>
        <div className="d-flex">
          <button
            className="d-flex align-items-center gap-1 button-secondary py-2 px-4 rounded-2"
            onClick={() => handleSelect(Keystore.name.toLowerCase(), 4)}
          >
            {Keystore.name}
            <div
              className="position-relative"
              style={{ width: "28px", aspectRatio: "1/1" }}
            >
              <Image layout="fill" src={Keystore.icon} alt={Keystore.name} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
