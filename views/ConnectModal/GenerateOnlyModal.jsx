import React, { useRef, useState } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import useSwr from "swr";
import { defaultChainName, useCompositeWallet } from "../../config";
import { isInvalidAddress } from "../../data";

export default function GenerateOnlyModal({
  ShowGenerateOnlyModal,
  setShowGenerateOnlyModal,
}) {
  const { mutate: mutateStateGenerateOnly } = useSwr("stateGenerateOnly");
  // const [generateOnlyAddress, setGenerateOnlyAddress] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState(" ");
  const { connectCompositeWallet } = useCompositeWallet(defaultChainName);
  const formControlAddressRef = useRef(null);

  const handleCloseGenerateOnlyModal = (e) => {
    // e.preventDefault();
    setShowGenerateOnlyModal(false);
    // setGenerateOnlyAddress("");
  };

  const handleSubmitGenerateOnly = (e) => {
    const generateOnlyAddress = formControlAddressRef?.current?.value;
    console.log(
      "inside handleSubmitGenerateOnly generateOnlyAddress: ",
      generateOnlyAddress
    );
    e.preventDefault();
    const isInvalid = isInvalidAddress(generateOnlyAddress);

    if (!isInvalid) {
      setFeedbackMessage("");
      mutateStateGenerateOnly(generateOnlyAddress);
      connectCompositeWallet("generateOnly", "generateOnly");
      handleCloseGenerateOnlyModal(e);
    } else {
      setFeedbackMessage("Invalid AssetMantle Address");
    }
  };

  /* const handleOnChangeGenerateOnly = (e) => {
    e.preventDefault();
    setGenerateOnlyAddress(e.target.value);
  }; */

  return (
    <Modal
      show={ShowGenerateOnlyModal}
      onHide={handleCloseGenerateOnlyModal}
      centered
      size="md"
      aria-labelledby="GenerateOnly-modal"
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
                onClick={handleCloseGenerateOnlyModal}
              >
                <i className="bi bi-chevron-left text-primary" />
              </button>
              Generate Only Mode
            </h5>
            <button
              className="primary bg-transparent"
              onClick={handleCloseGenerateOnlyModal}
            >
              <i className="bi bi-x-lg text-primary" />
            </button>
          </Stack>
          <Form onSubmit={handleSubmitGenerateOnly}>
            <Stack className="py-4" gap={1}>
              <Form.Group controlId="genOnly" className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter AssetMantle Address"
                  ref={formControlAddressRef}
                  required
                />
                <Form.Text className="text-bg-danger">
                  {feedbackMessage}
                </Form.Text>
              </Form.Group>

              {/*  <label htmlFor="GenerateOnly-address">Address</label>
              <Stack
                className="p-3 border border-white py-2 rounded-2"
                direction="horizontal"
                gap={2}
              >
                <input
                  className="bg-transparent flex-grow-1 border border-0"
                  id="GenerateOnly-address"
                  name="GenerateOnly-address"
                  type="text"
                  placeholder="Enter AssetMantle Address"
                  value={generateOnlyAddress}
                  onChange={handleOnChangeGenerateOnly}
                  required
                />
              </Stack> */}
            </Stack>
            <Stack gap={2} className="my-2">
              <a
                href=""
                className="text-decoration-none caption2 text-primary fw-normal"
              >
                what is Generate Only mode? &#8599;
              </a>
            </Stack>

            <Stack
              className="align-items-center justify-content-end mt-3"
              gap={2}
              direction="horizontal"
            >
              <Button
                variant="primary"
                className="rounded-5 px-5 py-2 fw-medium"
                type="submit"
              >
                OK
              </Button>
            </Stack>
          </Form>
        </Stack>
      </Modal.Body>
    </Modal>
  );
}
