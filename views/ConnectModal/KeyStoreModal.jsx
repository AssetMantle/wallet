import React, { useRef, useState } from "react";
import { Button, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import {
  defaultChainName,
  toastConfig,
  useCompositeWallet,
} from "../../config";
import { KEYSTORE_JSON_INVALID } from "../../data";
import useSwr from "swr";
import { toast } from "react-toastify";

export default function KeyStoreModal({
  ShowKeystoreModal,
  setShowKeystoreModal,
}) {
  const { connectCompositeWallet, compositeWallet } =
    useCompositeWallet(defaultChainName);
  const [KeystoreAdvanced, setKeystoreAdvanced] = useState(false);

  const [KeystoreConfirmModal, setKeystoreConfirmModal] = useState(false);

  const { mutate: mutateStateKeystoreJson } = useSwr("stateKeystoreJson");
  const formControlFileRef = useRef(null);
  const formControlPasswordRef = useRef(null);
  const formControlAccountNumRef = useRef(null);
  const formControlAccountIndexRef = useRef(null);
  const formControlPassphraseRef = useRef(null);
  let stateKeystoreJson = {};

  const handleCloseKeystoreModal = () => {
    // setKeystoreAdvanced(false);
    setShowKeystoreModal(false);
  };

  const handleSubmitKeystore = async (e) => {
    console.log("inside handleSubmitKeystore");
    e.preventDefault();
    const fileRaw = formControlFileRef.current.files[0];
    try {
      const fileReader = new FileReader();
      let keystoreJson;
      fileReader.readAsText(fileRaw, "UTF-8");
      fileReader.onload = (event) => {
        try {
          keystoreJson = JSON.parse(event.target.result);
          stateKeystoreJson = {
            keystoreJson: keystoreJson,
            keystorePassword: formControlPasswordRef?.current?.value,
            accountNumber: formControlAccountNumRef?.current?.value,
            addressIndex: formControlAccountIndexRef?.current?.value,
            passphrase: formControlPassphraseRef?.current?.value,
          };

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
    handleCloseKeystoreModal();
  };

  // console.log("stateKeystoreJson: ", stateKeystoreJson);
  return (
    <>
      <Modal
        show={ShowKeystoreModal}
        onHide={handleCloseKeystoreModal}
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
                  onClick={handleCloseKeystoreModal}
                >
                  <i className="bi bi-chevron-left text-primary" />
                </button>
                Keystore
              </h5>
              <button
                className="primary bg-transparent"
                onClick={handleCloseKeystoreModal}
              >
                <i className="bi bi-x-lg text-primary" />
              </button>
            </Stack>

            <Stack
              className="align-items-center mt-3"
              gap={2}
              direction="horizontal"
            >
              <Form className="w-100" onSubmit={handleSubmitKeystore}>
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label htmlFor="keystore-file">KeyStore file</Form.Label>
                  <Form.Control
                    type="file"
                    ref={formControlFileRef}
                    name="keystore-file"
                    id="keystore-file"
                    required
                    accept=".json"
                  />
                </Form.Group>
                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label htmlFor="keystore-password">Password</Form.Label>
                  <Form.Control
                    type="password"
                    ref={formControlPasswordRef}
                    id="keystore-password"
                    name="keystore-password"
                    placeholder="Enter Password"
                    required
                  />
                </Form.Group>
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
                      transform: KeystoreAdvanced
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transformOrigin: "center",
                    }}
                  >
                    <i className="bi bi-chevron-down" />
                  </span>
                </Stack>
                {KeystoreAdvanced && (
                  <Stack gap={1} className="pb-2">
                    <Form.Group controlId="formAccountNumber" className="mb-3">
                      <Form.Label htmlFor="accountNumber">
                        Account Number
                      </Form.Label>
                      <Form.Control
                        ref={formControlAccountNumRef}
                        type="number"
                        name="accountNumber"
                        id="accountNumber"
                        placeholder="Account Number"
                        min={0}
                        max={2147483647}
                      />
                    </Form.Group>
                    <Form.Group controlId="formAccountIndex" className="mb-3">
                      <Form.Label htmlFor="accountIndex">
                        Address Index
                      </Form.Label>
                      <Form.Control
                        ref={formControlAccountIndexRef}
                        type="number"
                        name="accountIndex"
                        id="accountIndex"
                        placeholder="Address Index"
                        min={0}
                        max={2147483647}
                      />
                    </Form.Group>
                    <Form.Group
                      controlId="formBip39Passphrase"
                      className="mb-3"
                    >
                      <Form.Label htmlFor="bip39Passphrase">
                        BIP39 Passphrase
                      </Form.Label>
                      <Form.Control
                        ref={formControlPassphraseRef}
                        type="password"
                        name="bip39Passphrase"
                        id="bip39Passphrase"
                        placeholder="Enter bip39Passphrase (Optional)"
                      />
                    </Form.Group>
                  </Stack>
                )}
                {/*  <Stack gap={2} className="my-2">
                  <a
                    href=""
                    className="text-decoration-none caption2 text-primary fw-normal"
                  >
                    Create keystore from new wallet &#8599;
                  </a>
                  <a
                    href=""
                    className="text-decoration-none caption2 text-primary fw-normal"
                  >
                    Generate keystore from existing wallet &#8599;
                  </a>
                </Stack> */}
                <Stack>
                  <Button
                    variant="primary"
                    className="rounded-5 px-5 py-2 fw-medium ms-auto"
                    type="submit"
                  >
                    Submit
                  </Button>
                </Stack>
              </Form>
            </Stack>
          </Stack>
        </Modal.Body>
      </Modal>

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
                <Col xs={8} className="caption">
                  {compositeWallet?.status === "Connected" &&
                    compositeWallet?.hdPath}
                </Col>
              </Row>
              <Row>
                <Col xs={4} className="fw-medium caption text-end">
                  Address:
                </Col>
                <Col xs={8} className="caption">
                  {compositeWallet?.status === "Connected" &&
                    compositeWallet?.address}
                </Col>
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
    </>
  );
}
