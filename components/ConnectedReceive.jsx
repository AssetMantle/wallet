import React, { Suspense } from "react";
import { QRCodeSVG } from "qrcode.react";
import { shortenAddress } from "../lib";
import { Stack } from "react-bootstrap";

const ConnectedReceive = ({ displayAddress }) => {
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
          gap={3}
          role="button"
          data-bs-toggle="modal"
          data-bs-target="#receiveModal"
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
          <button
            className="d-flex align-items-center justify-content-center gap-2 text-center caption2 pt-1"
            onClick={() => navigator.clipboard.writeText(displayAddress)}
            style={{ wordBreak: "break-all" }}
          >
            <Suspense fallback="Loading...">
              {shortenAddress(displayAddress)}
            </Suspense>
            <span className="text-primary">
              <i className="bi bi-clipboard" />
            </span>
          </button>
        </Stack>
      </Stack>
      <div className="modal " tabIndex="-1" role="dialog" id="receiveModal">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body p-3  d-flex flex-column">
              <div className="bg-black rounded-4 d-flex flex-column p-4 px-2 gap-2 align-items-center justify-content-center">
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
                <h4 className="body2 text-primary pt-1">Wallet Address</h4>
                <button
                  className="d-flex align-items-center justify-content-center gap-2 text-center caption2"
                  onClick={() => navigator.clipboard.writeText(displayAddress)}
                  style={{ wordBreak: "break-all" }}
                >
                  <Suspense fallback="Loading...">{displayAddress}</Suspense>
                  <span className="text-primary">
                    <i className="bi bi-clipboard" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConnectedReceive;
