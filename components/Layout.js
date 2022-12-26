import { useWallet } from "@cosmos-kit/react";
import React, { useEffect, useState } from "react";
import Balance from "../views/Balance";
import Header from "../views/Header";
import Portfolio from "../views/Portfolio";
import StakedToken from "../views/StakedToken";

export default function Layout({ children }) {
  const walletManager = useWallet();
  const { walletStatus } = walletManager;
  const [Connected, setConnected] = useState(
    walletStatus === "Connected" ? true : false
  );

  useEffect(() => {
    walletStatus === "Connected" ? setConnected(true) : setConnected(false);
  }, [walletStatus]);

  return (
    <>
      <Header Connected={Connected} setConnected={setConnected} />
      <main className="container-xxl pt-5">
        <div className="row px-2 position-relative">
          <div
            className="col-3 d-flex flex-column gap-4 position-sticky start-0"
            style={{
              height: "max-content",
              top: "66px",
            }}
          >
            <Balance />
            {/* <Portfolio /> */}
          </div>
          <div className="col-9">{children}</div>
        </div>
      </main>
    </>
  );
}
