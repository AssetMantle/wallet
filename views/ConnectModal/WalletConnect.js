import React from "react";
import { Button, Stack } from "react-bootstrap";

export default function WalletConnect({
  ExistingWallet,
  byWallet,
  close,
  setStep,
}) {
  return (
    <div className="bg-am-gray-200 p-4 rounded-4 w-100 my-auto">
      <Stack
        className="align-items-center justify-content-between"
        direction="horizontal"
      >
        <Stack
          direction="horizontal"
          gap={2}
          as="h1"
          className="body1 text-primary align-items-center m-0"
        >
          <div
            className="position-relative overflow-hidden"
            style={{ width: "28px", aspectRatio: "1/1" }}
          >
            <img
              layout="fill"
              className="h-100 w-100"
              style={{ objectFit: "cover", objectPosition: "center" }}
              src={
                ExistingWallet.filter(
                  (el) => el.name.toLowerCase() === byWallet
                )[0].icon
              }
              alt={
                ExistingWallet.filter(
                  (el) => el.name.toLowerCase() === byWallet
                )[0].name
              }
            />
          </div>
          Request to Connect wallet
        </Stack>
        <Button
          variant="link"
          className="text-decoration-none text-primary body1"
          onClick={() => close()}
        >
          <i className="bi bi-x-lg text-primary" />
        </Button>
      </Stack>
      <p className="color-am-white-300 caption m-0 my-1">
        Click “Connect” to be redirected to {byWallet}.
      </p>
      <Stack className="align-items-center justify-content-end gap-3 flex-wrap mt-5">
        <Button
          variant="outline-primary"
          className="caption text-primary px-5"
          onClick={() => setStep(1)}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          className="text-dark caption py-2 px-5"
          onClick={() => setStep(3)}
        >
          Connect
        </Button>
      </Stack>
    </div>
  );
}
