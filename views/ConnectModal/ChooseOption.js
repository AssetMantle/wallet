import React from "react";

export default function ChooseOption({
  ExistingWallet,
  Ledger,
  Keystore,
  setStep,
  byWallet,
  close,
  connect,
  WalletAddress,
  setWalletAddress,
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

  const handleGenerateMode = (e) => {
    e.target.value.length === 45 && setStep(11);
    setWalletAddress(e.target.value);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-4 w-100 my-auto">
      <div className="d-flex align-items-center justify-content-between ">
        <h1 className="body1 text-primary">Connect Wallet</h1>
        <button className="btn text-primary body1" onClick={() => close()}>
          <span className="text-primary">
            <i className="bi bi-x-lg" />
          </span>
        </button>
      </div>
      <div className="text-white body2 my-1 text-center">Connect With</div>
      <p className="text-white-200 caption my-1 text-center">
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
                    <img layout="fill" src={wallet.icon} alt={wallet.name} />
                  </div>
                </button>
              ))
            )}
        </div>
        <hr className="my-2" />
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
              <img layout="fill" src={Ledger.icon} alt={Ledger.name} />
            </div>
          </button>
        </div>
        <hr className="my-2" />
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
              <img layout="fill" src={Keystore.icon} alt={Keystore.name} />
            </div>
          </button>
        </div>
        <div className="d-flex align-items-center gap-2 body2">
          <hr className="divider" />
          Or
          <hr className="divider" />
        </div>
        <div className="d-flex flex-column">
          <div className="text-white body2 text-center">Generate Only Mode</div>
          <p className="text-white-200 caption text-center">
            Use this option to view only and generate .json for transactions
          </p>
        </div>
        <input
          type="text"
          className="am-input border-color-white bg-transparent px-4 py-1 rounded-2 mt-3"
          placeholder="Input your wallet address"
          value={WalletAddress}
          onChange={(e) => handleGenerateMode(e)}
        />
      </div>
    </div>
  );
}
