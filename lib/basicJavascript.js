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
