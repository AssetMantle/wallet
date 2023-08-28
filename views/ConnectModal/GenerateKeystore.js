import React from "react";
import { Button, Stack } from "react-bootstrap";

export default function GenerateKeystore({ close, setStep }) {
  const handleImportExistingMnemonic = () => {
    console.log("Importing Existing Mnemonic");
  };
  return (
    <div className="bg-secondary p-4 rounded-4 w-100 my-auto">
      <Stack
        className="align-items-center justify-content-between"
        direction="horizontal"
      >
        <h1 className="body1 text-primary d-flex align-items-center gap-2 m-0">
          <button className="" onClick={() => setStep(4)}>
            <i className="bi bi-chevron-left" />
          </button>
          Create Keystore
        </h1>
        <Button
          variant="link"
          className="text-primary text-decoration-none body1"
          onClick={() => close()}
        >
          <span className="text-primary">
            <i className="bi bi-x-lg" />
          </span>
        </Button>
      </Stack>
      <p className="text-white-200 caption my-1 ps-2 m-0">
        Connect your wallet using any of the options below.
      </p>
      <Stack className="align-items-center justify-content-center mt-5" gap={4}>
        <Button
          variant="outline-primary"
          className="px-3 py-2 d-flex align-items-center gap-2"
          onClick={handleImportExistingMnemonic}
        >
          Import Existing Mnemonic <i className="bi bi-download" />
        </Button>
        <Stack
          className="align-items-center body2"
          gap={2}
          direction="horizontal"
          style={{ width: "min(300px, 100%)" }}
        >
          <hr className="flex-grow-1 w-100" />
          Or
          <hr className="flex-grow-1 w-100" />
        </Stack>
        <Button
          variant="outline-primary"
          className="px-3 py-2 d-flex align-items-center gap-2"
          onClick={() => setStep(9)}
        >
          Generate New mnemonic <i className="bi bi-plus-circle" />
        </Button>
      </Stack>
    </div>
  );
}
