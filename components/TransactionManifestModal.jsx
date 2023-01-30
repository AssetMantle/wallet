import React, { useState } from "react";

const TransactionManifestModal = ({ displayData, handleSubmit, id }) => {
  const [advanced, setAdvanced] = useState(false);

  return (
    <div className="modal " tabIndex="-1" role="dialog" id={id}>
      <div
        className="modal-dialog modal-dialog-centered"
        role="document"
        style={{ maxWidth: "min(100%, 600px)" }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title body2 text-primary d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn-close primary"
                data-bs-dismiss="modal"
                aria-label="Close"
                style={{ background: "none" }}
              >
                <span className="text-primary">
                  <i className="bi bi-chevron-left" />
                </span>
              </button>
              Transaction Manifest
            </h5>
            <button
              type="button"
              className="btn-close primary"
              data-bs-dismiss="modal"
              aria-label="Close"
              style={{ background: "none" }}
            >
              <span className="text-primary">
                <i className="bi bi-x-lg" />
              </span>
            </button>
          </div>
          <div className="modal-body p-4 pt-0 d-flex flex-column">
            <span>Transaction Details:</span>
            <div className="nav-bg rounded-4 p-2 mt-4 mb-1 d-flex flex-column gap-2">
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
            </div>
            <p className="subheading1">
              <i className="bi bi-info-circle text-primary me-3" />
              Upon confirmation, Keplr extension will open. Approve transaction
              in Keplr.
            </p>
            <p>Gas Fees:</p>
            <div
              className="btn-group my-3"
              role="group"
              aria-label="Basic example"
            >
              <button type="button" className="btn btn-primary">
                <div className="d-flex flex-column">
                  Low 0.000000 $ 0.000000 $MNTL
                </div>
              </button>
              <button type="button" className="btn btn-primary">
                <div className="d-flex flex-column">
                  High 0.000000 $ 0.000000 $MNTL
                </div>
              </button>
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
                  className="bg-t p-3 py-2 rounded-2 am-input border-white"
                  type="text"
                  name="gas"
                  id="gas"
                  placeholder="Enter Gas Amount"
                  // value={formState.gas}
                />
              </>
            )}
            <button
              onClick={handleSubmit}
              className="btn button-primary px-5 ms-auto"
              type="submit"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionManifestModal;
