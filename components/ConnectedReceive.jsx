import React, { Suspense, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { shortenAddress } from "../lib";
import { Button, Modal, Stack } from "react-bootstrap";

const ConnectedReceive = ({ displayAddress }) => {
  const [Show, setShow] = useState(false);
  return (
    <>
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
          className="bg-black rounded-4 p-3 align-items-center justify-content-center border-color-primary-hover"
          gap={2}
          role="button"
          onClick={() => setShow(true)}
        >
          <div
            style={{
              width: "min(140px, 100%)",
              height: "124px",
              aspectRatio: "1/1",
              position: "relative",
            }}
          >
            <Suspense fallback={"Loading..."}>
              <QRCodeSVG width="100%" height="100%" value={displayAddress} />
            </Suspense>
          </div>
          <h4 className="body2 text-primary m-0">Wallet Address</h4>
          <Button
            variant="link"
            className="d-flex align-items-center justify-content-center gap-2 text-center caption2 p-0 text-decoration-none text-wrap text-break text-white"
            onClick={() => navigator.clipboard.writeText(displayAddress)}
          >
            <Suspense fallback="Loading...">
              {shortenAddress(displayAddress)}
            </Suspense>
            <span className="text-primary">
              <i className="bi bi-clipboard" />
            </span>
          </Button>
        </Stack>
      </Stack>
      <Modal
        show={Show}
        onHide={() => setShow(false)}
        centered
        size="md"
        aria-labelledby="receive-modal"
      >
        <Modal.Body className="p-0">
          <Stack className="p-3">
            <Stack
              className="bg-black rounded-4 p-4 px-2 align-items-center justify-content-center"
              gap={2}
            >
              <div
                style={{
                  width: "min(350px, 100%)",
                  aspectRatio: "1/1",
                  position: "relative",
                }}
              >
                <Suspense fallback="Loading...">
                  <QRCodeSVG
                    width="100%"
                    height="100%"
                    value={displayAddress}
                  />
                </Suspense>
              </div>
              <h4 className="body2 text-primary m-0">Wallet Address</h4>
              <Button
                variant="link"
                className="d-flex align-items-center justify-content-center gap-2 text-center caption2 p-0 text-decoration-none text-wrap text-break text-white"
                onClick={() => navigator.clipboard.writeText(displayAddress)}
              >
                <Suspense fallback="Loading...">{displayAddress}</Suspense>
                <span className="text-primary">
                  <i className="bi bi-clipboard" />
                </span>
              </Button>
            </Stack>
          </Stack>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ConnectedReceive;
