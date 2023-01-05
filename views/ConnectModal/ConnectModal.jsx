import React, { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import ModalContainer from "../../components/ModalContainer";

const ConnectModal = ({ isOpen, setOpen, walletRepo, theme }) => {
  console.log({ isOpen, setOpen, walletRepo, theme });
  const [generatedAddress, setGeneratedAddress] = useState("");

  const handleLedger = async (e) => {
    e.preventDefault();
    console.log("Ledger Option Selected");
    await walletRepo?.disconnect();
  };

  const handleKeystore = (e) => {
    e.preventDefault();
    console.log("Keystore Option Selected");
  };

  function handleCloseModal(e) {
    e.preventDefault();
    setOpen(false);
  }

  function handleChangeGenAddress(e) {
    e.preventDefault();
    setGeneratedAddress(e.target.value);
  }

  return (
    // isOpen && (
    <>
      <ModalContainer active={isOpen}>
        <div className="bg-gray-800 p-4 rounded-4 w-100 my-auto">
          <div className="d-flex align-items-center justify-content-between ">
            <h1 className="body1 text-primary">Connect Wallet</h1>
            <button
              className="btn text-primary body1"
              onClick={handleCloseModal}
            >
              <span className="text-primary">
                <IoCloseSharp />
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
              {walletRepo?.wallets.map(({ _walletInfo, connect }, index) => (
                <button
                  className="d-flex align-items-center gap-1 button-secondary py-2 px-4 rounded-2"
                  key={index}
                  onClick={async () => {
                    await connect();
                    setOpen(false);
                  }}
                >
                  {_walletInfo?.prettyName}
                </button>
              ))}
            </div>
            <hr className="my-2" />
            <h2 className="caption text-white">Connect with Ledger</h2>
            <div className="d-flex">
              <button
                className="d-flex align-items-center gap-1 button-secondary py-2 px-4 rounded-2"
                onClick={handleLedger}
              >
                <span className="btn-label">
                  <i className="bi bi-hdd-fill"></i>
                </span>
                Disconnect
              </button>
            </div>
            <hr className="my-2" />
            <h2 className="caption text-white">Connect with Keystore</h2>
            <div className="d-flex">
              <button
                className="d-flex align-items-center gap-1 button-secondary py-2 px-4 rounded-2"
                onClick={handleKeystore}
              >
                <span className="btn-label">
                  <i className="bi bi-hdd-fill"></i>
                </span>
                Keystore
              </button>
            </div>
            <div className="d-flex align-items-center gap-2 body2">
              <hr className="divider" />
              Or
              <hr className="divider" />
            </div>
            <div className="d-flex flex-column">
              <div className="text-white body2 text-center">
                Generate Only Mode
              </div>
              <p className="text-white-200 caption text-center">
                Use this option to view only and generate .json for transactions
              </p>
            </div>
            <input
              type="text"
              className="am-input border-color-white bg-transparent px-4 py-1 rounded-2 mt-3"
              placeholder="Input your wallet address"
              value={generatedAddress}
              onChange={handleChangeGenAddress}
            />
          </div>
        </div>
      </ModalContainer>
    </>
    // )
  );
};

export default ConnectModal;
