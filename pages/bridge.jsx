import { useChain } from "@cosmos-kit/react";
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { useWeb3Modal, Web3Modal } from "@web3modal/react";
import Image from "next/image";
import React, { useState } from "react";
import { configureChains, createClient } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import ICTransactionInfo from "../components/ICTransactionInfo";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";
import { defaultChainName, defaultChainSymbol } from "../config";
import {
  fromChainDenom,
  placeholderAddress,
  sendIbcTokenToGravity,
  useAvailableBalance,
} from "../data";
import { shortenAddress } from "../lib/basicBlockchain";
import MntlToGravityBridge from "../views/MntlToGravityBridge";

export default function Bridge() {
  // commons
  const handleCopy = (e) => {
    navigator.clipboard.writeText(e);
  };

  // transactions start
  const walletManager = useChain(defaultChainName);
  const { address, getSigningStargateClient } = walletManager;
  const walletManager2 = useChain("gravitybridge");
  const gravityAddress = walletManager2.address;
  const { availableBalance } = useAvailableBalance();

  // web3modal and wagmi
  const chains = [mainnet, polygon];

  // Wagmi client
  const { provider } = configureChains(chains, [
    walletConnectProvider({ projectId: "95284efe95ac1c5b14c4c3d5f0c5c60e" }),
  ]);
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: modalConnectors({ appName: "web3Modal", chains }),
    provider,
  });

  const ethereumClient = new EthereumClient(wagmiClient, chains);
  const { isOpen, open, close } = useWeb3Modal();

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

  const handleMNTLAmountChange = (e) => {
    console.log(e.target.value);
    setMNTLAmount(e.target.value);
    e.target.value < 0.001 || e.target.value > MNtlBalance
      ? setMNTLAmountError("Insufficient Balance.")
      : setMNTLAmountError();
  };
  const handleGravityAmountChange = (e) => {
    setGravityAmount(e.target.value);
    e.target.value < 0.001 || e.target.value > GravityBalance
      ? setGravityAmountError("Insufficient Balance.")
      : setGravityAmountError();
  };
  const handleEthAmountChange = (e) => {
    setEthAmount(e.target.value);
    e.target.value < 0.001 || e.target.value > EthBalance
      ? setEthAmountError("Insufficient Balance.")
      : setEthAmountError();
  };
  const handlePolygonAmountChange = (e) => {
    setPolygonAmount(e.target.value);
    e.target.value < 0.001 || e.target.value > PolygonBalance
      ? setPolygonAmountError("Insufficient Balance.")
      : setPolygonAmountError();
  };

  const handleEthConnect = () => {
    setEthConnectionStat(true);
  };
  // transactions start

  const handleOpenWeb3Modal = async (e) => {
    e.preventDefault();
    await open();
  };

  const handleMantleToGravity = async () => {
    const { response, error } = await sendIbcTokenToGravity(
      address,
      GravityAddress,
      MNTLAmount,
      memo,

      { getSigningStargateClient }
    );
    console.log("response: ", response, " error: ", error);
  };

  const mntlToGravityJSX = (
    <div
      className={`bg-gray-800 p-3 rounded-4 d-flex flex-column gap-3 ${"border-color-primary"}`}
    >
      <div className="caption d-flex gap-2 align-items-center justify-content-between">
        <div className="d-flex gap-2 align-items-center position-relative">
          <div
            className="position-relative"
            style={{ width: "21px", aspectRatio: "1/1" }}
          >
            <Image
              src="/chainLogos/mntl.svg"
              alt="AssetMantle logo"
              layout="fill"
            />
          </div>
          <h5 className="caption2 text-primary">MNTL</h5>
        </div>
        <button
          className="caption2 d-flex gap-1"
          onClick={() => handleCopy(address)}
          style={{ wordBreak: "break-all" }}
        >
          {shortenAddress(address)}
          <span className="text-primary">
            <i className="bi bi-clipboard" />
          </span>
        </button>
      </div>
      <label
        htmlFor="mntlAmount"
        className="caption2 text-gray d-flex align-items-center justify-content-between gap-2"
      >
        Amount{" "}
        <small className="small text-gray">
          Transferable Balance : {fromChainDenom(availableBalance).toString()}
          &nbsp;
          {defaultChainSymbol}
        </small>
      </label>
      <div className="input-white d-flex py-2 px-3 rounded-2">
        <input
          type="number"
          placeholder="Enter Amount"
          name="mntlAmount"
          className="am-input-secondary caption2 flex-grow-1 bg-t"
          value={MNTLAmount}
          onChange={(e) => {
            handleMNTLAmountChange(e);
          }}
        />
        <button className="text-primary caption2">Max</button>
      </div>
      {MNTLAmountError && (
        <small className="small text-error">{MNTLAmountError}</small>
      )}
      <div className="d-flex align-items-center justify-content-end gap-2">
        <button
          onClick={handleMantleToGravity}
          className="button-primary py-2 px-4 d-flex gap-2 align-items-center caption2"
        >
          Send to Gravity Bridge <i className="bi bi-arrow-down" />
        </button>
      </div>
    </div>
  );

  const gravityToEthJSX = (
    <div className={`bg-gray-800 p-3 rounded-4 d-flex flex-column gap-3 ${""}`}>
      <div className="caption d-flex gap-2 align-items-center justify-content-between">
        <div className="d-flex gap-2 align-items-center position-relative">
          <div
            className="position-relative"
            style={{ width: "21px", aspectRatio: "1/1" }}
          >
            <Image
              src="/chainLogos/grav.svg"
              alt="Gravity Bridge"
              layout="fill"
            />
          </div>
          <h5 className="caption2 text-primary">Gravity Bridge</h5>
        </div>
        <button
          className="caption2 d-flex gap-1"
          onClick={() => handleCopy(gravityAddress)}
          style={{ wordBreak: "break-all" }}
        >
          {shortenAddress(gravityAddress)}{" "}
          <span className="text-primary">
            <i className="bi bi-clipboard" />
          </span>
        </button>
      </div>
      <label
        htmlFor="GravityAmount"
        className="caption2 text-gray d-flex align-items-center justify-content-between gap-2"
      >
        Amount{" "}
        <small className="small text-gray">
          Transferable Balance : {GravityBalance.toFixed(4)} $MNTL
        </small>
      </label>
      <div className="input-white d-flex py-2 px-3 rounded-2">
        <input
          type="number"
          placeholder="Enter Amount"
          name="GravityAmount"
          className="am-input-secondary caption2 flex-grow-1 bg-t"
          value={GravityAmount}
          onChange={(e) => handleGravityAmountChange(e)}
        />
        <button className="text-primary caption2">Max</button>
      </div>
      {GravityAmountError && (
        <small className="small text-error">{GravityAmountError}</small>
      )}
      <div className="d-flex align-items-center justify-content-end gap-3">
        <button className="button-secondary py-2 px-4 d-flex gap-2 align-items-center caption2">
          Send to Mantle Chain <i className="bi bi-arrow-up" />
        </button>
        <button className="button-primary py-2 px-4 d-flex gap-2 align-items-center caption2">
          Send to Ethereum Chain <i className="bi bi-arrow-down" />
        </button>
      </div>
    </div>
  );

  const ethToPolygonJSX = (
    <div className={`bg-gray-800 p-3 rounded-4 d-flex flex-column gap-3 ${""}`}>
      <div className="caption d-flex gap-2 align-items-center justify-content-between">
        <div className="d-flex gap-2 align-items-center position-relative">
          <div
            className="position-relative"
            style={{ width: "21px", aspectRatio: "1/1" }}
          >
            <Image
              src="/chainLogos/eth.svg"
              alt="Ethereum Chain"
              layout="fill"
            />
          </div>
          <h5 className="caption2 text-primary">Ethereum Chain</h5>
        </div>
        {EthConnectionStat ? (
          <button
            className="caption2 d-flex gap-1"
            onClick={() => handleCopy(EthereumAddress)}
            style={{ wordBreak: "break-all" }}
          >
            {EthereumAddress}{" "}
            <span className="text-primary">
              <i className="bi bi-clipboard" />
            </span>
          </button>
        ) : (
          <button
            className="caption2 d-flex gap-1 text-primary"
            onClick={handleOpenWeb3Modal}
          >
            <i className="bi bi-link-45deg" /> Connect Wallet
          </button>
        )}
      </div>
      <label
        htmlFor="ethAmount"
        className="caption2 text-gray d-flex align-items-center justify-content-between gap-2"
      >
        Amount{" "}
        <small className="small text-gray">
          Transferable Balance : {EthBalance.toFixed(4)} $MNTL
        </small>
      </label>
      <div className="input-white d-flex py-2 px-3 rounded-2">
        <input
          type="number"
          placeholder="Enter Amount"
          name="ethAmount"
          className="am-input-secondary caption2 flex-grow-1 bg-t"
          value={EthAmount}
          onChange={(e) => handleEthAmountChange(e)}
        />
        <button className="text-primary caption2">Max</button>
      </div>
      {EthAmountError && (
        <small className="small text-error">{EthAmountError}</small>
      )}
      <div className="d-flex align-items-center justify-content-end gap-3">
        <button className="button-secondary py-2 px-4 d-flex gap-2 align-items-center caption2">
          Send to Gravity bridge <i className="bi bi-arrow-up" />
        </button>
        <button className="button-primary py-2 px-4 d-flex gap-2 align-items-center caption2">
          Send to Polygon Chain <i className="bi bi-arrow-down" />
        </button>
      </div>
    </div>
  );

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
            <i className="bi bi-clipboard" />
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
              <MntlToGravityBridge />
              {gravityToEthJSX}
              {ethToPolygonJSX}
              {polytonToEthJSX}
              <Web3Modal
                projectId="95284efe95ac1c5b14c4c3d5f0c5c60e"
                ethereumClient={ethereumClient}
              />
            </div>
          </section>
        </ScrollableSectionContainer>
        <ScrollableSectionContainer className="col-12 pt-3 pt-lg-0 col-lg-4 d-flex flex-column gap-3">
          <div className="rounded-4 p-3 bg-gray-800 width-100 text-white-300">
            Please enter amount in the chain you want to make a transaction from
          </div>
          <button
            className="button-primary text-center px-3 py-2"
            style={{ maxWidth: "100%" }}
            data-bs-toggle="modal"
            data-bs-target="#BridgeModalTransact"
          >
            BridgeModalTransact
          </button>
          <ICTransactionInfo
            title="Send to Ethereum Chain"
            chainForm="Gravity Bridge"
            chainTo="Ethereum Chain"
            addressForm={GravityAddress}
            addressTo={EthereumAddress}
            amount="0000.00"
            gas="0000.00"
            time={90} //in minute
          />
          <ICTransactionInfo
            title="Send to Polygon Chain"
            chainForm="$MNTL Chain"
            chainTo="Polygon Chain"
            addressForm={MNtlAddress}
            addressTo={EthereumAddress}
            amount="0000.00"
            gas="0000.00"
            time={90} //in minute
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
                      <i className="bi bi-clipboard" />
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
