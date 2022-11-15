import React, { useState } from "react";
import Header from "../views/Header";

export default function Layout({ children }) {
  const [Connected, setConnected] = useState(false);
  return (
    <>
      <Header Connected={Connected} setConnected={setConnected} />
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
