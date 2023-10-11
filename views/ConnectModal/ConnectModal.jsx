import Link from "next/link";
import React, { useRef, useState } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import {
  defaultChainName,
  toastConfig,
  useCompositeWallet,
} from "../../config";
import {
  ConnectOptionObject,
  KEYSTORE_JSON_INVALID,
  mantleWalletV1URL,
} from "../../data";
import { cleanString } from "../../lib";
import useSwr from "swr";
import { toast } from "react-toastify";

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
    try {
      const fileReader = new FileReader();
      let keystoreJson;
      fileReader.readAsText(fileRaw, "UTF-8");
      fileReader.onload = (event) => {
        try {
          console.log("event.target.result: ", event.target.result);
          keystoreJson = JSON.parse(event.target.result);
          const stateKeystoreJson = {
            keystoreJson: keystoreJson,
            keystorePassword: formControlPasswordRef.current.value,
          };
          console.log("stateKeystoreJson: ", stateKeystoreJson);

          mutateStateKeystoreJson(stateKeystoreJson);
          connectCompositeWallet("keystore", "keystore");
        } catch (error) {
          console.error("Error during Keystore FileReader: ", error);
          toast.error(KEYSTORE_JSON_INVALID, toastConfig);
        }
      };
    } catch (error) {
      console.error("Error during Keystore FileReader2: ", error);
      toast.error(KEYSTORE_JSON_INVALID, toastConfig);
    }
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
      show={ShowKeystoreModal}
      onHide={() => setShowKeystoreModal(false)}
      centered
      size="md"
      aria-labelledby="keystore-modal"
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
                onClick={() => setShowKeystoreModal(false)}
              >
                <i className="bi bi-chevron-left text-primary" />
              </button>
              Keystore
            </h5>
            <button
              className="primary bg-transparent"
              onClick={() => setShowKeystoreModal(false)}
            >
              <i className="bi bi-x-lg text-primary" />
            </button>
          </Stack>
          <Stack
            direction="horizontal"
            className="align-items-center justify-content-between"
            role="button"
            onClick={() => setKeystoreAdvanced((el) => !el)}
          >
            <p className="fw-medium caption">Advanced</p>
            <span
              className="transitionAll d-flex align-items-center justify-content-center"
              style={{
                transform: KeystoreAdvanced ? "rotate(180deg)" : "rotate(0deg)",
                transformOrigin: "center",
              }}
            >
              <i className="bi bi-chevron-down" />
            </span>
          </Stack>
          {KeystoreAdvanced && (
            <Stack gap={3}>
              <label htmlFor="accountNumber">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                id="accountNumber"
                placeholder="Account Number"
                className="bg-transparent p-3 py-2 rounded-2 border border-secondary w-100 color-am-gray-100s"
                onChange={(e) => !isNaN(e.target.value) && e.target.value}
              />
              <label htmlFor="accountIndex">Account Index</label>
              <input
                type="text"
                name="accountIndex"
                id="accountIndex"
                placeholder="Account Index"
                className="bg-transparent p-3 py-2 rounded-2 border border-secondary w-100 color-am-gray-100s"
                onChange={(e) => !isNaN(e.target.value) && e.target.value}
              />
              <label htmlFor="accountBip32">bip39Passphrase</label>
              <input
                type="password"
                name="accountBip32"
                id="accountBip32"
                placeholder="Enter bip39Passphrase (Optional)"
                className="bg-transparent p-3 py-2 rounded-2 border border-secondary w-100 color-am-gray-100s"
              />
            </Stack>
          )}
          <Stack
            className="align-items-center justify-content-end mt-3"
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
      show={KeystoreConfirmModal}
      onHide={() => setKeystoreConfirmModal(false)}
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
                onClick={() => {
                  setShowKeystoreModal(true);
                  setKeystoreConfirmModal(false);
                }}
              >
                <i className="bi bi-chevron-left text-primary" />
              </button>
              Login With KeyStore
            </h5>
            <button
              className="primary bg-transparent"
              onClick={() => setKeystoreConfirmModal(false)}
            >
              <i className="bi bi-x-lg text-primary" />
            </button>
          </Stack>
          <Stack className="py-4" gap={3}>
            <Row>
              <Col xs={4} className="fw-medium caption text-end">
                Wallet path:
              </Col>
              <Col xs={8} className="caption"></Col>
            </Row>
            <Row>
              <Col xs={4} className="fw-medium caption text-end">
                Address:
              </Col>
              <Col xs={8} className="caption"></Col>
            </Row>
          </Stack>
          <Stack
            className="align-items-center justify-content-end "
            gap={2}
            direction="horizontal"
          >
            <Button
              variant="primary"
              className="rounded-5 px-5 py-2 fw-medium"
              // onClick={}
            >
              Login
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
                      setShowKeystoreModal(true);
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
