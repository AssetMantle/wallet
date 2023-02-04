import React from "react";
// import ModalContainer from "../../components/ModalContainer";

const ConnectModal = ({ setOpen, walletRepo }) => {
  function handleCloseModal(e) {
    e.preventDefault();
    setOpen(false);
  }

  const ConnectOptionObject = {
    cosmostation: {
      icon: "/WalletIcons/cosmostation.png",
      name: "Cosmostation",
    },
    cosmostationmobile: {
      icon: "/WalletIcons/cosmostation.png",
      name: "Cosmostation",
    },
    keplr: {
      icon: "/WalletIcons/keplr.png",
      name: "Keplr",
    },
    keystore: {
      icon: "/WalletIcons/keystore.png",
      name: "Keystore",
    },
    leap: {
      icon: "/WalletIcons/leap.png",
      name: "Leap",
    },
    ledger: {
      icon: "/WalletIcons/ledger.png",
      name: "Ledger",
    },
  };

  return (
    <div className="modal " tabIndex="-1" role="dialog" id="WalletConnectModal">
      <div
        className="modal-dialog modal-dialog-centered"
        role="document"
        style={{ maxWidth: "min(100%, 600px)" }}
      >
        <div className="modal-content">
          <div className="bg-gray-800 p-4 rounded-4 w-100 my-auto">
            <div className="d-flex align-items-center justify-content-between ">
              <h1 className="body1 text-primary">Connect Wallet</h1>
              <button
                className="btn text-primary body1"
                onClick={handleCloseModal}
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <div className="text-white body2 my-1 text-center">
              Connect With
            </div>
            <p className="text-white-200 caption my-1 text-center">
              Connect your wallet using any of the options below
            </p>
            <div className="d-flex flex-column gap-3 mt-5">
              <h2 className="caption text-white">
                Connect with existing Wallet
              </h2>
              <div className="d-flex gap-2 flex-wrap">
                {walletRepo?.wallets.map(({ _walletInfo, connect }, index) => (
                  <button
                    className="d-flex align-items-center gap-2 button-secondary py-2 px-3 rounded-2"
                    key={index}
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={async () => {
                      await connect();
                      setOpen(false);
                    }}
                  >
                    <div
                      className="position-relative"
                      style={{ width: "25px", aspectRatio: "1/1" }}
                    >
                      <img
                        layout="fill"
                        src={
                          ConnectOptionObject[
                            _walletInfo?.prettyName
                              .toLowerCase()
                              .replace(" ", "")
                          ]?.icon
                        }
                        alt={_walletInfo?.prettyName}
                      />
                    </div>
                    {_walletInfo?.prettyName}
                    {console.log(
                      ConnectOptionObject[_walletInfo?.prettyName]?.icon
                    )}
                  </button>
                ))}
              </div>
              {/* <hr className="my-2" />
            <h2 className="caption text-white">Connect with Ledger</h2>
            <div className="d-flex">
              <button
                className="d-flex align-items-center gap-2 button-secondary py-2 px-3 rounded-2"
                onClick={handleLedger}
              >
                <div
                  className="position-relative"
                  style={{ width: "25px", aspectRatio: "1/1" }}
                >
                  <Image
                    layout="fill"
                    src={ConnectOptionObject?.ledger?.icon}
                    alt={ConnectOptionObject?.ledger?.name}
                  />
                </div>
                Ledger
              </button>
            </div>
            <hr className="my-2" />
            <h2 className="caption text-white">Connect with Keystore</h2>
            <div className="d-flex">
              <button
                className="d-flex align-items-center gap-2 button-secondary py-2 px-3 rounded-2"
                onClick={handleKeystore}
              >
                <div
                  className="position-relative"
                  style={{ width: "25px", aspectRatio: "1/1" }}
                >
                  <Image
                    layout="fill"
                    src={ConnectOptionObject?.keystore?.icon}
                    alt={ConnectOptionObject?.keystore?.name}
                  />
                </div>
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
            /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectModal;
