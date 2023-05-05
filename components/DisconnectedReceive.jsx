import Image from "next/image";
import React from "react";
import { placeholderAddress } from "../data";
import { Stack } from "react-bootstrap";

const DisconnectedReceive = () => {
  return (
    <Stack
      className="rounded-4 p-3 bg-light-subtle width-100 transitionAll flex-grow-0"
      gap={2}
    >
      <Stack
        direction="horizontal"
        gap={3}
        as="nav"
        className="align-items-center justify-content-between"
      >
        <Stack className="align-items-center" direction="horizontal" gap={3}>
          <button className={`body1 text-primary`}>Receive</button>
        </Stack>
      </Stack>
      <Stack
        className="bg-black rounded-4 p-3 align-items-center justify-content-center"
        gap={3}
      >
        <Stack
          className="text-gray position-relative justify-content-center m-auto"
          style={{
            width: "min(140px, 100%)",
            aspectRatio: "1/1",
          }}
        >
          <Image src="/qr-code.svg" layout="fill" alt="qr code place holder" />
        </Stack>
        <h4 className="body2 text-primary m-0">Wallet Address</h4>
        <Stack
          direction="horizontal"
          className="align-items-center justify-content-center text-gray text-center caption2 pt-1"
          gap={2}
        >
          {placeholderAddress}
          <span className="text-gray">
            <i className="bi bi-clipboard" />
          </span>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DisconnectedReceive;
