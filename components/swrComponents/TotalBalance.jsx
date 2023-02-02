import { useChain } from "@cosmos-kit/react";
import React from "react";
import {
  defaultChainName,
  defaultChainSymbol,
  placeholderAvailableBalance,
} from "../../config";
import {
  useAvailableBalance,
  useDelegatedValidators,
  useTotalRewards,
  useTotalUnbonding,
  fromChainDenom,
  useMntlUsd,
} from "../../data";

export const TotalBalance = () => {
  const walletManager = useChain(defaultChainName);
  const { getSigningStargateClient, address, status } = walletManager;

  const { availableBalance, errorAvailableBalance, isLoadingAvailableBalance } =
    useAvailableBalance();
  const {
    delegatedValidators,
    totalDelegatedAmount,
    isLoadingDelegatedAmount,
    errorDelegatedAmount,
  } = useDelegatedValidators();
  const { allRewards, rewardsArray, errorRewards, isLoadingRewards } =
    useTotalRewards();
  const {
    totalUnbondingAmount,
    allUnbonding,
    isLoadingUnbonding,
    errorUnbonding,
  } = useTotalUnbonding();

  const denomDisplay = defaultChainSymbol;

  const totalBalanceDisplay =
    errorAvailableBalance ||
    errorDelegatedAmount ||
    errorRewards ||
    errorUnbonding ||
    isNaN(
      parseFloat(fromChainDenom(availableBalance)) +
        parseFloat(fromChainDenom(allRewards)) +
        parseFloat(fromChainDenom(totalUnbondingAmount)) +
        parseFloat(fromChainDenom(totalDelegatedAmount))
    )
      ? placeholderAvailableBalance
      : parseFloat(fromChainDenom(availableBalance)) +
        parseFloat(fromChainDenom(allRewards)) +
        parseFloat(fromChainDenom(totalUnbondingAmount)) +
        parseFloat(fromChainDenom(totalDelegatedAmount));

  return (
    <>
      {isLoadingAvailableBalance ||
      isLoadingUnbonding ||
      isLoadingDelegatedAmount ||
      isLoadingRewards ? (
        <p>Loading...</p>
      ) : (
        <p className={status === "Connected" ? "caption" : "caption text-gray"}>
          {totalBalanceDisplay}&nbsp;{denomDisplay}
        </p>
      )}
    </>
  );
};

export const TotalBalanceInUSD = () => {
  const { availableBalance, errorAvailableBalance, isLoadingAvailableBalance } =
    useAvailableBalance();
  const {
    delegatedValidators,
    totalDelegatedAmount,
    isLoadingDelegatedAmount,
    errorDelegatedAmount,
  } = useDelegatedValidators();
  const { allRewards, rewardsArray, errorRewards, isLoadingRewards } =
    useTotalRewards();
  const {
    totalUnbondingAmount,
    allUnbonding,
    isLoadingUnbonding,
    errorUnbonding,
  } = useTotalUnbonding();

  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();

  const totalBalanceInUSDDisplay =
    errorAvailableBalance ||
    errorDelegatedAmount ||
    errorRewards ||
    errorUnbonding ||
    isNaN(
      fromChainDenom(availableBalance) +
        fromChainDenom(allRewards) +
        fromChainDenom(totalUnbondingAmount) +
        fromChainDenom(totalDelegatedAmount)
    )
      ? placeholderAvailableBalance
      : (
          (fromChainDenom(availableBalance) +
            fromChainDenom(allRewards) +
            fromChainDenom(totalUnbondingAmount) +
            fromChainDenom(totalDelegatedAmount)) *
          parseFloat(mntlUsdValue)
        ).toString();

  return (
    <p className="caption2 text-gray">${totalBalanceInUSDDisplay}&nbsp;$USD</p>
  );
};
