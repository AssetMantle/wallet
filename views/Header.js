import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdOutlineContentCopy } from "react-icons/md";
import { RiKey2Fill } from "react-icons/ri";
import { VscSignOut } from "react-icons/vsc";
import { BasicData } from "../data";

export default function Header({ Connected, setConnected }) {
  const dataSet = {
    profileImage: "/profile.avif",
    name: "User1234",
    balance: "0.34847",
    qrCode: "/qr-code.svg",
    address: "thequickbrownfoxjumpsoverthelazydogfIfthedogr",
  };
  return (
    <header className="nav-bg">
      <div className="container-xxl d-flex align-items-center justify-content-between p-3 px-4">
        <div
          className="d-flex position-relative"
          style={{ width: "min(196px,30%)", aspectRatio: "196/34" }}
        >
          <Image layout="fill" src={BasicData.logo} alt={BasicData.title} />
        </div>
        <nav className="navbar-nav d-flex align-items-center flex-row gap-3">
          {React.Children.toArray(
            BasicData.navs.map((navItem) => (
              <Link href={navItem.href}>
                <a
                  className={`${navItem.variant}`}
                  target={navItem.target ? navItem.target : "_self"}
                >
                  {navItem.title}
                </a>
              </Link>
            ))
          )}
          {Connected ? (
            <div className="nav-item dropdown">
              <button
                className="nav-link  dropdown-toggle am-link text-primary"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Profile
              </button>
              <div className="dropdown-menu nav-bg p-3 rounded-4 text-white">
                <div className="d-flex gap-3 py-2">
                  <div
                    className="rounded-circle position-relative"
                    style={{
                      width: "45px",
                      height: "45px",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={dataSet.profileImage}
                      alt={dataSet.name}
                      layout="fill"
                    />
                  </div>
                  <div className="d-flex flex-column gap-0">
                    <h4 className="body2">{dataSet.name}</h4>
                    <p className="caption">{dataSet.balance} $MNTL</p>
                  </div>
                </div>
                <hr className="my-2" />
                <div className="d-flex flex-column">
                  <div
                    className="position-relative mx-auto"
                    style={{ width: "min(140px, 100%)", aspectRatio: "1/1" }}
                  >
                    <Image layout="fill" src={dataSet.qrCode} alt="QR code" />
                  </div>
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
