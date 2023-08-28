import React from "react";
import { Button, Stack } from "react-bootstrap";

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
    <div className="bg-secondary p-4 rounded-4 w-100 my-auto">
      <Stack className="d-flex align-items-center justify-content-between ">
        <h1 className="body1 text-primary m-0">Connect Wallet</h1>
        <button className="btn text-primary body1" onClick={() => close()}>
          <span className="text-primary">
            <i className="bi bi-x-lg" />
          </span>
        </button>
      </Stack>
      <div className="text-white body2 my-1 text-center">Connect With</div>
      <p className="text-white-200 caption my-1 text-center m-0">
        Connect your wallet using any of the options below
      </p>
      <Stack className="mt-5" gap={3}>
        <h2 className="caption text-white m-0">Connect with existing Wallet</h2>
        <Stack className="flex-wrap" gap={2} direction="horizontal">
          {ExistingWallet &&
            Array.isArray(ExistingWallet) &&
            ExistingWallet.length > 0 &&
            React.Children.toArray(
              ExistingWallet.map((wallet, index) => (
                <Button
                  variant="outline-primary"
                  key={index}
                  className="d-flex align-items-center gap-1 py-2 px-4 rounded-2"
                  onClick={() => handleSelect(wallet.name.toLowerCase(), 2)}
                >
                  {wallet.name}
                  <div
                    className="position-relative overflow-hidden"
                    style={{
                      width: "28px",
                      aspectRatio: "1/1",
                      borderRadius: "7px",
                    }}
                  >
                    <img
                      layout="fill"
                      className="w-100 h-100"
                      src={wallet.icon}
                      alt={wallet.name}
                      style={{ objectFit: "cover", objectPosition: "center" }}
                    />
                  </div>
                </Button>
              ))
            )}
        </Stack>
        <hr className="my-2" />
        <h2 className="caption text-white m-0">Connect with Ledger</h2>
        <Stack className="" direction="horizontal">
          <Button
            variant="outline-primary"
            className="d-flex align-items-center gap-1 py-2 px-4 rounded-2"
            onClick={() => handleLedger(Ledger.name.toLowerCase())}
          >
            {Ledger.name}
            <div
              className="position-relative overflow-hidden"
              style={{ width: "28px", aspectRatio: "1/1" }}
            >
              <img
                layout="fill"
                src={Ledger.icon}
                alt={Ledger.name}
                className="h-100 w-100"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
          </Button>
        </Stack>
        <hr className="my-2" />
        <h2 className="caption text-white m-0">Connect with Keystore</h2>
        <Stack className="" direction="horizontal">
          <Button
            variant="outline-primary"
            className="d-flex align-items-center gap-1 py-2 px-4 rounded-2"
            onClick={() => handleSelect(Keystore.name.toLowerCase(), 4)}
          >
            {Keystore.name}
            <div
              className="position-relative overflow-hidden"
              style={{ width: "28px", aspectRatio: "1/1" }}
            >
              <img
                layout="fill"
                src={Keystore.icon}
                alt={Keystore.name}
                className="h-100 w-100"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
          </Button>
        </Stack>
        <Stack
          className="align-items-center body2"
          gap={2}
          direction="horizontal"
        >
          <hr className="divider" />
          Or
          <hr className="divider" />
        </Stack>
        <Stack className="">
          <div className="text-white body2 text-center">Generate Only Mode</div>
          <p className="text-white-200 caption text-center m-0">
            Use this option to view only and generate .json for transactions
          </p>
        </Stack>
        <input
          type="text"
          className="border border-white bg-transparent px-4 py-1 rounded-2 mt-3"
          placeholder="Input your wallet address"
          value={WalletAddress}
          onChange={(e) => handleGenerateMode(e)}
        />
      </Stack>
    </div>
  );
}
