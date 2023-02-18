import Link from "next/link";
import React from "react";
import { ConnectOptionObject, mantleWalletV1URL } from "../../data";
import { cleanString } from "../../lib";

const ConnectModal = ({ setOpen, walletRepo }) => {
  function handleCloseModal(e) {
    e.preventDefault();
    setOpen(false);
  }

  console.log("walletRepo: ", walletRepo);
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
                {walletRepo?.wallets.map(
                  (
                    { walletPrettyName, connect, isError, isWalletConnected },
                    index
                  ) => (
                    <button
                      className="d-flex align-items-center gap-2 button-secondary py-2 px-3 rounded-2"
                      key={index}
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={async () => {
                        await connect();
                        setOpen(false);
                        console.log(
                          "wallet status now: ",
                          isError,
                          " connected: ",
                          isWalletConnected
                        );
                      }}
                    >
                      <div
                        className="position-relative"
                        style={{ width: "25px", aspectRatio: "1/1" }}
                      >
                        <img
                          layout="fill"
                          src={
                            ConnectOptionObject[cleanString(walletPrettyName)]
                              ?.icon
                          }
                          alt={walletPrettyName}
                        />
                      </div>
                      {walletPrettyName}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="d-flex flex-column gap-3 mt-5">
              <h2 className="caption text-white">
                Go to Old Wallet for Keystore & Ledger
              </h2>
              <div className="d-flex gap-2 flex-wrap">
                <Link href={mantleWalletV1URL}>
                  <a>
                    <button className="d-flex align-items-center gap-2 button-secondary py-2 px-3 rounded-2">
                      <div
                        className="position-relative"
                        style={{ width: "25px", aspectRatio: "1/1" }}
                      >
                        <img
                          layout="fill"
                          src={"/favicon.png"}
                          alt={"v1_wallet"}
                        />
                      </div>
                      MantleWallet V1 (Old)
                    </button>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectModal;
