import Link from "next/link";
import React from "react";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";
import { Stack } from "react-bootstrap";

export default function Custom404() {
  return (
    <ScrollableSectionContainer>
      <Stack className="align-items-center justify-content-center" gap={3}>
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
      </Stack>
    </ScrollableSectionContainer>
  );
}
