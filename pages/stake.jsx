import React, { useState } from "react";
import AllValidators from "../components/stake/AllValidators";
import DelegatedValidators from "../components/stake/DelegatedValidators";
import { useAllValidators, useDelegatedValidators } from "../data";
import useStakeReducer from "../data/useStakeReducer";
import StakedToken from "../views/stake/StakedToken";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";
import Head from "next/head";
import { toast } from "react-toastify";
import Link from "next/link";
import { toastConfig } from "../config";
import {
  Button,
  Col,
  OverlayTrigger,
  Row,
  Stack,
  Tooltip,
} from "react-bootstrap";

export default function Stake() {
  const [searchValue, setSearchValue] = useState("");
  const { stakeDispatch, stakeState } = useStakeReducer();
  const [showClaimError, setShowClaimError] = useState(false);
  const [activeValidators, setActiveValidators] = useState(true);
  const [delegated, setDelegated] = useState(false);
  const { allValidators } = useAllValidators();
  const { delegatedValidators } = useDelegatedValidators();

  let validatorsArray = allValidators.sort((a, b) => b.tokens - a.tokens);

  //Calculate total tokens to calculate voting power
  const totalTokens = validatorsArray.reduce(
    (accumulator, currentValue) => accumulator + parseInt(currentValue.tokens),
    0
  );

  const CustomToastWithLink = ({ txHash }) => (
    <p className="m-0">
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

  // transaction manifest modal states and functions
  // const GasOptions = [
  //   {
  //     name: "Zero",
  //     usd: "0.0000",
  //     mntl: "0.0000",
  //   },
  //   {
  //     name: "Low",
  //     usd: "0.0000",
  //     mntl: "0.0000",
  //   },
  //   {
  //     name: "High",
  //     usd: "0.0000",
  //     mntl: "0.0000",
  //   },
  // ];
  // const [SelectedGasFee, setSelectedGasFee] = useState(GasOptions[0].name);
  // const [ManifestShowAdvanced, setManifestShowAdvanced] = useState(false);
  // const [ManifestKeystorePassword, setManifestKeystorePassword] = useState();
  // const [ManifestCustomGas, setManifestCustomGas] = useState();
  // const handleManifestConfirm = () => {
  //   console.log("Confirming transaction manifest");
  // };

  return (
    <>
      <Head>
        <title>Stake | MantleWallet</title>
      </Head>
      <Row className="h-100 m-0" as="section">
        <Col xs={8} className="h-100 pb-2 px-1 pe-2">
          <Stack
            gap={2}
            className="bg-am-gray-200 p-3 rounded-4"
            style={{ height: "90%" }}
          >
            <Stack
              direction="horizontal"
              className="align-items-center justify-content-between w-100"
            >
              <h1 className="card-title h3 text-primary m-0 my-auto">
                Validators
              </h1>
              <div className="btn-group">
                <Button
                  variant={activeValidators ? "primary" : "outline-warning"}
                  className="fw-medium"
                  onClick={() => {
                    setActiveValidators(true);
                    stakeDispatch({ type: "EMPTY_SELECTED_VALIDATORS" });
                  }}
                >
                  Active
                </Button>
                <Button
                  variant={!activeValidators ? "primary" : "outline-warning"}
                  className="fw-medium"
                  onClick={() => {
                    setActiveValidators(false);
                    stakeDispatch({ type: "EMPTY_SELECTED_VALIDATORS" });
                  }}
                >
                  Inactive
                </Button>
              </div>
            </Stack>
            <Stack
              className="w-100 bg-black p-2 rounded-4 flex-grow-1"
              style={{ height: "88%" }}
            >
              <Stack
                direction="horizontal"
                gap={3}
                className="align-items-center w-100"
              >
                <Stack
                  gap={2}
                  direction="horizontal"
                  className="border border-white rounded-3 mt-1 py-1 px-3 align-items-center flex-grow-1"
                >
                  <i className="bi bi-search text-white"></i>
                  <input
                    type="search"
                    className="bg-transparent border border-0 p-1 w-100 h-100"
                    style={{ outline: "none" }}
                    placeholder="Search"
                    aria-label="Search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </Stack>
                <Stack
                  as="button"
                  direction="horizontal"
                  gap={2}
                  className="align-items-center text-white"
                  role="button"
                  onClick={() => {
                    setDelegated((prev) => !prev);
                    stakeDispatch({ type: "EMPTY_SELECTED_VALIDATORS" });
                  }}
                >
                  Delegated
                  <OverlayTrigger
                    overlay={
                      <Tooltip id={"delegated-stake"}>
                        Showcase a list of all validators that you have ever
                        delegated tokens with.
                      </Tooltip>
                    }
                  >
                    <i className="bi bi-info-circle"></i>
                  </OverlayTrigger>
                  <Stack
                    as="span"
                    direction="horizontal"
                    className={`rounded-4 align-items-center transitionAll my-auto ${
                      delegated
                        ? "bg-primary justify-content-end"
                        : "bg-white justify-content-start"
                    }`}
                    style={{ width: "40px", padding: "2px" }}
                  >
                    <span className="p-2 rounded-4 bg-dark"></span>
                  </Stack>
                </Stack>
              </Stack>
              <div className="w-100 mt-2 h-100" style={{ overflow: "auto" }}>
                <table
                  className="table"
                  style={{ width: "max-content", minWidth: "100%" }}
                >
                  <thead
                    className="position-sticky top-0 bg-black"
                    style={{
                      zIndex: "200",
                    }}
                  >
                    <tr className="caption2 text-white">
                      <th></th>
                      {activeValidators ? (
                        delegated ? (
                          <th scope="col" style={{ whiteSpace: "nowrap" }}>
                            Rank
                          </th>
                        ) : (
                          <>
                            <th
                              scope="col"
                              style={{ whiteSpace: "nowrap" }}
                            ></th>
                            <th scope="col" style={{ whiteSpace: "nowrap" }}>
                              Rank
                            </th>
                          </>
                        )
                      ) : delegated ? null : (
                        <th scope="col" style={{ whiteSpace: "nowrap" }}></th>
                      )}
                      <th
                        colSpan="2"
                        scope="col"
                        style={{ whiteSpace: "nowrap", marginRight: "20px" }}
                      >
                        Validator Name
                      </th>
                      <th scope="col" style={{ whiteSpace: "nowrap" }}>
                        Voting Power
                      </th>
                      <th scope="col" style={{ whiteSpace: "nowrap" }}>
                        Commission
                      </th>
                      {delegated ? null : (
                        <th scope="col" style={{ whiteSpace: "nowrap" }}>
                          Delegations
                        </th>
                      )}
                      <th scope="col" style={{ whiteSpace: "nowrap" }}>
                        Delegated Amount
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
                        delegatedValidators={delegatedValidators}
                        searchValue={searchValue}
                        setShowClaimError={setShowClaimError}
                        stakeDispatch={stakeDispatch}
                        stakeState={stakeState}
                        activeValidators={activeValidators}
                        totalTokens={totalTokens}
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
                        />
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </Stack>
          </Stack>
        </Col>

        <Col xs={4} className="h-100 pb-2 px-1">
          <ScrollableSectionContainer>
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
            />
          </ScrollableSectionContainer>
        </Col>
      </Row>
    </>
  );
}
