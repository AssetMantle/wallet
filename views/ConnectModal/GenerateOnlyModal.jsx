import React from "react";
import { Button, Modal, Stack } from "react-bootstrap";
import useSwr from "swr";

export default function GenerateOnlyModal({
  ShowGenerateOnlyModal,
  setShowGenerateOnlyModal,
}) {
  const { mutate: mutateGenerateOnlyMsgModal } = useSwr("generateOnlyModal");
  return (
    <Modal
      show={ShowGenerateOnlyModal}
      onHide={() => setShowGenerateOnlyModal(false)}
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
                onClick={() => setShowGenerateOnlyModal(false)}
              >
                <i className="bi bi-chevron-left text-primary" />
              </button>
              Generate Only Mode
            </h5>
            <button
              className="primary bg-transparent"
              onClick={() => setShowGenerateOnlyModal(false)}
            >
              <i className="bi bi-x-lg text-primary" />
            </button>
          </Stack>
          <Stack className="py-4" gap={1}>
            <label htmlFor="GenerateOnly-address">Address</label>
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
                // value={e=>}
                placeholder="Enter Address"
                required
              />
            </Stack>
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
              onClick={() => {
                setShowGenerateOnlyModal(false);
                // mutateGenerateOnlyMsgModal({ show: true, value: "some value" });
              }}
            >
              OK
            </Button>
          </Stack>
        </Stack>
      </Modal.Body>
    </Modal>
  );
}
