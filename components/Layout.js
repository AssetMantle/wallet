import React, { useState } from "react";
import Balance from "../views/Balance";
import Header from "../views/Header";
import Portfolio from "../views/Portfolio";
import StakedToken from "../views/StakedToken";

export default function Layout({ children }) {
  const [Connected, setConnected] = useState(false);
  return (
    <>
      <Header Connected={Connected} setConnected={setConnected} />
      <main className="container-xxl pt-5">
        <div className="row px-2">
          <div className="col-3 d-flex flex-column gap-4">
            <Balance />
            {/* <Portfolio /> */}
          </div>
          <div className="col-9">{children}</div>
        </div>
      </main>
    </>
  );
}
