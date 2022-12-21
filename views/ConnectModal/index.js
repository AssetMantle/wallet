import React, { useState } from "react";
import ChooseOption from "./ChooseOption";
import Error from "./Error";
import GenerateKeystore from "./GenerateKeystore";
import GenerateOnlyMode from "./GenerateOnlyMode";
import KeystorePassword from "./KeystorePassword";
import Mnemonic from "./Mnemonic";
import MnemonicPassword from "./MnemonicPassword";
import Redirect from "./Redirect";
import Success from "./Success";
import UploadKeystore from "./UploadKeystore";
import WalletConnect from "./WalletConnect";

// ******************* Instructions **********************************
// put wallet connect functions inside Redirect.js file
// put Ledger connect function/s inside the ChooseOption.js file
// put Keystore connect function/s inside the KeystorePassword.js file
// put Keystore generate function/s inside the MnemonicPassword.js file

export default function ConnectModal({
  step,
  setStep,
  isConnected,
  byWallet,
  setByWallet,
  close,
}) {
  const [WalletAddress, setWalletAddress] = useState();
  const [KeystoreFile, setKeystoreFile] = useState();
  const [MnemonicSeed, setMnemonicSeed] = useState();
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
  return (
    <>
      {
        {
          1: (
            <ChooseOption
              setStep={setStep}
              byWallet={setByWallet}
              close={close}
              ExistingWallet={ExistingWallet}
              Keystore={Keystore}
              Ledger={Ledger}
              connect={isConnected}
              WalletAddress={WalletAddress}
              setWalletAddress={setWalletAddress}
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
          3: (
            <Redirect
              byWallet={byWallet}
              close={close}
              connected={isConnected}
            />
          ),
          4: (
            <UploadKeystore
              close={close}
              setFile={setKeystoreFile}
              setStep={setStep}
            />
          ),
          5: (
            <KeystorePassword
              Password={Password}
              setPassword={setPassword}
              close={close}
              setStep={setStep}
              keyStore={KeystoreFile}
            />
          ),
          6: <Success close={close} connect={isConnected} />,
          7: <Error close={close} setStep={setStep} />,
          8: <GenerateKeystore close={close} setStep={setStep} />,
          9: (
            <Mnemonic
              setStep={setStep}
              close={close}
              MnemonicSeed={setMnemonicSeed}
            />
          ),
          10: (
            <MnemonicPassword
              Password={Password}
              close={close}
              setPassword={setPassword}
              setStep={setStep}
              Mnemonic={MnemonicSeed}
            />
          ),
          11: (
            <GenerateOnlyMode
              close={close}
              setStep={setStep}
              WalletAddress={WalletAddress}
              setWalletAddress={setWalletAddress}
            />
          ),
        }[step]
      }
    </>
  );
}
