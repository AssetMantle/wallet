import React, { Suspense } from "react";
import { QRCodeSVG } from "qrcode.react";

const ConnectedRecieve = ({ displayAddress }) => {
  return (
    <>
      <div
        className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column gap-2 transitionAll"
        role="button"
        data-bs-toggle="modal"
        data-bs-target="#receiveModal"
      >
        <nav className="d-flex align-items-center justify-content-between gap-3">
          <div className="d-flex gap-3 align-items-center">
            <button className={`body1 text-primary`}>Receive</button>
          </div>
        </nav>
        <div className="nav-bg rounded-4 d-flex flex-column p-3 gap-2 align-items-center justify-content-center">
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
          <h4 className="body2 text-primary">Wallet Address</h4>
          <button
            className="d-flex align-items-center justify-content-center gap-2 text-center caption2 pt-1"
            onClick={() => navigator.clipboard.writeText(displayAddress)}
            style={{ wordBreak: "break-all" }}
          >
            <Suspense fallback="Loading...">
              {`${displayAddress.substring(
                0,
                12
              )}.......${displayAddress.substring(
                displayAddress.length - 9,
                displayAddress.length
              )}`}
            </Suspense>
            <span className="text-primary">
              <i className="bi bi-clipboard" />
            </span>
          </button>
        </div>
      </div>
      <div className="modal " tabIndex="-1" role="dialog" id="receiveModal">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body p-3  d-flex flex-column">
              <div className="nav-bg rounded-4 d-flex flex-column p-4 px-2 gap-2 align-items-center justify-content-center">
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

export default ConnectedRecieve;
