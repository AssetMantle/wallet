import React, { useState } from "react";
import { useAllProposals } from "../data/queryApi";
import DonutChart from "../views/vote/DonutChart";
import VoteInfo from "../views/vote/VoteInfo";
import useVoteReducer from "../data/useVoteReducer";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";
import { sendVote } from "../data/txApi";
import { useChain } from "@cosmos-kit/react";
import { defaultChainName, toastConfig } from "../config";
import ActiveProposals from "../components/vote/ActiveProposals";
import Head from "next/head";
import { isObjEmpty } from "../lib";
import ModalContainer from "../components/ModalContainer";
import { toast } from "react-toastify";
import Link from "next/link";
import { Button, Col, Row, Stack } from "react-bootstrap";

export default function Vote() {
  const [VoteModal, setVoteModal] = useState(false);

  const { voteState, voteDispatch } = useVoteReducer();
  const { allProposals, isLoadingProposals } = useAllProposals();
  const walletManager = useChain(defaultChainName);
  const { getSigningStargateClient, address, status } = walletManager;

  const CustomToastWithLink = ({ txHash }) => (
    <p>
      Transaction Submitted. Check
      <Link href={`https://explorer.assetmantle.one/transactions/${txHash}`}>
        <a style={{ color: "#ffc640" }} target="_blank">
          {" "}
          Here
        </a>
      </Link>
    </p>
  );

  const notify = (txHash, id) => {
    if (txHash) {
      toast.update(id, {
        render: <CustomToastWithLink txHash={txHash} />,
        type: "success",
        isLoading: false,
        toastId: txHash,
        ...toastConfig,
      });
    } else {
      toast.update(id, {
        render: "Transaction failed. Try Again",
        type: "error",
        isLoading: false,
        ...toastConfig,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVoteModal(false);
    voteDispatch({ type: "SUBMIT_VOTE" });
    if (voteState.voteOption) {
      const id = toast.loading("Transaction initiated ...", toastConfig);
      const { response, error } = await sendVote(
        voteState?.proposalID,
        address,
        voteState?.voteOption,
        voteState?.memo,
        { getSigningStargateClient }
      );
      console.log("response: ", response, " error: ", error);
      if (response) {
        notify(response?.transactionHash, id);
      } else {
        notify(null, id);
      }
    }
  };
  const [ShowAdvanced, setShowAdvanced] = useState(false);
  const isConnected = status == "Connected";
  const isSubmitDisabled = status != "Connected";

  return (
    <>
      <Head>
        <title>Vote | MantleWallet</title>
      </Head>
      <Row as="section" className="h-100">
        <Col xs={8}>
          <ScrollableSectionContainer className="px-1">
            <Stack
              className="rounded-4 p-3 bg-light-subtle width-100 flex-grow-0"
              gap={2}
            >
              <Stack
                direction="horizontal"
                gap={3}
                className="align-items-center justify-content-between"
              >
                <h1 className="body2 text-primary">Proposals</h1>
                <Stack direction="horizontal" className="align-items-center">
                  <Button
                    variant="primary"
                    className={"rounded-0 rounded-start-2"}
                  >
                    Active
                  </Button>
                  <a
                    target="_blank"
                    href="https://www.mintscan.io/asset-mantle/proposals"
                    rel="noreferrer"
                  >
                    <Button
                      variant="outline-light"
                      className={"rounded-0 rounded-end-2"}
                    >
                      Concluded{" "}
                      <i className="bi bi-arrow-up-right text primary"></i>
                    </Button>
                  </a>
                </Stack>
              </Stack>
              <Stack className="bg-black rounded-4 px-3 py-2" gap={3}>
                <Row>
                  {isLoadingProposals ? (
                    <p className="m-0 text-primary">Loading ...</p>
                  ) : allProposals?.length ? (
                    allProposals?.map((proposal, index) => (
                      <ActiveProposals
                        key={index}
                        proposal={proposal}
                        index={index}
                        status={status}
                        voteDispatch={voteDispatch}
                        voteState={voteState}
                        allProposals={allProposals}
                        isLoadingProposals={isLoadingProposals}
                      />
                    ))
                  ) : (
                    <p className="text-white m-0">
                      There are no active proposals at the moment
                    </p>
                  )}
                </Row>
              </Stack>
            </Stack>
          </ScrollableSectionContainer>
        </Col>
        <Col xs={4}>
          <ScrollableSectionContainer className="d-flex flex-column">
            {voteState?.proposalID ? (
              <>
                <DonutChart
                  isLoadingProposals={isLoadingProposals}
                  selectedProposal={allProposals?.find?.(
                    (item) => item?.proposal_id == voteState.proposalID
                  )}
                />
                <Button
                  variant="primary"
                  className="text-center"
                  style={{ maxWidth: "100%" }}
                  onClick={() => {
                    setVoteModal(true);
                  }}
                  disabled={isSubmitDisabled}
                >
                  Vote
                </Button>
              </>
            ) : (
              <VoteInfo
                isConnected={isConnected}
                voteDispatch={voteDispatch}
                voteState={voteState}
              />
            )}
          </ScrollableSectionContainer>
        </Col>
      </Row>

      <ModalContainer active={VoteModal} setActive={setVoteModal}>
        <div className="d-flex flex-column bg-gray-700 m-auto p-4 rounded-3 w-100">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="body2 text-primary d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn-close primary"
                onClick={() => setVoteModal(false)}
                style={{ background: "none" }}
              >
                <span className="text-primary">
                  <i className="bi bi-chevron-left" />
                </span>
              </button>
              Vote
            </h5>
            <button
              type="button"
              className="btn-close primary"
              onClick={() => setVoteModal(false)}
              style={{ background: "none" }}
            >
              <span className="text-primary">
                <i className="bi bi-x-lg" />
              </span>
            </button>
          </div>
          <div className="py-4  d-flex flex-column">
            <div className="pb-4 text-center d-flex justify-content-around subtitle1">
              {/* Vote options are numbers. Check
              gov.ts(path:modules/cosmos/gov/v1beta1) for more info on which
              umber corresponds to which vote */}
              <div
                className="form-check d-flex align-items-center gap-2 p-0"
                style={{ fontWeight: "400", lineHeight: "100%" }}
              >
                <input
                  className="accent-primary p-0"
                  type="radio"
                  name="voteRadio"
                  id="voteRadio1"
                  onChange={() => {
                    voteDispatch({
                      type: "SET_VOTE_OPTION",
                      payload: 1,
                    });
                    voteDispatch({
                      type: "RESET_ERRORS",
                    });
                  }}
                />
                <label className="form-check-label" htmlFor="voteRadio1">
                  Yes
                </label>
              </div>
              <div
                className="form-check d-flex align-items-center gap-2 p-0"
                style={{ fontWeight: "400", lineHeight: "100%" }}
              >
                <input
                  className="accent-primary p-0"
                  type="radio"
                  name="voteRadio"
                  id="voteRadio2"
                  onChange={() => {
                    voteDispatch({
                      type: "SET_VOTE_OPTION",
                      payload: 3,
                    });
                    voteDispatch({
                      type: "RESET_ERRORS",
                    });
                  }}
                />
                <label className="form-check-label" htmlFor="voteRadio2">
                  No
                </label>
              </div>
              <div
                className="form-check d-flex align-items-center gap-2 p-0"
                style={{ fontWeight: "400", lineHeight: "100%" }}
              >
                <input
                  className="accent-primary p-0"
                  type="radio"
                  name="voteRadio"
                  id="voteRadio3"
                  onChange={() => {
                    voteDispatch({
                      type: "SET_VOTE_OPTION",
                      payload: 4,
                    });
                    voteDispatch({
                      type: "RESET_ERRORS",
                    });
                  }}
                />
                <label className="form-check-label" htmlFor="voteRadio3">
                  No with veto
                </label>
              </div>
              <div
                className="form-check d-flex align-items-center gap-2 p-0"
                style={{ fontWeight: "400", lineHeight: "100%" }}
              >
                <input
                  className="accent-primary p-0"
                  type="radio"
                  name="voteRadio"
                  id="voteRadio4"
                  onChange={() => {
                    voteDispatch({
                      type: "SET_VOTE_OPTION",
                      payload: 2,
                    });
                    voteDispatch({
                      type: "RESET_ERRORS",
                    });
                  }}
                />
                <label className="form-check-label" htmlFor="voteRadio4">
                  Abstain
                </label>
              </div>
            </div>
            <div className="bg-black p-3 rounded-4 d-flex flex-column gap-1">
              <button
                className="caption2 d-flex align-items-start justify-content-start gap-1"
                onClick={() => setShowAdvanced(!ShowAdvanced)}
              >
                <i className="bi bi-info-circle text-primary"></i> The following
                items summarize the voting options and what it means for this
                proposal
                <span
                  className="transitionAll"
                  style={{
                    transformOrigin: "center",
                    transform: ShowAdvanced ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <i className="bi bi-chevron-down" />
                </span>
              </button>
              {ShowAdvanced && (
                <div className="accordion-body">
                  <ul className="ps-3 pt-2 caption2 text-body">
                    <li>
                      <span className="text-white-300">YES</span> - You approve
                      of and wish to ratify the contents of the proposed paper.
                    </li>
                    <li>
                      <span className="text-white-300">NO</span> - You don’t
                      approve of the contents of paper.
                    </li>
                    <li>
                      <span className="text-white-300">NO WITH VETO</span> - A
                      ‘NoWithVeto’ vote indicates a proposal either (1) is
                      deemed to be spam, i.e., irrelevant to Cosmos Hub, (2)
                      disproportionately infringes on minority interests, or (3)
                      violates or encourages violation of the rules of
                      engagement as currently set out by Cosmos Hub governance.
                      If the number of ‘NoWithVeto’ votes is greater than a
                      third of total votes, the proposal is rejected and the
                      deposits are burned.
                    </li>
                    <li>
                      <span className="text-white-300">ABSTAIN</span> - You wish
                      to contribute to quorum but you formally decline to vote
                      either for or against the proposal.
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <small
              id="amountInputErrorMsg"
              className="form-text text-danger d-flex align-items-center gap-1"
            >
              {" "}
              {voteState?.errorMessages?.voteErrorMsg && (
                <i className="bi bi-info-circle" />
              )}{" "}
              {voteState?.errorMessages?.voteErrorMsg}
            </small>
            <div className="d-flex pt-3">
              {/* {voteState.voteOption !== "VOTE_OPTION_UNSPECIFIED" ? (
                    <button
                      type="button"
                      className="button-primary px-5 py-2 ms-auto"
                      onClick={handleSubmit}
                    >
                      Confirm
                    </button>
                  ) : ( */}
              <button
                disabled={!isObjEmpty(voteState?.errorMessages)}
                type="button"
                className="button-primary px-5 py-2 ms-auto"
                onClick={handleSubmit}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </ModalContainer>
      {/* <TransactionManifestModal
        displayData={[
          { title: "Transaction Type", value: "Vote" },
          { title: "Wallet Type", value: wallet?.prettyName },
        ]}
        id="voteTransactionManifestModal"
        handleSubmit={handleSubmit}
      /> */}
    </>
  );
}
