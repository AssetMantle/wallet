import React from "react";
import { BsInfoCircle } from "react-icons/bs";
import { useAvailableBalance } from "../data/swrStore";

export default function Balance() {
  const price = "0.312812";
  const {
    availableBalance,
    denom,
    isLoadingAvailableBalance,
    errorAvailableBalance,
  } = useAvailableBalance();

  const loadingString = "loading...";
  const balanceDisplay = isLoadingAvailableBalance
    ? loadingString
    : availableBalance;
  const balanceInUSDDisplay = isLoadingAvailableBalance
    ? loadingString
    : isNaN(Number(availableBalance))
    ? availableBalance
    : (Number(availableBalance) * Number(price)).toString();

  const denomDisplay = isLoadingAvailableBalance ? loadingString : denom;

  return (
    <section className="rounded-5 p-4 bg-gray-800 width-100 d-flex flex-column gap-3">
      <h4 className="body1 text-primary">Wallet balances</h4>
      <div className="nav-bg p-3 rounded-4 gap-3">
        <div className="d-flex flex-column gap-2">
          <p className="caption d-flex gap-2 align-items-center">
            Available Balance
            <span>
              <BsInfoCircle />
            </span>
          </p>
          <p className="caption">
            {balanceDisplay}&nbsp;{denomDisplay}
          </p>
        </div>
      </div>
      <div className="nav-bg p-3 rounded-4 gap-3">
        <div className="d-flex flex-column gap-2">
          <p className="caption d-flex gap-2 align-items-center">
            Current Price of {denomDisplay}
          </p>
          <p className="caption">{price} USD</p>
        </div>
      </div>
      <div className="nav-bg p-3 rounded-4 gap-3">
        <div className="d-flex flex-column gap-2">
          <p className="caption d-flex gap-2 align-items-center">Total Value</p>
          <p className="caption">{balanceInUSDDisplay}&nbsp; USD</p>
        </div>
      </div>
    </section>
  );
}
