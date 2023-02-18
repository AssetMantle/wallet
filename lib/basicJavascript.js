import BigNumber from "bignumber.js";
import { useCallback, useEffect, useRef } from "react";
import { defaultChainDenomExponent } from "../config";

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

export const cleanString = (str) => {
  if (str) {
    var strLower = str.toString().trim().toLowerCase();
    return strLower.replace(/\W/g, "");
  }
  return "";
};

export const shiftDecimalPlaces = (
  value,
  decimals = defaultChainDenomExponent
) => {
  if (!decimals || isNaN(Number(decimals))) {
    throw new Error("invalid decimals value for shiftDecimalPlaces");
  }

  const valueBigNumber = BigNumber(value?.toString() || 0).isNaN()
    ? BigNumber(0)
    : BigNumber(value?.toString() || 0);

  return valueBigNumber.shiftedBy(Number(decimals)).toFixed(0);
};
