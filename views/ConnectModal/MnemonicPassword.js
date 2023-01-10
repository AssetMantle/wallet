import React from "react";
import { IoCloseSharp } from "react-icons/io5";

export default function MnemonicPassword({
  Password,
  setPassword,
  setStep,
  close,
  Mnemonic,
}) {
  // Mnemonic generate function here 👇
  const handleConfirm = () => {
    console.log(Mnemonic, Password);
    setPassword();
    setStep(4);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-4 w-100 my-auto">
      <div className="d-flex align-items-center justify-content-between ">
        <h1 className="body1 text-primary d-flex align-items-center gap-2">
          Enter Password
        </h1>
        <button className="btn text-primary body1" onClick={() => close()}>
          <span className="text-primary">
            <IoCloseSharp />
          </span>
        </button>
      </div>
      <p className="text-white-200 caption my-1">
        Enter your password to complete creating a wallet.
      </p>
      <input
        type="password"
        className="am-input w-100 my-3 py-2 px-3 rounded-1 bg-t border-color-white"
        placeholder="******"
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="d-flex align-items-center justify-content-end gap-3 flex-wrap mt-3">
        <button
          className="button-primary caption py-2 px-5"
          onClick={() => handleConfirm()}
          disabled={Password && Password.length > 8 ? false : true}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
