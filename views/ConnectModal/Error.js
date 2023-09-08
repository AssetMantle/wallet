import React from "react";
import { Button, Stack } from "react-bootstrap";

export default function Error({ close, setStep }) {
  return (
    <div className="bg-am-gray-200 p-4 rounded-4 w-100 my-auto">
      <Stack
        className="align-items-center justify-content-between"
        direction="horizontal"
      >
        <h1 className="body1 text-primary d-flex align-items-center gap-2 m-0"></h1>
        <Button variant="primary" className="body1" onClick={() => close()}>
          <span className="text-primary">
            <i className="bi bi-x-lg" />
          </span>
        </Button>
      </Stack>
      <Stack
        className="align-items-center justify-content-center text-center"
        gap={3}
      >
        <span
          className="text-error"
          style={{ fontSize: "calc(10px + 10vmin)" }}
        >
          <i className="bi bi-x-circle" />
        </span>
        <h1 className="body2 text-error m-0">Error in creating Wallet</h1>
        <p className="caption m-0">
          Your wallet could not be created. Please try again.
        </p>
        <Stack className="w-100 m-0 mt-2">
          <button className="am-link ms-auto px-3" onClick={() => setStep(4)}>
            Try again
          </button>
        </Stack>
      </Stack>
    </div>
  );
}
