import React from "react";
import { Button, Stack } from "react-bootstrap";

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
    <div className="bg-light-subtle p-4 rounded-4 w-100 my-auto">
      <Stack className="d-flex align-items-center justify-content-between ">
        <h1 className="body1 text-primary d-flex align-items-center gap-2 m-0">
          Enter Password
        </h1>
        <button className="btn text-primary body1" onClick={() => close()}>
          <span className="text-primary">
            <i className="bi bi-x-lg" />
          </span>
        </button>
      </Stack>
      <p className="text-white-200 caption m-0 my-1">
        Enter your password to complete creating a wallet.
      </p>
      <input
        type="password"
        className="w-100 my-3 py-2 px-3 rounded-1 bg-transparent border border-white"
        placeholder="******"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Stack
        className="align-items-center justify-content-end flex-wrap mt-3"
        gap={3}
        direction="horizontal"
      >
        <Button
          variant="primary"
          className="rounded-5 caption py-2 px-5"
          onClick={() => handleConfirm()}
          disabled={Password && Password.length > 8 ? false : true}
        >
          Confirm
        </Button>
      </Stack>
    </div>
  );
}
