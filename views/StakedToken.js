import { useChain } from "@cosmos-kit/react";
import React, { Suspense, useState } from "react";
import Delegations from "../components/Delegations";
import ModalContainer from "../components/ModalContainer";
import Rewards from "../components/Rewards";
import Unbonded from "../components/Unbonded";
import { defaultChainName } from "../config";
import { sendDelegation, useAvailableBalance, fromDenom } from "../data";
import { toast } from "react-toastify";
import { defaultChainSymbol } from "../config";
import { isObjEmpty } from "../lib";

export default function StakedToken({
  totalTokens,
  setShowClaimError,
  showClaimError,
  stakeState,
  stakeDispatch,
  notify,
}) {
  const { availableBalance } = useAvailableBalance();
  const [openModal, setOpenModal] = useState(false);
  const [unDelegateModal, setUnDelegateModal] = useState(false);
  const walletManager = useChain(defaultChainName);
  const { getSigningStargateClient, address, status, wallet } = walletManager;

  const [DelegateModal, setDelegateModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    stakeDispatch({
      type: "SUBMIT_DELEGATE",
    });
    if (stakeState.delegationAmount) {
      setDelegateModal(false);
      const id = toast.loading("Transaction initiated ...", {
        position: "bottom-center",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      const { response, error } = await sendDelegation(
        address,
        stakeState?.delegationAddress,
        stakeState?.delegationAmount,
        stakeState?.memo,
        { getSigningStargateClient }
      );

      stakeDispatch({ type: "RESET_DELEGATE" });
      console.log("response: ", response, " error: ", error);
      if (response) {
        notify(response?.transactionHash, id);
      } else {
        notify(null, id);
      }
    }
  };

  const isSubmitDisabled = status != "Connected";

  return (
    <>
      <section className="gap-3 pt-3 pt-lg-0">
        {!stakeState?.selectedValidators?.length && status === "Connected" ? (
          <div className="rounded-4 p-3 my-2 bg-gray-800 width-100 d-flex flex-column ">
            <p>Please select the Validators you wish to take actions on.</p>
          </div>
        ) : null}
        <div className="rounded-4 gap-3 p-3 bg-gray-800 width-100 d-flex flex-column">
          <h4 className="body1 text-primary">Staked Tokens</h4>
          <Suspense fallback={<p>Loading</p>}>
            <Delegations
              unDelegateModal={unDelegateModal}
              setUnDelegateModal={setUnDelegateModal}
              notify={notify}
              stakeState={stakeState}
              stakeDispatch={stakeDispatch}
              totalTokens={totalTokens}
            />
          </Suspense>
          <Suspense fallback={<p>Loading</p>}>
            <Rewards
              notify={notify}
              stakeState={stakeState}
              setShowClaimError={setShowClaimError}
            />
          </Suspense>
          <Suspense fallback={<p>Loading</p>}>
            <Unbonded
              notify={notify}
              unDelegateModal={unDelegateModal}
              setUnDelegateModal={setUnDelegateModal}
              stakeState={stakeState}
              stakeDispatch={stakeDispatch}
            />
          </Suspense>
          {stakeState?.selectedValidators?.length === 1 ? (
            <button
              className="button-primary text-center px-3 py-2"
              style={{ maxWidth: "100%" }}
              disabled={isSubmitDisabled}
              onClick={() => {
                stakeDispatch({
                  type: "SET_DELEGATION_ADDRESS",
                  payload: stakeState?.selectedValidators[0],
                });
                setDelegateModal(true);
              }}
              // data-bs-toggle="modal"
              // data-bs-target="#delegateModal"
            >
              Delegate
            </button>
          ) : null}
          {stakeState?.selectedValidators?.length > 5 || showClaimError ? (
            <div className="d-flex justify-content-between">
              <p className="text-error">
                <i className="bi bi-exclamation-circle text-error"></i>{" "}
                Cumulative Rewards can be claimed only for 5 or less validators
              </p>
            </div>
          ) : null}
        </div>
      </section>
      <ModalContainer active={DelegateModal} setActive={setDelegateModal}>
        <div className="d-flex flex-column bg-gray-700 m-auto p-4 rounded-3 w-100">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="body2 text-primary d-flex align-items-center gap-2">
              <button
                className="btn-close primary bg-t"
                onClick={() => setDelegateModal(false)}
                style={{ background: "none" }}
              >
                <span className="text-primary">
                  <i className="bi bi-chevron-left" />
                </span>
              </button>
              Delegate
            </h5>
            <button
              className="btn-close primary bg-t"
              onClick={() => setDelegateModal(false)}
              style={{ background: "none" }}
            >
              <span className="text-primary">
                <i className="bi bi-x-lg" />
              </span>
            </button>
          </div>
          <div className="py-4 text-center d-flex flex-column">
            <div className="d-flex my-2 justify-content-between">
              <label htmlFor="delegationAmount caption text-gray">
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
          <div className="d-flex align-items-center gap-2 justify-content-end">
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
      </ModalContainer>
      {/* <div className="modal " tabIndex="-1" role="dialog" id="delegateModal">
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
                <label htmlFor="delegationAmount caption text-gray">
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
                // data-bs-toggle={
                //   stakeState.delegationAmount.length != 0 ? "modal" : ""
                // }
                // data-bs-target="#stakeTransactionManifestModal"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div> */}

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
    </>
  );
}
