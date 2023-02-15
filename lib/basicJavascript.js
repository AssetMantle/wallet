import BigNumber from "bignumber.js";
import { useRef } from "react";
import { useCallback } from "react";
import { useEffect } from "react";

export const isObjEmpty = (obj) => {
  return obj
    ? Object.keys(obj).length === 0 && obj.constructor === Object
    : true;
};

export const handleCopy = (value) => {
  navigator.clipboard.writeText(value?.toString());
};

export function useIsMounted() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
}

export const shiftDecimalPlaces = (
  value,
  decimals = defaultChainDenomExponent
) => {
  let strValue = value?.toString() || "0";
  if (!decimals || isNaN(Number(decimals))) {
    throw new Error("invalid decimals value for shiftDecimalPlaces");
  }
  return BigNumber(strValue).shiftedBy(Number(decimals)).toString();
};
