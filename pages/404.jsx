import { Link } from "@chakra-ui/react";
import React from "react";

const Custom404 = () => {
  return (
    <>
      <img
        src="/404.png"
        style={{ width: "530px", marginLeft: "190px" }}
        alt=""
      />
      <p style={{ marginLeft: "320px" }}>
        Page or Route not found. Go to{" "}
        <Link style={{ color: "#ffc640" }} href={"/"}>
          Home.
          {/* </a> */}
        </Link>
      </p>
    </>
  );
};

export default Custom404;
