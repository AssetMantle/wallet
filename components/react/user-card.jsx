"use client";


import { Stack } from "@chakra-ui/react";
import React from "react";

export const ConnectedUserInfo = ({ username, icon }) => {
  return (
    <Stack spacing={1} alignItems="center">
      {username && (
        <>
          <div>{icon}</div>
          {}
          <p>{username}</p>
        </>
      )}
    </Stack>
  );
};
