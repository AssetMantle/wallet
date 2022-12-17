import React from "react";
import { useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";

export default function Redirect({ byWallet, close, connected }) {
  const WalletConnectFunctions = {
    keplr: function () {
      console.log(`inside ${byWallet}`);
      return false;
    },
    leap: function () {
      console.log(`inside ${byWallet}`);
      return false;
    },
    cosmostation: function () {
      console.log(`inside ${byWallet}`);
      return false;
    },
  };

  useEffect(() => {
    switch (byWallet) {
      case "keplr":
        WalletConnectFunctions.keplr();
        break;
      case "ledger":
        WalletConnectFunctions.ledger();
        break;
      case "cosmostation":
        WalletConnectFunctions.cosmostation();
        break;
    }
    // remove below
    setTimeout(() => {
      connected(true);
      close(0);
    }, 500);
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded-4 w-100">
      <div className="d-flex align-items-center justify-content-between ">
        <h1 className="body1 text-primary d-flex align-items-center gap-2">
          Redirecting to keplr
        </h1>
        <button className="btn text-primary body1" onClick={() => close()}>
          <span className="text-primary">
            <IoCloseSharp />
          </span>
        </button>
      </div>
      <p className="text-white-200 caption my-1">
        You are being redirected to {byWallet} for the next steps.
      </p>
    </div>
  );
}
