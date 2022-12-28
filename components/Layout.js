import { useWallet } from "@cosmos-kit/react";
import React, { useEffect, useState } from "react";
import Balance from "../views/Balance";
import Header from "../views/Header";
import Vesting from "../views/Vesting";
import ScrollableSectionContainer from "./ScrollableSectionContainer";

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
    <div className="am_app_container">
      <Header Connected={Connected} setConnected={setConnected} />
      <main className="container-xxl pt-4 h-100">
        <div className="row px-2 position-relative h-100">
          <ScrollableSectionContainer className="col-3 d-flex flex-column gap-4">
            <Balance />
            <Vesting />
          </ScrollableSectionContainer>
          <div className="col-9 h-100">{children}</div>
        </div>
      </main>
    </div>
  );
}
