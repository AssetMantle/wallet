import React from "react";

const TransactionManifestModal = ({
  txType,
  fromAddress,
  toAdress,
  amount,
  walletType,
}) => {
  return (
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
        <span>Transaction Details:</span>
        <div className="modal-body p-4 pt-0 d-flex flex-column">
          <div className="nav-bg rounded-4 p-2 mt-4 mb-1 d-flex flex-column gap-2">
            <div className=" px-1 text-white-300 caption2 ">From:</div>
            <div
              className=" px-1 text-white caption lato"
              style={{ fontWeight: "400" }}
            >
              {fromAddress}
            </div>

            <div className="col-4 px-1 text-white-300 caption2 ">To:</div>
            <div
              className=" px-1 text-white caption lato"
              style={{ fontWeight: "400" }}
            >
              {toAdress}
            </div>

            <div className="col-4 px-1 text-white-300 caption2 ">Amount:</div>
            <div
              className=" px-1 text-white caption lato"
              style={{ fontWeight: "400" }}
            >
              {amount}
            </div>

            <div className="col-4 px-1 text-white-300 caption2 ">
              Transaction Type:
            </div>
            <div
              className=" px-1 text-white caption lato"
              style={{ fontWeight: "400" }}
            >
              {txType}
            </div>
            <div className="col-4 px-1 text-white-300 caption2 ">
              Transaction Wallet Type:
            </div>
            <div
              className=" px-1 text-white caption lato"
              style={{ fontWeight: "400" }}
            >
              {walletType}
            </div>
          </div>

          <h3 className="text-center h3 text-primary my-2">
            Transaction made successfully
          </h3>
          <p
            className="text-center caption2 text-white-300 mx-auto"
            style={{ maxWidth: "413px" }}
          >
            Please use the link given below to view the status and details of
            your transaction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionManifestModal;
