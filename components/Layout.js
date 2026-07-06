import React from "react";
import Balance from "../views/Balance";
import Header from "../views/Header";
import MobileTabBar from "./MobileTabBar";
import ScrollableSectionContainer from "./ScrollableSectionContainer";

export default function Layout({ children }) {
  return (
    <div className="am_app_container">
      <Header />
      <main className="container-xxl pt-4 h-100" style={{ maxWidth: "1920px" }}>
        <div className="row px-2 position-relative h-100 pb-2">
          <ScrollableSectionContainer className="col-12 col-lg-3 d-none d-lg-flex flex-column gap-3">
            <Balance />
          </ScrollableSectionContainer>
          <div className="col-12 col-lg-9 h-100">{children}</div>
        </div>
      </main>
      <MobileTabBar />
    </div>
  );
}
