import React, { useState } from "react";
import ChooseOption from "./ChooseOption";
import Error from "./Error";
import KeystorePassword from "./KeystorePassword";
import Redirect from "./Redirect";
import Success from "./Success";
import UploadKeystore from "./UploadKeystore";
import WalletConnect from "./WalletConnect";

// ******************* Instructions **********************************
// put wallet connect functions inside Redirect.js file
// put Ledger connect function inside the ChooseOption.js file

export default function ConnectModal({
  step,
  setStep,
  isConnected,
  byWallet,
  setByWallet,
  close,
}) {
  const [KeystoreFile, setKeystoreFile] = useState();
  const [Password, setPassword] = useState();

  const ExistingWallet = [
    {
      icon: "/WalletIcons/keplr.png",
      name: "Keplr",
    },
    {
      icon: "/WalletIcons/leap.png",
      name: "Leap",
    },
    {
      icon: "/WalletIcons/cosmostation.png",
      name: "Cosmostation",
    },
  ];
  const Ledger = {
    icon: "/WalletIcons/ledger.png",
    name: "Ledger",
  };
  const Keystore = {
    icon: "/WalletIcons/keystore.png",
    name: "Keystore",
  };
  return {
    1: (
      <ChooseOption
        setStep={setStep}
        byWallet={setByWallet}
        close={close}
        ExistingWallet={ExistingWallet}
        Keystore={Keystore}
        Ledger={Ledger}
        connect={isConnected}
      />
    ),
    2: (
      <WalletConnect
        ExistingWallet={ExistingWallet}
        byWallet={byWallet}
        close={close}
        setStep={setStep}
      />
    ),
    3: <Redirect byWallet={byWallet} close={close} connected={isConnected} />,
  }[step];
}
