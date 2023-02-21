import React from "react";
import { isObjEmpty } from "../lib";
import { fromDenom } from "../data";
import { defaultChainSymbol } from "../config";

const DelegateModal = () => {
  return (
    // <div className="modal " role="dialog" id="delegateModal">
    <div className="modal-dialog modal-dialog-centered" role="document">
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
            Delegate
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
        <div className="modal-body p-4 text-center d-flex flex-column">
          <div className="d-flex my-2 justify-content-between">
            <label htmlFor="delegationAmount" className="caption text-gray">
              Delegation Amount
            </label>{" "}
            <small className="text-gray caption2">
              Balance : {fromDenom(availableBalance).toString()}&nbsp;
              {defaultChainSymbol}
            </small>
          </div>
          <div>
            <div className="p-3 border-white py-2 d-flex rounded-2 gap-2 am-input">
              <input
                className="bg-t"
                id="delegationAmount"
                style={{ flex: "1", border: "none", outline: "none" }}
                type="text"
                value={stakeState?.delegationAmount}
                placeholder="Enter Delegation Amount"
                onChange={(e) =>
                  stakeDispatch({
                    type: "CHANGE_DELEGATION_AMOUNT",
                    payload: e.target.value,
                  })
                }
              ></input>
              <button
                onClick={() =>
                  stakeDispatch({
                    type: "SET_MAX_DELEGATION_AMOUNT",
                  })
                }
                className="text-primary"
              >
                Max
              </button>
            </div>
            <small
              id="amountInputErrorMsg"
              className="form-text text-danger d-flex align-items-center gap-1"
            >
              {stakeState?.errorMessages?.transferAmountErrorMsg && (
                <i className="bi bi-info-circle" />
              )}{" "}
              {stakeState?.errorMessages?.transferAmountErrorMsg}
            </small>
          </div>
        </div>
        <div className="modal-footer ">
          <button
            disabled={!isObjEmpty(stakeState?.errorMessages)}
            type="button"
            className="button-primary px-5 py-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
      {/* <TransactionManifestModal
          id="stakeTransactionManifestModal"
          displayData={[
            { title: "Delegating From:", value: address },
            { title: "Delegating To:", value: stakeState.delegationAddress },
            { title: "Amount:", value: stakeState.delegationAmount },
            { title: "Transaction Type", value: "Delegate" },
            { title: "Wallet Type", value: wallet?.prettyName },
          ]}
          handleSubmit={handleStakeSubmit}
        /> */}
      {/* </div> */}
    </div>
  );
};

export default DelegateModal;
