import React, { useState } from "react";
import { Button, Modal, Stack } from "react-bootstrap";

const TransactionManifestModal = ({
  Show,
  setShow,
  displayData,
  handleSubmit,
  id,
}) => {
  const [advanced, setAdvanced] = useState(false);

  return (
    <Modal
      centered
      size="lg"
      show={Show}
      onHide={() => setShow(false)}
      aria-labelledby={id}
      scrollable
    >
      <Modal.Header className="modal-header" closeButton>
        <Modal.Title className="modal-title body2 text-primary d-flex align-items-center gap-2">
          <button
            className="primary bg-transparent"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="bi bi-chevron-left text-primary" />
          </button>
          Transaction Manifest
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body p-4 pt-0">
        <Stack>
          <span>Transaction Details:</span>
          <Stack className="bg-black rounded-4 p-2 mt-4 mb-1" gap={2}>
            {displayData?.map((item, index) => (
              <>
                <div key={index} className=" px-1 text-white-300 caption2 ">
                  {item?.title}
                </div>
                {Array.isArray(item?.value) ? (
                  item?.value?.map((element, ind) => (
                    <div
                      key={ind}
                      className=" px-1 text-white caption lato"
                      style={{ fontWeight: "400" }}
                    >
                      {element}
                    </div>
                  ))
                ) : (
                  <div
                    className=" px-1 text-white caption lato"
                    style={{ fontWeight: "400" }}
                  >
                    {item?.value}
                  </div>
                )}
              </>
            ))}
          </Stack>
          <p className="subheading1 m-0">
            <i className="bi bi-info-circle text-primary me-3" />
            Upon confirmation, Keplr extension will open. Approve transaction in
            Keplr.
          </p>
          <p className="m-0">Gas Fees:</p>
          <div
            className="btn-group my-3"
            role="group"
            aria-label="Basic example"
          >
            <Button variant="primary" className="">
              <div className="d-flex flex-column">
                Low 0.000000 $ 0.000000 $MNTL
              </div>
            </Button>
            <Button variant="primary" className="">
              <Stack as="span" className="d-flex flex-column">
                High 0.000000 $ 0.000000 $MNTL
              </Stack>
            </Button>
          </div>
          <button
            className="text-primary d-flex gap-2 align-items-center caption"
            onClick={() => setAdvanced((prev) => !prev)}
          >
            Advanced Details{" "}
            <span
              className="transitionAll d-flex align-items-center justify-content-center"
              style={{
                transform: advanced ? "rotate(180deg)" : "rotate(0deg)",
                transformOrigin: "center",
              }}
            >
              <i className="bi bi-chevron-down" />
            </span>
          </button>
          {advanced && (
            <>
              <label
                className="caption d-flex gap-2 align-items-center pt-2 my-2"
                htmlFor="gas"
              >
                Gas
              </label>
              <input
                className="bg-transparent p-3 py-2 rounded-2 border border-white"
                type="text"
                name="gas"
                id="gas"
                placeholder="Enter Gas Amount"
                // value={formState.gas}
              />
            </>
          )}
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="rounded-5 px-5 ms-auto"
            type="submit"
          >
            Confirm
          </Button>
        </Stack>
      </Modal.Body>
    </Modal>
  );
};

export default TransactionManifestModal;
