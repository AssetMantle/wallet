import React from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import { toast } from "react-toastify";
import useSwr from "swr";
import { toastConfig } from "../../config";
import DownloadLink from "react-download-link";

export default function GenerateOnlyMsgModal() {
  const {
    data: { show: showModal, value: valueModal },
    mutate: mutateModal,
  } = useSwr("generateOnlyModal");
  let msgDigestString = JSON.stringify(valueModal);

  const handleCloseGenerateOnlyMsgModal = () => {
    mutateModal({ show: false, value: null });
  };

  return (
    <Modal
      show={showModal}
      onHide={handleCloseGenerateOnlyMsgModal}
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
                onClick={handleCloseGenerateOnlyMsgModal}
              >
                <i className="bi bi-chevron-left text-primary" />
              </button>
              Generate Only Mode Transaction
            </h5>
            <Stack direction="horizontal">
              <button
                className="primary bg-transparent"
                onClick={() => {
                  navigator.clipboard.writeText(msgDigestString);
                  toast.info("Keystore Copied to clipboard", toastConfig);
                }}
              >
                <i className="bi bi-files text-primary" />
              </button>
              <button
                className="primary bg-transparent"
                onClick={handleCloseGenerateOnlyMsgModal}
              >
                <i className="bi bi-x-lg text-primary" />
              </button>
            </Stack>
          </Stack>
          <Stack className="mt-3 py-2 rounded-2" direction="horizontal" gap={2}>
            <Form.Group
              className="mb-3 border-0 w-100"
              controlId="GenerateOnlyTextArea"
            >
              <Form.Label>Transaction Message</Form.Label>
              <Form.Control
                as="textarea"
                className="w-100"
                rows={13}
                value={msgDigestString}
              />
            </Form.Group>
          </Stack>
          <Stack gap={2} className="my-2">
            <a
              href=""
              className="text-decoration-none caption2 text-primary fw-normal"
            >
              What is Generate Only mode? &#8599;
            </a>
          </Stack>

          <Stack
            className="align-items-center justify-content-end mt-3"
            gap={2}
            direction="horizontal"
          >
            <Button
              variant="outline-primary"
              className="rounded-5 px-5 py-2 fw-medium"
            >
              <DownloadLink
                style={{ textDecoration: "none" }}
                label="Download"
                filename={`Transaction.json`}
                exportFile={() => `${msgDigestString}`}
              />
            </Button>
            <Button
              variant="primary"
              className="rounded-5 px-5 py-2 fw-medium"
              onClick={handleCloseGenerateOnlyMsgModal}
            >
              OK
            </Button>
          </Stack>
        </Stack>
      </Modal.Body>
    </Modal>
  );
}
