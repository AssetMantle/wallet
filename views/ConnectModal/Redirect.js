import React from "react";
import { useEffect } from "react";
import { Stack } from "react-bootstrap";

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
    <div className="bg-am-gray-200 p-4 rounded-4 w-100 my-auto">
      <Stack
        className="align-items-center justify-content-between"
        direction="horizontal"
      >
        <h1 className="body1 text-primary d-flex align-items-center gap-2 m-0">
          Redirecting to keplr
        </h1>
        <button className="btn text-primary body1" onClick={() => close()}>
          <span className="text-primary">
            <i className="bi bi-x-lg" />
          </span>
        </button>
      </Stack>
      <p className="text-white-200 caption m-0 my-1">
        You are being redirected to {byWallet} for the next steps.
      </p>
    </div>
  );
}
