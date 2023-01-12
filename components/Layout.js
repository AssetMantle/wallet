import React from "react";
import Balance from "../views/Balance";
import Header from "../views/Header";
import ScrollableSectionContainer from "./ScrollableSectionContainer";

export default function Layout({ children }) {
  return (
    <div className="am_app_container">
      <Header />
      <main className="container-xxl pt-4 h-100">
        <div className="row px-2 position-relative h-100">
          <ScrollableSectionContainer className="col-3 d-flex flex-column gap-3">
            <Balance />
          </ScrollableSectionContainer>
          <div className="col-9 h-100">{children}</div>
        </div>
      </main>
    </div>
  );
}
