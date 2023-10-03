import Link from "next/link";
import React, { useRef, useState } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import { defaultChainName, useCompositeWallet } from "../../config";
import { ConnectOptionObject, mantleWalletV1URL } from "../../data";
import { cleanString } from "../../lib";
import useSwr from "swr";

const ConnectModal = ({ setOpen, walletRepo }) => {
  const { connectCompositeWallet } = useCompositeWallet(defaultChainName);
  const [setShowKeystoreModal, setSetShowKeystoreModal] = useState(false);
  const [setShowKeystoreConfirmModal, setSetShowKeystoreConfirmModal] =
    useState(false);
  const { mutate: mutateStateKeystoreJson } = useSwr("stateKeystoreJson");

  const formControlFileRef = useRef(null);
  const formControlPasswordRef = useRef(null);

  function handleCloseModal(e) {
    e.preventDefault();
    setOpen(false);
  }

  const handleSubmitKeystore = async (e) => {
    e.preventDefault();
    setSetShowKeystoreModal(false);
    const fileRaw = formControlFileRef.current.files[0];
    const fileReader = new FileReader();
    let keystoreJson;
    fileReader.readAsText(fileRaw, "UTF-8");
    fileReader.onload = (event) => {
      keystoreJson = JSON.parse(event.target.result);
      console.log("keystoreJson: ", keystoreJson);
      mutateStateKeystoreJson({
        keystoreJson,
        keystorePassword: formControlPasswordRef.current.value,
      });
      connectCompositeWallet("keystore", "keystore");
    };
  };

  const customWallets = [
    {
      walletPrettyName: "Ledger",
      walletName: "ledger",
      walletType: "ledger",
    },
    {
      walletPrettyName: "Keystore",
      walletName: "keystore",
      walletType: "keystore",
    },
    {
      walletPrettyName: "Generate Only",
      walletName: "generateonly",
      walletType: "generateonly",
    },
  ];

  const keystoreModalJSX = (
    <Modal
      show={setShowKeystoreModal}
      onHide={() => setSetShowKeystoreModal(false)}
      centered
      size="md"
      aria-labelledby="delegation-modal"
      scrollable
    >
      <Modal.Body className="p-0">
        <Stack className="m-auto p-4 rounded-3 w-100">
          <Stack
            className="align-items-center justify-content-between"
            direction="horizontal"
          >
            <h5 className="body2 text-primary d-flex align-items-center gap-2 m-0">
              <button
                className="primary bg-transparent"
                onClick={() => setSetShowKeystoreModal(false)}
              >
                <i className="bi bi-chevron-left text-primary" />
              </button>
              Keystore
            </h5>
            <button
              className="primary bg-transparent"
              onClick={() => setSetShowKeystoreModal(false)}
            >
              <i className="bi bi-x-lg text-primary" />
            </button>
          </Stack>
          <Stack
            className="align-items-center justify-content-end"
            gap={2}
            direction="horizontal"
          >
            <Form onSubmit={handleSubmitKeystore}>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Default file input example</Form.Label>
                <Form.Control type="file" ref={formControlFileRef} />
              </Form.Group>
              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Default file input example</Form.Label>
                <Form.Control type="password" ref={formControlPasswordRef} />
              </Form.Group>
              <Button
                variant="primary"
                className="rounded-5 px-5 py-2 fw-medium"
                type="submit"
              >
                Submit
              </Button>
            </Form>
          </Stack>
        </Stack>
      </Modal.Body>
    </Modal>
  );

  const keystoreConfirmModalJSX = (
    <Modal
      show={setShowKeystoreConfirmModal}
      onHide={() => setSetShowKeystoreConfirmModal(false)}
      centered
      size="md"
      aria-labelledby="delegation-modal"
      scrollable
    >
      <Modal.Body className="p-0">
        <Stack className="m-auto p-4 rounded-3 w-100">
          <Stack
            className="align-items-center justify-content-between"
            direction="horizontal"
          >
            <h5 className="body2 text-primary d-flex align-items-center gap-2 m-0">
              <button
                className="primary bg-transparent"
                onClick={() => setSetShowKeystoreConfirmModal(false)}
              >
                <i className="bi bi-chevron-left text-primary" />
              </button>
              Delegate
            </h5>
            <button
              className="primary bg-transparent"
              onClick={() => setSetShowKeystoreConfirmModal(false)}
            >
              <i className="bi bi-x-lg text-primary" />
            </button>
          </Stack>
          <Stack className="py-4 text-center">
            <div>
              <Stack
                className="p-3 border border-white py-2 rounded-2"
                direction="horizontal"
                gap={2}
              >
                <input
                  className="bg-transparent flex-grow-1 border border-0"
                  id="delegationAmount"
                  type="text"
                  // value={stakeState?.delegationAmount}
                  placeholder="Enter Delegation Amount"
                />
                <button className="text-primary">Max</button>
              </Stack>
            </div>
          </Stack>
          <Stack
            className="align-items-center justify-content-end"
            gap={2}
            direction="horizontal"
          >
            <Button
              variant="primary"
              className="rounded-5 px-5 py-2 fw-medium"
              // onClick={}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Modal.Body>
    </Modal>
  );

  return (
    <>
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
            <div className="bg-am-gray-200 p-4 rounded-4 w-100 my-auto">
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

              <Stack className="mt-5" gap={3}>
                <h2 className="caption text-white m-0">
                  Connect with Extension Wallets
                </h2>
                <Stack direction="horizontal" gap={2} className="flex-wrap">
                  {walletRepo?.wallets.map(
                    ({ walletPrettyName, walletName }, index) => (
                      <Button
                        variant="outline-primary"
                        className="d-flex align-items-center gap-2 py-2 px-3 rounded-2 fw-medium"
                        key={index}
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={async () => {
                          await connectCompositeWallet("cosmosKit", walletName);
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
                  Connect with Custom Wallets
                </h2>
                <Stack direction="horizontal" gap={2} className="flex-wrap">
                  <Button
                    variant="outline-primary"
                    className="d-flex align-items-center gap-2 py-2 px-3 rounded-2 fw-medium"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={async () => {
                      await connectCompositeWallet?.(
                        customWallets?.[0]?.walletType,
                        customWallets?.[0]?.walletName
                      );
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
                          ConnectOptionObject[
                            cleanString(customWallets?.[0]?.walletPrettyName)
                          ]?.icon
                        }
                        alt={customWallets?.[0]?.walletPrettyName}
                      />
                    </div>
                    {customWallets?.[0]?.walletPrettyName}
                  </Button>
                  <Button
                    variant="outline-primary"
                    className="d-flex align-items-center gap-2 py-2 px-3 rounded-2 fw-medium"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={async () => {
                      setSetShowKeystoreModal(true);
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
                          ConnectOptionObject[
                            cleanString(customWallets?.[1]?.walletPrettyName)
                          ]?.icon
                        }
                        alt={customWallets?.[1]?.walletPrettyName}
                      />
                    </div>
                    {customWallets?.[1]?.walletPrettyName}
                  </Button>
                  <Button
                    variant="outline-primary"
                    className="d-flex align-items-center gap-2 py-2 px-3 rounded-2 fw-medium"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={async () => {
                      await connectCompositeWallet?.(
                        customWallets?.[2]?.walletType,
                        customWallets?.[2]?.walletName
                      );
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
                          ConnectOptionObject[
                            cleanString(customWallets?.[2]?.walletPrettyName)
                          ]?.icon
                        }
                        alt={customWallets?.[2]?.walletPrettyName}
                      />
                    </div>
                    {customWallets?.[2]?.walletPrettyName}
                  </Button>
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
      {keystoreModalJSX}
      {keystoreConfirmModalJSX}
    </>
  );
};

export default ConnectModal;
