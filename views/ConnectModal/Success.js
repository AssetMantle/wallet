import React from "react";
import { Button, Stack } from "react-bootstrap";

export default function Success({ close, connect }) {
  const address = "dwafegrtefdvfhresv -39i539w0rej";
  const handleCopy = () => {
    navigator.clipboard.writeText(address);
  };

  const handleConnect = () => {
    connect(true);
    close(0);
  };
  return (
    <div className="bg-light-subtle p-4 rounded-4 w-100 my-auto">
      <Stack
        className="align-items-center justify-content-between"
        direction="horizontal"
      >
        <h1 className="body1 text-primary d-flex align-items-center gap-2 m-0"></h1>
        <Button
          variant="link"
          className="text-decoration-none text-primary body1"
          onClick={() => close()}
        >
          <i className="bi bi-x-lg text-primary" />
        </Button>
      </Stack>
      <Stack
        className="align-items-center justify-content-center text-center"
        gap={3}
      >
        <span
          className="text-success"
          style={{ fontSize: "calc(10px + 10vmin)" }}
        >
          <i className="bi bi-check-circle" />
        </span>
        <h1 className="body2 text-primary m-0">Wallet created successfully</h1>
        <p className="caption m-0">
          Congratulations, your wallet has been created successfully
        </p>
        <Stack
          className="bg-black align-items-center justify-content-between flex-wrap w-100 p-3 rounded-2 caption"
          direction="horizontal"
        >
          <span className="text-body">Identity Address:</span>
          {`${address.substring(0, 17)}-${address.substring(
            address.length - 9,
            address.length
          )}`}
          <button className="text-primary" onClick={handleCopy}>
            <i className="bi bi-files" />
          </button>
        </Stack>
        <p className="d-flex align-items-start gap-1 m-0">
          <i className="bi bi-info-circle mt-1" />
          Please securely store the above to store and transfer your assets and
          funds in the future
        </p>
        <Stack className="w-100 mt-2">
          <button className="am-link ms-auto px-3" onClick={handleConnect}>
            Connect
          </button>
        </Stack>
      </Stack>
    </div>
  );
}
