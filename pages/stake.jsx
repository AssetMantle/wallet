import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";
import AllValidators from "../components/AllValidators";
import DelegatedValidators from "../components/DelegatedValidators";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";
import Tooltip from "../components/Tooltip";
import { toastConfig } from "../config";
import { useAllValidators, useDelegatedValidators } from "../data";
import useStakeReducer from "../data/useStakeReducer";
import StakedToken from "../views/StakedToken";

export default function Stake() {
  const [searchValue, setSearchValue] = useState("");
  const { stakeDispatch, stakeState } = useStakeReducer();
  const [showClaimError, setShowClaimError] = useState(false);
  const [activeValidators, setActiveValidators] = useState(true);
  const [delegated, setDelegated] = useState(false);
  const [SortTableByField, setSortTableByField] = useState("tokens");
  const { allValidators } = useAllValidators();
  const { delegatedValidators } = useDelegatedValidators();

  let validatorsArray = allValidators
    .sort((a, b) => b.tokens - a.tokens)
    .map((el, index) => ({ ...el, rank: index + 1 }));

  const rankedDelegatedValidators = delegatedValidators?.map((el) => {
    for (let item of validatorsArray) {
      if (el?.description?.moniker === item?.description?.moniker)
        return { ...el, rank: item?.rank };
    }
  });

  //Calculate total tokens to calculate voting power
  const totalTokens = validatorsArray.reduce(
    (accumulator, currentValue) => accumulator + parseInt(currentValue.tokens),
    0
  );

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

  const THRank = (
    <th
      scope="col"
      style={{ whiteSpace: "nowrap" }}
      role="button"
      tabIndex={0}
      onClick={() =>
        SortTableByField === "tokens"
          ? setSortTableByField("-tokens")
          : setSortTableByField("tokens")
      }
    >
      Rank{" "}
      {(activeValidators || (activeValidators && delegated)) && (
        <span
          className=""
          style={{ opacity: SortTableByField.includes("tokens") ? "1" : "0.3" }}
        >
          {SortTableByField === "tokens" ? (
            <i className="bi bi-caret-up-fill" />
          ) : (
            <i className="bi bi-caret-down-fill" />
          )}
        </span>
      )}
    </th>
  );

  console.log("delegatedValidators: ", delegatedValidators);

  return (
    <>
      <Head>
        <title>Stake | MantleWallet</title>
      </Head>
      <section className="row h-100">
        <div className="col-8 h-100">
          <div
            className="bg-gray-800 p-3 rounded-4 d-flex flex-column gap-2"
            style={{ height: "90%" }}
          >
            <div className="d-flex align-items-center justify-content-between w-100">
              <div className="card-title body1 text-primary my-auto">
                Validators
              </div>
              <div className="btn-group">
                <button
                  className={`${
                    activeValidators ? "btn btn-primary" : "btn btn-inactive"
                  } caption`}
                  onClick={() => {
                    setActiveValidators(true);
                    stakeDispatch({ type: "EMPTY_SELECTED_VALIDATORS" });
                  }}
                >
                  Active
                </button>
                <button
                  className={`${
                    !activeValidators ? "btn btn-primary" : "btn btn-inactive"
                  } caption`}
                  onClick={() => {
                    setActiveValidators(false);
                    stakeDispatch({ type: "EMPTY_SELECTED_VALIDATORS" });
                  }}
                >
                  Inactive
                </button>
              </div>
            </div>
            <div
              className="d-flex flex-column w-100 nav-bg p-2 rounded-4 flex-grow-1"
              style={{ height: "88%" }}
            >
              <div className="d-flex align-items-center gap-3 w-100">
                <div
                  className="d-flex gap-2 am-input border-color-white rounded-3 py-1 px-3 align-items-center"
                  style={{ flex: "1" }}
                >
                  <span
                    className="input-group-text bg-t p-0 h-100"
                    id="basic-addon1"
                    style={{ border: "none" }}
                  >
                    <i className="bi bi-search text-white"></i>
                  </span>
                  <input
                    type="search"
                    className="am-input bg-t p-1 w-100 h-100"
                    placeholder="Search"
                    aria-label="Search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{ border: "none" }}
                  />
                </div>
                <div
                  className="d-flex gap-2 align-items-center text-white"
                  onClick={() => {
                    setDelegated((prev) => !prev);
                    stakeDispatch({ type: "EMPTY_SELECTED_VALIDATORS" });
                  }}
                >
                  Delegated
                  <Tooltip description="Showcase a list of all validators that you have ever delegated tokens with." />
                  <button
                    className={`d-flex rounded-4 align-items-center transitionAll ${
                      delegated
                        ? "bg-yellow-100 justify-content-end"
                        : "bg-theme-white justify-content-start"
                    }`}
                    style={{ width: "40px", padding: "2px" }}
                  >
                    <div className="p-2 rounded-4 bg-dark-200"></div>
                  </button>
                </div>
              </div>
              <div className="w-100 mt-3 h-100" style={{ overflow: "auto" }}>
                <table
                  className="table"
                  style={{ width: "max-content", minWidth: "100%" }}
                >
                  <thead
                    className="position-sticky top-0 nav-bg"
                    style={{
                      zIndex: "200",
                    }}
                  >
                    <tr className="caption2 text-white">
                      <th></th>
                      {activeValidators ? (
                        delegated ? (
                          THRank
                        ) : (
                          <>
                            <th
                              scope="col"
                              style={{ whiteSpace: "nowrap" }}
                            ></th>
                            {THRank}
                          </>
                        )
                      ) : delegated ? null : (
                        <th scope="col" style={{ whiteSpace: "nowrap" }}></th>
                      )}
                      <th
                        colSpan="2"
                        scope="col"
                        style={{ whiteSpace: "nowrap", marginRight: "20px" }}
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          SortTableByField === "name"
                            ? setSortTableByField("-name")
                            : setSortTableByField("name")
                        }
                      >
                        Validator Name{" "}
                        {/* {(activeValidators ||
                          (activeValidators && delegated)) && ( */}
                        <span
                          className=""
                          style={{
                            opacity: SortTableByField.includes("name")
                              ? "1"
                              : "0.3",
                          }}
                        >
                          {SortTableByField === "name" ? (
                            <i className="bi bi-caret-up-fill" />
                          ) : (
                            <i className="bi bi-caret-down-fill" />
                          )}
                        </span>
                        {/* )} */}
                      </th>
                      <th
                        className="am-w-min-120"
                        scope="col"
                        style={{ whiteSpace: "nowrap" }}
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          SortTableByField === "tokens"
                            ? setSortTableByField("-tokens")
                            : setSortTableByField("tokens")
                        }
                      >
                        Voting Power{" "}
                        {/* {(activeValidators ||
                          (activeValidators && delegated)) && ( */}
                        <span
                          className=""
                          style={{
                            opacity: SortTableByField.includes("tokens")
                              ? "1"
                              : "0.3",
                          }}
                        >
                          {SortTableByField === "tokens" ? (
                            <i className="bi bi-caret-up-fill" />
                          ) : (
                            <i className="bi bi-caret-down-fill" />
                          )}
                        </span>
                        {/* )} */}
                      </th>
                      <th
                        scope="col"
                        style={{ whiteSpace: "nowrap" }}
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          SortTableByField === "commission"
                            ? setSortTableByField("-commission")
                            : setSortTableByField("commission")
                        }
                      >
                        Commission{" "}
                        {/* {(activeValidators ||
                          (activeValidators && delegated)) && ( */}
                        <span
                          className=""
                          style={{
                            opacity: SortTableByField.includes("commission")
                              ? "1"
                              : "0.3",
                          }}
                        >
                          {SortTableByField === "commission" ? (
                            <i className="bi bi-caret-up-fill" />
                          ) : (
                            <i className="bi bi-caret-down-fill" />
                          )}
                        </span>
                        {/* )} */}
                      </th>
                      {delegated ? null : (
                        <th
                          scope="col"
                          style={{ whiteSpace: "nowrap" }}
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            SortTableByField === "tokens"
                              ? setSortTableByField("-tokens")
                              : setSortTableByField("tokens")
                          }
                        >
                          Delegations{" "}
                          {(activeValidators ||
                            (activeValidators && delegated)) && (
                            <span
                              className=""
                              style={{
                                opacity: SortTableByField.includes("tokens")
                                  ? "1"
                                  : "0.3",
                              }}
                            >
                              {SortTableByField === "tokens" ? (
                                <i className="bi bi-caret-up-fill" />
                              ) : (
                                <i className="bi bi-caret-down-fill" />
                              )}
                            </span>
                          )}
                        </th>
                      )}
                      <th
                        scope="col"
                        style={{ whiteSpace: "nowrap" }}
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          SortTableByField === "delegatedAmount"
                            ? setSortTableByField("-delegatedAmount")
                            : setSortTableByField("delegatedAmount")
                        }
                      >
                        Delegated Amount{" "}
                        {/* {(activeValidators ||
                          (activeValidators && delegated)) && ( */}
                        <span
                          className=""
                          style={{
                            opacity: SortTableByField.includes(
                              "delegatedAmount"
                            )
                              ? "1"
                              : "0.3",
                          }}
                        >
                          {SortTableByField === "delegatedAmount" ? (
                            <i className="bi bi-caret-up-fill" />
                          ) : (
                            <i className="bi bi-caret-down-fill" />
                          )}
                        </span>
                        {/* )} */}
                      </th>
                      {activeValidators ? null : (
                        <th scope="col" style={{ whiteSpace: "nowrap" }}>
                          Jailed
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {delegated ? (
                      <DelegatedValidators
                        delegatedValidators={rankedDelegatedValidators}
                        searchValue={searchValue}
                        setShowClaimError={setShowClaimError}
                        stakeDispatch={stakeDispatch}
                        stakeState={stakeState}
                        activeValidators={activeValidators}
                        totalTokens={totalTokens}
                        sortParam={SortTableByField}
                      />
                    ) : (
                      allValidators.length !== 1 &&
                      allValidators && (
                        <AllValidators
                          delegatedValidators={delegatedValidators}
                          setShowClaimError={setShowClaimError}
                          searchValue={searchValue}
                          stakeDispatch={stakeDispatch}
                          stakeState={stakeState}
                          validatorsArray={validatorsArray}
                          activeValidators={activeValidators}
                          totalTokens={totalTokens}
                          sortParam={SortTableByField}
                        />
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <ScrollableSectionContainer className="col-4">
          <StakedToken
            delegated={delegated}
            setDelegated={setDelegated}
            notify={notify}
            stakeState={stakeState}
            stakeDispatch={stakeDispatch}
            showClaimError={showClaimError}
            setShowClaimError={setShowClaimError}
            totalTokens={totalTokens}
            selectedValidators={stakeState?.selectedValidators}
            forActiveValidators={activeValidators}
          />
        </ScrollableSectionContainer>
      </section>
    </>
  );
}
