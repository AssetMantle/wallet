import React from "react";
import Balance from "../views/Balance";
import Header from "../views/Header";
import Banner from "./Banner";
// import Vesting from "../views/Vesting";
import ScrollableSectionContainer from "./ScrollableSectionContainer";

export default function Layout({ children }) {
  return (
    <div className="am_app_container">
      <Banner />
      <Header />
      <main className="container-xxl pt-4 h-100" style={{ maxWidth: "1920px" }}>
        <div className="row px-2 position-relative h-100">
          <ScrollableSectionContainer className="col-3 d-flex flex-column gap-3">
            <Balance />
            {/* <Vesting /> */}
          </ScrollableSectionContainer>
          <div className="col-9 h-100">{children}</div>
        </div>
      </main>
    </div>
  );
}
