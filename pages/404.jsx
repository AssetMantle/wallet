import { Link } from "@chakra-ui/react";
import React from "react";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";

export default function Custom404() {
  return (
    <ScrollableSectionContainer className="d-flex flex-column align-items-center justify-content-center gap-3">
      <img
        src="/404.png"
        style={{ width: "min(480px,100%)" }}
        alt="404 illustration"
      />
      <p>
        Page or Route not found. Go to{" "}
        <Link className="text-primary" href={"/"}>
          Home.
          {/* </a> */}
        </Link>
      </p>
    </ScrollableSectionContainer>
  );
}
