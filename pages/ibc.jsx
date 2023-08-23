import React, { useState } from "react";

export default function Ibc() {
  const [Chain, setChain] = useState("");
  const [Address, setAddress] = useState("");
  const [Token, setToken] = useState("$MNTL");
  const [Amount, setAmount] = useState("");
  const balance = 100.0;
  const gasFee = 0.3;
  const chains = [
    { name: "Chain 1", value: "chain-1" },
    { name: "Chain 2", value: "chain-2" },
  ];

  const WalletQrCode = "/qr-code.svg";
  const WalletAddress = "ThequickbrownfoxjumpsoverthelazydogfIfthedogr";

  const handleReload = () => {
    setAddress("");
    setAmount("");
    setToken("$MNTL");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <section className="rounded-5 p-4 bg-secondary width-100 d-flex flex-column gap-3 transitionAll">
      <nav className="d-flex align-items-center justify-content-between gap-3">
        <div className="d-flex gap-3 align-items-center">
          <button className={`am-link  body2`}>IBC Transaction</button>
        </div>
        <button
          className="body2 text-primary"
          onClick={() => handleReload()}
        ></button>
      </nav>
      <form
        className="bg-black p-3 rounded-4 d-flex flex-column gap-3"
        onSubmit={(e) => handleSubmit(e)}
      >
        <label
          className="caption d-flex gap-2 align-items-center"
          htmlFor="chain"
        >
          Chain
        </label>
        <select
          name="chain"
          id="chain"
          value={Chain}
          onChange={(e) => setChain(e.target.value)}
        >
          <option value="" disabled>
            Select Chain
          </option>
          {React.Children.toArray(
            chains.map((chainOp, index) => (
              <option key={index} value={chainOp.value}>
                {chainOp.name}
              </option>
            ))
          )}
        </select>
        <label
          className="caption d-flex gap-2 align-items-center"
          htmlFor="recipientAddress"
        >
          Recipient Address
        </label>
        <input
          className="bg-t p-3 py-2 rounded-2 am-input"
          type="text"
          name="recipientAddress"
          id="recipientAddress"
          value={Address}
          placeholder="Enter Recipient’s Address"
          onChange={(e) => setAddress(e.target.value)}
        />
        <label
          className="caption d-flex gap-2 align-items-center"
          htmlFor="token"
        >
          Token
        </label>
        <input
          className="bg-t p-3 py-2 rounded-2 am-input"
          type="text"
          name="token"
          id="token"
          readOnly
          value={Token}
          placeholder="Enter Recipient’s Token"
          onChange={(e) => setToken(e.target.value)}
        />
        <label
          className="caption d-flex gap-2 align-items-center justify-content-between"
          htmlFor="amount"
        >
          Amount <span>Transferable Balance : {balance} $MNTL</span>
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
            className="bg-secondary p-1 px-2 text-primary"
            onClick={() => setAmount(balance / 2)}
          >
            half
          </button>
          <button
            className="bg-secondary p-1 px-2 text-primary"
            onClick={() => setAmount(balance - gasFee)}
          >
            max
          </button>
        </div>
        <button
          className="btn button-primary px-5"
          type="submit"
          disabled={!(Address && Token && Amount)}
        >
          Send
        </button>
      </form>
    </section>
  );
}
