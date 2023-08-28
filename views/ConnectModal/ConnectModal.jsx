import Link from "next/link";
import React from "react";
import { ConnectOptionObject, mantleWalletV1URL } from "../../data";
import { cleanString } from "../../lib";
import { Button, Stack } from "react-bootstrap";

const ConnectModal = ({ setOpen, walletRepo, Show }) => {
  function handleCloseModal(e) {
    e.preventDefault();
    setOpen(false);
  }

  return (
    <>
      {/* <Modal
        show={Show}
        onHide={() => setOpen(false)}
        centered
        size="lg"
        aria-labelledby="wallet-connect-modal"
      >
        <Modal.Body className="p-0">
          <div className="bg-secondary p-4 rounded-4 w-100 my-auto">
            <Stack
              direction="horizontal"
              className="align-items-center justify-content-between"
            >
              <h1 className="body1 text-primary m-0">Connect Wallet</h1>
              <Button
                variant="link"
                className="text-decoration-none text-primary body1"
                onClick={handleCloseModal}
              >
                <i className="bi bi-x-lg text-primary" />
              </Button>
            </Stack>
            <div className="text-white body2 my-1 text-center">
              Connect With
            </div>
            <p className="text-white-50 caption my-1 text-center">
              Connect your wallet using any of the options below
            </p>
            <Stack className="mt-5" gap={3}>
              <h2 className="caption text-white m-0">
                Connect with existing Wallet
              </h2>
              <Stack direction="horizontal" gap={2} className="flex-wrap">
                {walletRepo?.wallets.map(
                  (
                    { walletPrettyName, connect, isError, isWalletConnected },
                    index
                  ) => (
                    <Button
                      variant="outline-primary"
                      className="d-flex align-items-center gap-2 py-2 px-3 rounded-2"
                      key={index}
                      // data-bs-dismiss="modal"
                      // aria-label="Close"
                      onClick={async () => {
                        await connect();
                        setOpen(false);
                      }}
                    >
                      <div
                        className="position-relative overflow-hidden"
                        style={{ width: "25px", aspectRatio: "1/1" }}
                      >
                        <img
                          layout="fill"
                          className="h-100 w-100"
                          style={{
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                          src={
                            ConnectOptionObject[cleanString(walletPrettyName)]
                              ?.icon
                          }
                          alt={walletPrettyName}
                        />
                      </div>
                      {walletPrettyName}
                    </Button>
                  )
                )}
              </Stack>
            </Stack>

            <Stack className="mt-5" gap={3}>
              <h2 className="caption text-white m-0">
                Go to Old Wallet for Keystore & Ledger
              </h2>
              <Stack className="flex-wrap" direction="horizontal" gap={3}>
                <Link href={mantleWalletV1URL}>
                  <a>
                    <Button
                      className="d-flex align-items-center gap-2 text-primary py-2 px-3 rounded-2"
                      variant="outline-primary"
                    >
                      <div
                        className="position-relative"
                        style={{ width: "25px", aspectRatio: "1/1" }}
                      >
                        <img
                          layout="fill"
                          src={"/favicon.png"}
                          alt={"v1_wallet"}
                        />
                      </div>
                      MantleWallet V1 (Old)
                    </Button>
                  </a>
                </Link>
              </Stack>
            </Stack>
          </div>
        </Modal.Body>
      </Modal> */}
      <div
        className="modal "
        tabIndex="-1"
        role="dialog"
        id="WalletConnectModal"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          style={{ maxWidth: "min(100%, 600px)" }}
        >
          <div className="modal-content">
            <div className="bg-secondary p-4 rounded-4 w-100 my-auto">
              <Stack
                direction="horizontal"
                className="align-items-center justify-content-between"
              >
                <h1 className="body1 text-primary m-0">Connect Wallet</h1>
                <Button
                  variant="link"
                  className="text-decoration-none text-primary body1"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleCloseModal}
                >
                  <i className="bi bi-x-lg text-primary" />
                </Button>
              </Stack>
              <div className="text-white body2 my-1 text-center">
                Connect With
              </div>
              <p className="text-white-50 caption my-1 text-center">
                Connect your wallet using any of the options below
              </p>
              <Stack className="mt-5" gap={3}>
                <h2 className="caption text-white m-0">
                  Connect with existing Wallet
                </h2>
                <Stack direction="horizontal" gap={2} className="flex-wrap">
                  {walletRepo?.wallets.map(
                    (
                      { walletPrettyName, connect, isError, isWalletConnected },
                      index
                    ) => (
                      <Button
                        variant="outline-primary"
                        className="d-flex align-items-center gap-2 py-2 px-3 rounded-2 fw-medium"
                        key={index}
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={async () => {
                          await connect();
                          setOpen(false);
                        }}
                      >
                        <div
                          className="position-relative overflow-hidden"
                          style={{
                            width: "25px",
                            aspectRatio: "1/1",
                            borderRadius: "7px",
                          }}
                        >
                          <img
                            layout="fill"
                            className="h-100 w-100"
                            style={{
                              objectFit: "cover",
                              objectPosition: "center",
                            }}
                            src={
                              ConnectOptionObject[cleanString(walletPrettyName)]
                                ?.icon
                            }
                            alt={walletPrettyName}
                          />
                        </div>
                        {walletPrettyName}
                      </Button>
                    )
                  )}
                </Stack>
              </Stack>

              <Stack className="mt-5" gap={3}>
                <h2 className="caption text-white m-0">
                  Go to Old Wallet for Keystore
                </h2>
                <Stack className="flex-wrap" direction="horizontal" gap={3}>
                  <Link href={mantleWalletV1URL}>
                    <a>
                      <Button
                        className="d-flex align-items-center gap-2 py-2 px-3 rounded-2 fw-medium"
                        variant="outline-primary"
                      >
                        <div
                          className="position-relative"
                          style={{ width: "25px", aspectRatio: "1/1" }}
                        >
                          <img
                            layout="fill"
                            src={"/favicon.png"}
                            alt={"v1_wallet"}
                          />
                        </div>
                        MantleWallet V1 (Old)
                      </Button>
                    </a>
                  </Link>
                </Stack>
              </Stack>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConnectModal;
