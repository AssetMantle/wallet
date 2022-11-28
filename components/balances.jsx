import { useEffect } from "react";
import { Balances } from "../data";

export const BalancesSection = () => {
  console.log("inside BalancesSection");
  useEffect(() => {
    (async () => {
      const { balances } = await Balances();
    })();
  }, []);

  return (
    <>
      <p>123</p>
    </>
  );
};
