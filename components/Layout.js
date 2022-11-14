import React from "react";
import Header from "../views/Header";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main className="container-lg">
        <div className="row">
          <div className="col-3"></div>
          <div className="col-6">{children}</div>
          <div className="col-3"></div>
        </div>
      </main>
    </>
  );
}
