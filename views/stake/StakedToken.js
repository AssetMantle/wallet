import { useChain } from "@cosmos-kit/react";
import React, { Suspense, useState } from "react";
import Delegations from "../../components/Transact/Delegations";
import Rewards from "../../components/stake/Rewards";
import Unbonded from "../../components/Unbonded";
import { defaultChainName, toastConfig } from "../../config";
import { sendDelegation, useAvailableBalance, fromDenom } from "../../data";
import { toast } from "react-toastify";
import { defaultChainSymbol } from "../../config";
import { Button, Modal, Stack } from "react-bootstrap";

export default function StakedToken({
  delegated,
  setDelegated,
  totalTokens,
  setShowClaimError,
  showClaimError,
  stakeState,
  stakeDispatch,
  notify,
}) {
  const { availableBalance } = useAvailableBalance();
  const [openModal, setOpenModal] = useState(false);
  const walletManager = useChain(defaultChainName);
  const { getSigningStargateClient, address, status } = walletManager;

  const [DelegateModal, setDelegateModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    stakeDispatch({
      type: "SUBMIT_DELEGATE",
    });
    if (stakeState.delegationAmount) {
      setDelegateModal(false);
      const id = toast.loading("Transaction initiated ...", toastConfig);
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
      <section className="gap-3">
        {!stakeState?.selectedValidators?.length && status === "Connected" ? (
          <Stack className="rounded-4 p-3 mb-3 bg-light-subtle width-100 text-white m-0">
            <p>Please select the Validators you wish to take actions on.</p>
          </Stack>
        ) : null}
        <Stack className="rounded-4 gap-3 p-3 bg-light-subtle w-100">
          <h4 className="body1 text-primary m-0">Staked Tokens</h4>
          <Suspense fallback={<p>Loading</p>}>
            <Delegations
              notify={notify}
              stakeState={stakeState}
              stakeDispatch={stakeDispatch}
              totalTokens={totalTokens}
            />
          </Suspense>
          <Suspense fallback={<p>Loading</p>}>
            <Rewards
              delegated={delegated}
              setDelegated={setDelegated}
              notify={notify}
              stakeState={stakeState}
              setShowClaimError={setShowClaimError}
            />
          </Suspense>
          <Suspense fallback={<p>Loading</p>}>
            <Unbonded
              notify={notify}
              stakeState={stakeState}
              stakeDispatch={stakeDispatch}
            />
          </Suspense>
          {stakeState?.selectedValidators?.length === 1 ? (
            <Button
              className="rounded-5 text-center px-3 py-2 fw-medium"
              style={{ maxWidth: "100%" }}
              disabled={isSubmitDisabled}
              onClick={() => {
                stakeDispatch({
                  type: "SET_DELEGATION_ADDRESS",
                  payload: stakeState?.selectedValidators[0],
                });
                setDelegateModal(true);
              }}
            >
              Delegate
            </Button>
          ) : null}
          {stakeState?.selectedValidators?.length > 5 || showClaimError ? (
            <Stack className="justify-content-between">
              <p className="text-error m-0">
                <i className="bi bi-exclamation-circle text-error"></i>{" "}
                Cumulative Rewards can be claimed only for 5 or less validators
              </p>
            </Stack>
          ) : null}
        </Stack>
      </section>
      <Modal
        show={DelegateModal}
        onHide={() => setDelegateModal(false)}
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
                  onClick={() => setDelegateModal(false)}
                >
                  <i className="bi bi-chevron-left text-primary" />
                </button>
                Delegate
              </h5>
              <button
                className="primary bg-transparent"
                onClick={() => setDelegateModal(false)}
              >
                <i className="bi bi-x-lg text-primary" />
              </button>
            </Stack>
            <Stack className="py-4 text-center">
              <Stack
                className="my-2 justify-content-between"
                direction="horizontal"
              >
                <label
                  htmlFor="delegationAmount"
                  className="caption text-white-50"
                >
                  Delegation Amount
                </label>{" "}
                <small className="text-white-50 caption2">
                  Balance : {fromDenom(availableBalance).toString()}&nbsp;
                  {defaultChainSymbol}
                </small>
              </Stack>
              <div>
                <Stack
                  className="p-3 border border-white py-2 rounded-2"
                  direction="horizontal"
                  gap={2}
                >
                  <input
                    className="bg-transparent flex-grow-1 border border-0"
                    id="delegationAmount"
                    type="text"
                    value={stakeState?.delegationAmount}
                    placeholder="Enter Delegation Amount"
                    onChange={(e) =>
                      stakeDispatch({
                        type: "CHANGE_DELEGATION_AMOUNT",
                        payload: e.target.value,
                      })
                    }
                  />
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
                </Stack>
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
            </Stack>
            <Stack
              className="align-items-center justify-content-end"
              gap={2}
              direction="horizontal"
            >
              <Button
                variant="primary"
                disabled={stakeState?.errorMessages?.transferAmountErrorMsg}
                className="rounded-5 px-5 py-2 fw-medium"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </Modal.Body>
      </Modal>

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
