import React from "react";

export default function KeystorePassword({
  Password,
  setPassword,
  setStep,
  close,
  keyStore,
}) {
  // Keystore connect function
  const handleConfirm = () => {
    console.log(keyStore, Password);
    setTimeout(() => {
      setStep(6);
      // success is `6` error is `7`
    }, 1000);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-4 w-100 my-auto">
      <div className="d-flex align-items-center justify-content-between ">
        <h1 className="body1 text-primary d-flex align-items-center gap-2">
          Enter Password
        </h1>
        <button className="btn text-primary body1" onClick={() => close()}>
          <span className="text-primary">
            <i className="bi bi-x-lg" />
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
          disabled={!Password || !Password.length > 8 ? true : false}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
