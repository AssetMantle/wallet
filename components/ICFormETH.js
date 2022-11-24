import React, { useState } from "react";
import InputEdit from "./InputEdit";
import { IoMdSwap } from "react-icons/io";

export default function ICFormETH() {
  const [SwapEth, setSwapEth] = useState(false);
  const [Chain1, setChain1] = useState("mntl");
  const [Chain1Amount, setChain1Amount] = useState(65);
  const [Chain2, setChain2] = useState("eth");
  const [Chain2Amount, setChain2Amount] = useState(434);
  const [Address1, setAddress1] = useState("");
  const [Address2, setAddress2] = useState("");
  const [Amount, setAmount] = useState("");

  const chains1 = [
    { name: "AssetMantle", value: "mntl" },
    { name: "Chain 2s", value: "chain-2" },
  ];
  const chains2 = [
    { name: "Ethereum", value: "eth" },
    { name: "Chain 2", value: "chain-2" },
  ];

  const balance = 100.0;

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form
      className="nav-bg p-3 rounded-4 d-flex flex-column gap-3"
      onSubmit={(e) => handleSubmit(e)}
    >
      <div className="caption d-flex gap-2 align-items-center justify-content-between">
        <select
          className="flex-grow-1 am-select rounded-3"
          name="chain"
          id="chain"
          value={!SwapEth ? Chain1 : Chain2}
          disabled={true}
          onChange={(e) =>
            !SwapEth ? setChain1(e.target.value) : setChain2(e.target.value)
          }
        >
          <option value="" disabled>
            Select Chain
          </option>
          {React.Children.toArray(
            !SwapEth
              ? chains1.map((chainOp) => (
                  <option value={chainOp.value}>{chainOp.name}</option>
                ))
              : chains2.map((chainOp) => (
                  <option value={chainOp.value}>{chainOp.name}</option>
                ))
          )}
        </select>
        <span>
          Transferable: {!SwapEth ? Chain1Amount : Chain2Amount} $MNTL
        </span>
      </div>
      <InputEdit
        value={!SwapEth ? Address1 : Address2}
        setValue={!SwapEth ? setAddress1 : setAddress2}
      />
      <button
        className="h3 text-primary m-auto"
        style={{ transform: "rotate(90deg)" }}
        onClick={() => setSwapEth(!SwapEth)}
      >
        <IoMdSwap />
      </button>
      <div className="caption d-flex gap-2 align-items-center justify-content-between">
        <select
          className="flex-grow-1 am-select rounded-3"
          name="chain"
          id="chain"
          value={SwapEth ? Chain1 : Chain2}
          disabled={true}
          onChange={(e) =>
            SwapEth ? setChain1(e.target.value) : setChain2(e.target.value)
          }
        >
          <option value="" disabled>
            Select Chain
          </option>
          {React.Children.toArray(
            SwapEth
              ? chains1.map((chainOp) => (
                  <option value={chainOp.value}>{chainOp.name}</option>
                ))
              : chains2.map((chainOp) => (
                  <option value={chainOp.value}>{chainOp.name}</option>
                ))
          )}
        </select>
        <span>Transferable: {SwapEth ? Chain1Amount : Chain2Amount} $MNTL</span>
      </div>
      <InputEdit
        value={SwapEth ? Address1 : Address2}
        setValue={SwapEth ? setAddress1 : setAddress2}
      />
      <label
        className="caption d-flex gap-2 align-items-center justify-content-between"
        htmlFor="amount"
      >
        Amount
        {/* <span>Transferable: {balance} $MNTL</span> */}
      </label>
      <div className="p-3 py-2 d-flex rounded-2 gap-2 am-input">
        <input
          className="bg-t"
          type="number"
          name="amount"
          id="amount"
          value={Amount}
          placeholder="Enter Amount"
          style={{ flex: "1", border: "none", outline: "none" }}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          className="bg-gray-800 p-1 px-2 text-primary"
          onClick={() => setAmount(balance / 2)}
        >
          half
        </button>
        <button
          className="bg-gray-800 p-1 px-2 text-primary"
          onClick={() => setAmount(balance)}
        >
          max
        </button>
      </div>
      {Amount && <div className="ms-auto">Value: {Amount} $MNTL</div>}
      <button
        className="btn button-primary px-5"
        type="submit"
        disabled={!(Address1 && Address2 && Amount)}
      >
        Send
      </button>
    </form>
  );
}
