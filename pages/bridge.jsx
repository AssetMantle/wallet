import { useChain } from "@cosmos-kit/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-toastify";
import ICTransactionInfo from "../components/ICTransactionInfo";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";
import Tooltip from "../components/Tooltip";
import { defaultChainName } from "../config";
import { placeholderAddress } from "../data";
import GravityToEthBridge from "../views/GravityToEthBridge";
import MntlToGravityBridge from "../views/MntlToGravityBridge";

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
      position: "bottom-center",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      toastId: txHash,
    });
  } else {
    toast.update(id, {
      render: "Transaction failed.Try Again",
      type: "error",
      isLoading: false,
      position: "bottom-center",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }
};

export default function Bridge() {
  // commons
  const handleCopy = (e) => {
    navigator.clipboard.writeText(e);
  };

  // transactions start
  const walletManager = useChain(defaultChainName);
  const { address, getSigningStargateClient } = walletManager;

  // other use states
  const [EthConnectionStat, setEthConnectionStat] = useState(false);

  const [MNTLAmountError, setMNTLAmountError] = useState(false);
  const [GravityAmountError, setGravityAmountError] = useState(false);
  const [EthAmountError, setEthAmountError] = useState(false);
  const [PolygonAmountError, setPolygonAmountError] = useState(false);

  const [MNtlAddress, setMNtlAddress] = useState(
    address ? address : placeholderAddress
  );
  const [GravityAddress, setGravityAddress] = useState(
    "gravity1egdwq4khcmsyd0tk6mpq28r7eawjpe6nwxy7ph"
  );
  const [EthereumAddress, setEthereumAddress] = useState("0xxxxxxxxxxxxx");

  const [MNTLAmount, setMNTLAmount] = useState();
  const [GravityAmount, setGravityAmount] = useState();
  const [EthAmount, setEthAmount] = useState();
  const [PolygonAmount, setPolygonAmount] = useState();

  const [MNtlBalance, setMNtlBalance] = useState(20);
  const [GravityBalance, setGravityBalance] = useState(30);
  const [EthBalance, setEthBalance] = useState(40);
  const [PolygonBalance, setPolygonBalance] = useState(50);
  const [memo, setMemo] = useState("");

  const handlePolygonAmountChange = (e) => {
    setPolygonAmount(e.target.value);
    e.target.value < 0.001 || e.target.value > PolygonBalance
      ? setPolygonAmountError("Insufficient Balance.")
      : setPolygonAmountError();
  };

  const handleOpenWeb3Modal = async (e) => {
    e.preventDefault();
    await open();
  };

  const polytonToEthJSX = (
    <div className={`bg-gray-800 p-3 rounded-4 d-flex flex-column gap-3 ${""}`}>
      <div className="caption d-flex gap-2 align-items-center justify-content-between">
        <div className="d-flex gap-2 align-items-center position-relative">
          <div
            className="position-relative"
            style={{ width: "21px", aspectRatio: "1/1" }}
          >
            <Image
              src="/chainLogos/polygon.svg"
              alt="Polygon Chain"
              layout="fill"
            />
          </div>
          <h5 className="caption2 text-primary">Polygon Chain</h5>
        </div>
        <button
          className="caption2 d-flex gap-1"
          onClick={handleOpenWeb3Modal}
          style={{ wordBreak: "break-all" }}
        >
          Connect Wallet
          <span className="text-primary">
            <i className="bi bi-files" />
          </span>
        </button>
      </div>
      <label
        htmlFor="mntlAmount"
        className="caption2 text-gray d-flex align-items-center justify-content-between gap-2"
      >
        Amount{" "}
        <small className="small text-gray">
          Transferable Balance : {PolygonBalance.toFixed(4)} $MNTL
        </small>
      </label>
      <div className="input-white d-flex py-2 px-3 rounded-2">
        <input
          type="number"
          placeholder="Enter Amount"
          name="mntlAmount"
          className="am-input-secondary caption2 flex-grow-1 bg-t"
          value={PolygonAmount}
          onChange={(e) => handlePolygonAmountChange(e)}
        />
        <button className="text-primary caption2">Max</button>
      </div>
      {PolygonAmountError && (
        <small className="small text-error">{PolygonAmountError}</small>
      )}
      <div className="d-flex align-items-center justify-content-end gap-3">
        <button className="button-secondary py-2 px-4 d-flex gap-2 align-items-center caption2">
          Send to ethereum Chain <i className="bi bi-arrow-up" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <main className="row h-100">
        <ScrollableSectionContainer className="col-12 col-lg-8">
          <section className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column gap-3 transitionAll">
            <nav className="d-flex align-items-center justify-content-between gap-3">
              <div className="d-flex gap-3 align-items-center">
                <h1 className="body1 text-primary">Interchain</h1>
              </div>
            </nav>
            <div className="nav-bg d-flex flex-column gap-3 rounded-4 p-3">
              <MntlToGravityBridge notify={notify} />
              <GravityToEthBridge />
              {/* <EthToPolygonBridge /> */}
              {polytonToEthJSX}
            </div>
          </section>
        </ScrollableSectionContainer>
        <ScrollableSectionContainer className="col-12 pt-3 pt-lg-0 col-lg-4 d-flex flex-column gap-3">
          <div className="rounded-4 p-3 bg-gray-800 width-100 text-white-300">
            <Tooltip
              titlePrimary={true}
              description={""}
              style={{ right: "330%" }}
            />
            &nbsp;The Order in which you need to complete the transactions:
          </div>
          <ICTransactionInfo
            title="1. Send to Gravity Chain"
            chainFrom="assetmantle"
            chainTo="gravitybridge"
          />
          <ICTransactionInfo
            title="2. Send to Ethereum Chain"
            chainFrom="gravitybridge"
            chainTo="ethereum"
          />
          <ICTransactionInfo
            title="3. Send to Polygon Chain"
            chainFrom="ethereum"
            chainTo="polygon"
          />
        </ScrollableSectionContainer>
      </main>
      <div
        className="modal "
        tabIndex="-1"
        role="dialog"
        id="BridgeModalTransact"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          style={{ maxWidth: "min(100%, 600px)" }}
        >
          <div className="modal-content">
            <div className="modal-header">
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
              <span
                className="mb-4 mx-auto text-success text-center h1"
                style={{ fontSize: "calc(10px + 10vmin)" }}
              >
                <i className="bi bi-check-circle" />
              </span>
              <h3 className="text-center h3 text-primary my-2">
                Transaction made successfully
              </h3>
              <p
                className="text-center caption2 text-white-300 mx-auto"
                style={{ maxWidth: "413px" }}
              >
                Please use the link given below to view the status and details
                of your transaction.
              </p>
              <div className="nav-bg rounded-4 p-2 mt-4 mb-1 d-flex flex-column gap-2">
                <div className="row">
                  <div className="col-4 px-1 text-white-300 caption2 text-end">
                    From:
                  </div>
                  <div
                    className="col-8 px-1 text-white caption lato"
                    style={{ fontWeight: "400" }}
                  >
                    Mantle Chain
                  </div>
                </div>
                <div className="row">
                  <div className="col-4 px-1 text-white-300 caption2 text-end">
                    To:
                  </div>
                  <div
                    className="col-8 px-1 text-white caption lato"
                    style={{ fontWeight: "400" }}
                  >
                    Gravity Bridge
                  </div>
                </div>
                <div className="row">
                  <div className="col-4 px-1 text-white-300 caption2 text-end">
                    Amount:
                  </div>
                  <div
                    className="col-8 px-1 text-white caption lato"
                    style={{ fontWeight: "400" }}
                  >
                    0000.00 $MNTL
                  </div>
                </div>
                <div className="row">
                  <div className="col-4 px-1 text-white-300 caption2 text-end">
                    Transaction Hash:
                  </div>
                  <button
                    className="col-8 px-1 text-white caption d-flex gap-2 align-items-center lato"
                    style={{ fontWeight: "400" }}
                    onClick={() =>
                      handleCopy("assetmantle.one/vie...RWG_vtTixYd88=")
                    }
                  >
                    assetmantle.one/vie...RWG_vtTixYd88=
                    <span className="text-primary">
                      <i className="bi bi-files" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
