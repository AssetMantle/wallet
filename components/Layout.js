import React, { useState } from "react";
import Balance from "../views/Balance";
import Header from "../views/Header";
import Banner from "./Banner";
// import Vesting from "../views/Vesting";
import ScrollableSectionContainer from "./ScrollableSectionContainer";

export default function Layout({ children }) {
  const [leftCol, setLeftCol] = useState(false);
  return (
    <>
      <div className="d-none d-md-block am_app_container">
        <Banner />
        <Header setLeftCol={setLeftCol} />
        <main
          className="container-xxl pt-4 h-100"
          style={{ maxWidth: "1920px" }}
        >
          <div className="row px-2 position-relative h-100 pb-2">
            <ScrollableSectionContainer
              className={`col-12 col-lg-3 d-none d-lg-flex flex-column gap-3 ${
                leftCol
                  ? "am_resp_right_ham w-50 top-0 start-0 bottom-0 d-flex align-items-center justify-content-center nav-bg p-4 p-lg-0 gap-5 gap-lg-3"
                  : ""
              }`}
            >
              <Balance />
              {/* <Vesting /> */}
              {leftCol && (
                <div
                  className="d-flex d-lg-none position-absolute top-0 end-0 p-3"
                  role="button"
                  onClick={() => setLeftCol(false)}
                >
                  <i className="bi bi-x-lg h2"></i>
                </div>
              )}
            </ScrollableSectionContainer>
            <div className="col-12 col-lg-9 h-100">{children}</div>
          </div>
        </main>
      </div>
      <div
        className="d-flex d-md-none overflow-hidden show-on-mobile align-items-center justify-content-center p-3"
        style={{ height: "100dvh" }}
      >
        <div
          className="d-flex flex-column rounded-3 bg-gray-700 overflow-hidden"
          style={{ width: "min(400px,100%)" }}
        >
          <div className="d-flex align-items-center justify-content-between nav-bg p-3">
            <div className="d-flex gap-2">
              <i className="bi bi-circle-fill text-error"></i>
              <i className="bi bi-circle-fill text-primary"></i>
              <i className="bi bi-circle-fill text-success"></i>
            </div>
            <i className="bi bi-info-circle text-blue-300"></i>
          </div>
          <div className="h2 d-flex align-items-center gap-4 p-3">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <h1 className="m-auto text-primary text-center">
              Please open the app on a Tab or Larger device.
            </h1>
            <i className="bi bi-exclamation-triangle-fill"></i>
          </div>
        </div>
      </div>
    </>
  );
}
