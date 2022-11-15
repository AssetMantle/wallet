import React, { useState } from "react";
import { SlReload } from "react-icons/sl";
import { MdOutlineContentCopy } from "react-icons/md";
import Image from "next/image";

export default function Transact() {
  const [Tab, setTab] = useState(0);
  const [Address, setAddress] = useState("");
  const [Token, setToken] = useState("$MNTL");
  const [Amount, setAmount] = useState("");
  const balance = 100.0;
  const gasFee = 0.3;
  const tabs = [
    { name: "Send", href: "#send" },
    { name: "Receive", href: "#receive" },
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
    <section className="rounded-5 p-4 bg-gray-800 width-100 d-flex flex-column gap-3 transitionAll">
      <nav className="d-flex align-items-center justify-content-between gap-3">
        <div className="d-flex gap-3 align-items-center">
          {React.Children.toArray(
            tabs.map((tab, index) => (
              <button
                className={`am-link ${Tab === index ? "" : "text-white"} body2`}
                onClick={() => setTab(index)}
              >
                {tab.name}
              </button>
            ))
          )}
        </div>
        <button className="body2 text-primary" onClick={() => handleReload()}>
          <SlReload />
        </button>
      </nav>
      {
        {
          0: (
            <form
              className="nav-bg p-3 rounded-4 d-flex flex-column gap-3"
              onSubmit={(e) => handleSubmit(e)}
            >
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
                  className="bg-gray-800 p-1 px-2 text-primary"
                  onClick={() => setAmount(balance / 2)}
                >
                  half
                </button>
                <button
                  className="bg-gray-800 p-1 px-2 text-primary"
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
          ),
          1: (
            <div className="nav-bg p-3 rounded-4 d-flex flex-column gap-2 align-items-center justify-content-center">
              <div
                style={{
                  width: "min(140px, 100%)",
                  aspectRatio: "1/1",
                  position: "relative",
                }}
              >
                <Image layout="fill" src={WalletQrCode} alt="address QR code" />
              </div>
              <h4 className="body2 text-primary">Wallet Address</h4>
              <button
                className="d-flex align-items-center justify-content-center gap-2 text-center caption"
                onClick={() => navigator.clipboard.writeText(dataSet.address)}
              >
                {WalletAddress}
                <span className="text-primary">
                  <MdOutlineContentCopy />
                </span>
              </button>
            </div>
          ),
        }[Tab]
      }
    </section>
  );
}
