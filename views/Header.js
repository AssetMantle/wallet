/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import BasicData from "../data/BasicData";
import { MdOutlineContentCopy } from "react-icons/md";
import { RiKey2Fill } from "react-icons/ri";
import { VscSignOut } from "react-icons/vsc";

export default function Header({ Connected, setConnected }) {
  const dataSet = {
    profileImage:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80",
    name: "User1234",
    balance: "0.34847",
    qrCode: "/qr-code.svg",
    address: "ThequickbrownfoxjumpsoverthelazydogfIfthedogr",
  };
  return (
    <header className="nav-bg">
      <div className="container-lg d-flex align-items-center justify-content-between p-2">
        <div className="d-flex" style={{ width: "min(196px,30%)" }}>
          <img src={BasicData.logo} alt={BasicData.title} />
        </div>
        <nav className="navbar-nav d-flex align-items-center flex-row gap-3">
          {React.Children.toArray(
            BasicData.navs.map((navItem) => (
              <a
                className={`${navItem.variant}`}
                href={navItem.href}
                target={navItem.target ? navItem.target : "_self"}
              >
                {navItem.title}
              </a>
            ))
          )}
          {Connected ? (
            <div className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle am-link text-primary"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Profile
              </button>
              <div className="dropdown-menu nav-bg p-3 rounded-4 text-white">
                <div className="d-flex gap-3 py-2">
                  <div
                    className="rounded-circle"
                    style={{
                      width: "45px",
                      height: "45px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={dataSet.profileImage}
                      alt={dataSet.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  <div className="d-flex flex-column gap-0">
                    <h4 className="body2">{dataSet.name}</h4>
                    <p className="caption">{dataSet.balance} $MNTL</p>
                  </div>
                </div>
                <hr className="my-2" />
                <div className="d-flex flex-column">
                  <img
                    src={dataSet.qrCode}
                    alt="QR code"
                    className="mx-auto"
                    style={{ width: "min(140px, 100%)", aspectRatio: "1/1" }}
                  />
                  <button
                    className="d-flex align-items-center justify-content-center gap-2 text-center body2"
                    onClick={() =>
                      navigator.clipboard.writeText(dataSet.address)
                    }
                  >
                    {dataSet.address.substring(0, 9)}...
                    {dataSet.address.substring(
                      dataSet.address.length - 9,
                      dataSet.address.length
                    )}
                    <span className="text-primary">
                      <MdOutlineContentCopy />
                    </span>
                  </button>
                </div>
                <hr className="my-2" />
                <button className="d-flex align-items-center justify-content-center gap-2 text-center body2">
                  <span className="text-primary">
                    <RiKey2Fill />
                  </span>
                  Generate KeyStore
                </button>
                <hr className="my-2" />
                <button className="d-flex align-items-center justify-content-center gap-2 text-center body2">
                  <span className="text-primary">
                    <VscSignOut />
                  </span>
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <button
              className={`btn button-primary px-3`}
              onClick={() => setConnected(true)}
            >
              Connect
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
