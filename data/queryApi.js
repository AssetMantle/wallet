import { normalizeBech32 } from "@cosmjs/encoding";
import { useChain } from "@cosmos-kit/react";
import BigNumber from "bignumber.js";
import { assets, chains } from "chain-registry";
import { cosmos } from "osmojs";
import useSwr from "swr";
import {
  defaultChainDenom,
  defaultChainDenomExponent,
  defaultChainName,
  defaultChainRESTProxy,
  defaultChainRPCProxy,
  defaultRefreshInterval,
  gravityChainDenom,
  gravityChainName,
  gravityChainRPCProxy,
  gravityIBCToken,
  mntlUsdApi,
  osmosisChainDenom,
  osmosisChainName,
  osmosisChainRPCProxy,
  osmosisIBCToken,
  placeholderAvailableBalance,
  slowRefreshInterval,
} from "../config";
import { convertBech32Address } from "../lib";
import { cosmos as cosmosModule, gravity } from "../modules";
import {
  bech32AddressSeperator,
  farmPools,
  placeholderAddress,
  staticTradeData,
} from "./constants";
import { fetchBalance, readContract } from "wagmi/actions";

const rpcEndpoint = defaultChainRPCProxy;
const restEndpoint = defaultChainRESTProxy;

const denom = assets.find(
  (assetObj) => assetObj?.chain_name === defaultChainName
)?.assets[0]?.base;

// get the RPC Query Client using Modules & Endpoint
const client = await cosmos.ClientFactory.createRPCQueryClient({
  rpcEndpoint,
});

const queryClient = await cosmosModule.ClientFactory.createLCDClient({
  restEndpoint: restEndpoint,
});

export const fromDenom = (value, exponent = defaultChainDenomExponent) => {
  if (isNaN(Number(exponent))) {
    throw new Error("invalid exponent value for fromDenom");
  }

  const valueBigNumber = BigNumber(value?.toString() || 0).isNaN()
    ? BigNumber(0)
    : BigNumber(value?.toString() || 0);

  const amount = valueBigNumber
    .shiftedBy(0 - Number(exponent))
    .toFixed(Number(exponent));
  return amount;
};

export const toDenom = (value, exponent = defaultChainDenomExponent) => {
  if (isNaN(Number(exponent))) {
    throw new Error("invalid exponent value for toDenom");
  }

  const valueBigNumber = BigNumber(value?.toString() || 0).isNaN()
    ? BigNumber(0)
    : BigNumber(value?.toString() || 0);

  const amount = valueBigNumber.shiftedBy(Number(exponent)).toFixed(0);
  return amount;
};

export const fromChainDenom = (
  value,
  exponent = null,
  chainName = defaultChainName,
  chainDenom = defaultChainDenom
) => {
  if (exponent && isNaN(Number(exponent))) {
    throw new Error("invalid exponent value for fromChainDenom");
  }

  let amount;
  // get the chain assets for the specified chain
  const chainassets = assets?.find?.((chain) => chain.chain_name === chainName);
  // get the coin data from the chain assets data
  const coin = chainassets?.assets?.find?.(
    (asset) => asset.base === chainDenom
  );
  // Get the display exponent
  // we can get the exponent from chain registry asset denom_units
  const exp =
    coin.denom_units.find((unit) => unit.denom === coin.display)?.exponent || 0;

  // show balance in display values by exponentiating it
  const valueBigNumber = BigNumber(value?.toString() || 0).isNaN()
    ? BigNumber(0)
    : BigNumber(value?.toString() || 0);

  amount = valueBigNumber
    .shiftedBy(0 - Number(exp))
    .toFormat(exponent ?? exponent ? Number(exponent) : Number(exp));
  return amount;
};

export const toChainDenom = (
  value,
  chainName = defaultChainName,
  chainDenom = defaultChainDenom
) => {
  let amount;
  // get the chain assets for the specified chain
  const chainassets = assets?.find?.((chain) => chain.chain_name === chainName);
  // get the coin data from the chain assets data
  const coin = chainassets?.assets?.find?.(
    (asset) => asset.base === chainDenom
  );
  // Get the display exponent
  // we can get the exponent from chain registry asset denom_units
  const exp =
    coin?.denom_units?.find?.((unit) => unit?.denom === coin?.display)
      ?.exponent || 0;

  // show balance in display values by exponentiating it
  const valueBigNumber = BigNumber(value?.toString() || 0).isNaN()
    ? BigNumber(0)
    : BigNumber(value?.toString() || 0);

  amount = valueBigNumber.shiftedBy(Number(exp)).toFixed(0);
  return amount;
};

export const decimalize = (
  value,
  exponent = null,
  chainName = defaultChainName,
  chainDenom = defaultChainDenom
) => {
  // get the chain assets for the specified chain
  const chainassets = assets?.find?.((chain) => chain.chain_name === chainName);
  // get the coin data from the chain assets data
  const coin = chainassets?.assets?.find?.(
    (asset) => asset.base === chainDenom
  );
  // Get the display exponent
  // we can get the exponent from chain registry asset denom_units
  const exp =
    exponent ??
    coin?.denom_units?.find?.((unit) => unit?.denom === coin?.display)
      ?.exponent ??
    0;
  let bnValue = BigNumber(value?.toString() || 0).isNaN()
    ? BigNumber(0)
    : BigNumber(value?.toString() || 0);

  return bnValue.toFormat(Number(exp));
};

// function to check whether an address is invalid
export const isInvalidAddress = (address, chainName = defaultChainName) => {
  // check if the address is not null or placeholder address
  if (address && address != placeholderAddress) {
    try {
      // check if the hrp of address matches of chain
      // get the hrp of address
      let splitArrays = address
        ?.toString()
        .trim()
        .split(bech32AddressSeperator);
      let hrpAddress = splitArrays?.[0];

      // get the hrp of the chain
      const hrpChain = chains?.find?.(
        (_chain) => _chain?.chain_name === chainName
      )?.bech32_prefix;

      // compare hrp of address and chain
      if (hrpAddress !== hrpChain) return true;

      // check if the hex value of the address is validated
      const normalizedAddress = normalizeBech32(address);
      console.log("Validated Address: ", normalizedAddress);

      return false;
    } catch (error) {
      console.error(error.message);
      return true;
    }
  }
  return true;
};

const fetchTotalUnbonding = async (url, address) => {
  // console.log("inside fetchTotalUnbonding() ");

  let totalUnbondingAmount;
  let allUnbonding = [];

  try {
    const { unbondingResponses } =
      await client.cosmos.staking.v1beta1.delegatorUnbondingDelegations({
        delegatorAddr: address,
      });
    if (!unbondingResponses?.length) {
      totalUnbondingAmount = 0;
    } else {
      unbondingResponses?.map?.((item) => {
        item?.entries?.map?.((ele) =>
          allUnbonding?.push?.({
            address: item?.validatorAddress,
            balance: ele?.balance,
            completion_time: ele?.completionTime,
          })
        );
        totalUnbondingAmount = allUnbonding?.reduce?.(
          (total, currentValue) =>
            parseFloat(total) + parseFloat(currentValue?.balance),
          parseFloat("0")
        );
      });
    }
  } catch (error) {
    console.error(`swr fetcher : url: ${url},  error: ${error}`);
    throw error;
  }
  // console.log(totalUnbondingAmount, allUnbonding);
  return { totalUnbondingAmount, allUnbonding };
};

//Get total value being unbonded
export const useTotalUnbonding = () => {
  // get the connected wallet parameters from useChain hook
  const walletManager = useChain(defaultChainName);
  const { address } = walletManager;

  const { data: unbondingObject, error } = useSwr(
    address ? ["useTotalUnbonding", address] : null,
    fetchTotalUnbonding,
    {
      fallbackData: [
        {
          delegatorAddress: placeholderAddress,
          entries: [],
          validatorAddress: placeholderAddress,
        },
      ],
      refreshInterval: defaultRefreshInterval,
      suspense: true,
    }
  );

  return {
    totalUnbondingAmount: unbondingObject?.totalUnbondingAmount,
    allUnbonding: unbondingObject?.allUnbonding,
    isLoadingUnbonding: !error && !unbondingObject,
    errorUnbonding: error,
  };
};

const fetchTotalRewards = async (url, address) => {
  // console.log("inside fetchTotalRewards() ");

  let totalRewards;
  let rewardsArray;
  let totalRewardsInWei;
  try {
    const { rewards } =
      await client.cosmos.distribution.v1beta1.delegationTotalRewards({
        delegatorAddress: address,
      });
    rewardsArray = rewards?.map?.((item) => {
      let amount = BigNumber(item?.reward?.[0]?.amount || 0)
        .dividedToIntegerBy(BigNumber(10).exponentiatedBy(18))
        .toString();

      return {
        ...item,
        reward: [{ amount: amount, denom: item?.reward?.[0]?.denom }],
      };
    });
    let zeroBigNumber = new BigNumber("0");

    // reduce function to add up the BigNumber formats of individual reward values
    totalRewardsInWei = rewardsArray?.reduce?.(
      (accumulator, currentValue) =>
        currentValue?.reward?.[0]?.amount
          ? accumulator.plus(new BigNumber(currentValue?.reward?.[0]?.amount))
          : accumulator.plus(new BigNumber("0")),
      zeroBigNumber
    );
    totalRewards = totalRewardsInWei?.toString();
  } catch (error) {
    console.error(`swr fetcher : url: ${url},  error: ${error}`);
    throw error;
  }
  return { totalRewards, rewardsArray };
};

//Get total claimable rewards
export const useTotalRewards = () => {
  // get the connected wallet parameters from useChain hook
  const walletManager = useChain(defaultChainName);
  const { address } = walletManager;

  const { data: rewardsObject, error } = useSwr(
    address ? ["useTotalRewards", address] : null,
    fetchTotalRewards,
    {
      fallbackData: [
        {
          validatorAddress: placeholderAddress,
          reward: [],
        },
      ],

      refreshInterval: slowRefreshInterval,
    }
  );
  return {
    allRewards: rewardsObject?.totalRewards,
    rewardsArray: rewardsObject?.rewardsArray,
    isLoadingRewards: !error && !rewardsObject,
    errorRewards: error,
  };
};

// fetcher function for useSwr of useAvailableBalance()
const fetchTotalDelegated = async (url, address) => {
  // console.log("inside fetchTotalDelegated() ");

  let totalDelegatedAmount;
  let delegatedValidators = [];

  // use a try catch block for creating rich Error object
  try {
    // get the data from cosmos queryClient

    //Fetch a list of all validators
    const { validators } = await client.cosmos.staking.v1beta1.validators({
      status: "",
    });
    //Fetch a list of all validators that have been delegated by the delegator
    const { delegationResponses } =
      await client.cosmos.staking.v1beta1.delegatorDelegations({
        delegatorAddr: address,
      });

    //Create an array of delegated validators with all additional information about them
    delegationResponses?.map?.((item) => {
      let match = validators?.find?.(
        (element) =>
          element?.operatorAddress === item?.delegation?.validatorAddress
      );
      if (match) {
        match.delegatedAmount = item?.balance?.amount;
        delegatedValidators?.push?.(match);
      }
    });
    //Get total delegated amount
    totalDelegatedAmount = delegationResponses?.reduce?.(
      (total, currentValue) =>
        parseFloat(total) + parseFloat(currentValue?.balance?.amount),
      parseFloat("0")
    );
  } catch (error) {
    console.error(`swr fetcher : url: ${url},  error: ${error}`);
    throw error;
  }
  // return the data
  return { totalDelegatedAmount, delegatedValidators };
};

//Get total amount delegated and everyone delegated to
export const useDelegatedValidators = () => {
  // get the connected wallet parameters from useChain hook
  const walletManager = useChain(defaultChainName);
  const { address } = walletManager;

  // let address = null;
  // console.log("address: ", address, " currentWalletInfo: ", currentWalletInfo);

  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: delegatedObject, error } = useSwr(
    address ? ["useDelegatedValidators", address] : null,
    fetchTotalDelegated,
    {
      fallbackData: [
        {
          balance: { denom: "umntl", amount: 0 },
          delegation: {
            delegator_address: "delegator_address",
            validator_address: "validator_address",
            shares: "298317289",
          },
        },
      ],
      suspense: true,
      refreshInterval: defaultRefreshInterval,
    }
  );
  return {
    delegatedValidators: delegatedObject?.delegatedValidators,
    totalDelegatedAmount: delegatedObject?.totalDelegatedAmount,
    isLoadingDelegatedAmount: !error && !delegatedObject,
    errorDelegatedAmount: error,
  };
};

// fetcher function for useSwr of useAvailableBalance()
const fetchTotalDelegations = async (url, address) => {
  // console.log("inside fetchTotalDelegations() ");

  let totalDelegations;

  // use a try catch block for creating rich Error object
  try {
    // get the data from cosmos queryClient
    const { validators } =
      await client.cosmos.staking.v1beta1.delegatorValidators({
        delegatorAddr: address,
      });
    totalDelegations = validators;
  } catch (error) {
    console.error(`swr fetcher : url: ${url},  error: ${error}`);
    throw error;
  }
  // return the data
  return totalDelegations;
};

//Get all current delegations of a particular address
export const useTotalDelegations = () => {
  // get the connected wallet parameters from useChain hook
  const walletManager = useChain(defaultChainName);
  const { address } = walletManager;

  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: delegationsArray, error } = useSwr(
    address ? ["useTotalDelegations", address] : null,
    fetchTotalDelegations,
    {
      fallbackData: [
        {
          balance: { denom: "umntl", amount: 0 },
          delegation: {
            delegator_address: "delegator_address",
            validator_address: "validator_address",
            shares: "298317289",
          },
        },
      ],
      suspense: true,
      refreshInterval: defaultRefreshInterval,
    }
  );
  return {
    allDelegations: delegationsArray,
    isLoadingDelegations: !error && !delegationsArray,
    errorDelegated: error,
  };
};

export const useMntlUsd = () => {
  // fetcher function for useSwr of useAvailableBalance()
  const fetchMntlUsd = async (url) => {
    // console.log("inside fetchMntlUsd, url: ", url);
    let mntlUsdValue, mntlPerEthValue;

    // use a try catch block for creating rich Error object
    try {
      // fetch the data from API
      const res = await fetch(mntlUsdApi);
      const resJson = await res?.json?.();
      mntlUsdValue = resJson?.assetmantle?.usd;
      mntlPerEthValue = resJson?.assetmantle?.eth;
    } catch (error) {
      console.error(`swr fetcher : url: ${url},  error: ${error}`);
      throw error;
    }

    // return the data
    return { mntlUsdValue, mntlPerEthValue };
  };

  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: mntlValueObject, error } = useSwr("useMntlUsd", fetchMntlUsd, {
    fallbackData: { mntlUsdValue: "0", mntlPerEthValue: "0" },
    refreshInterval: slowRefreshInterval,
  });

  return {
    mntlUsdValue: mntlValueObject?.mntlUsdValue,
    mntlPerEthValue: mntlValueObject?.mntlPerEthValue,
    // isLoadingMntlUsdValue: !error && !mntlUsdValue,
    errorMntlUsdValue: error,
  };
};

// fetcher function for useSwr of useAvailableBalance()
const fetchAvailableBalance = async (url, address) => {
  // console.log("inside fetchAvailableBalance ");
  let balanceValue;

  // use a try catch block for creating rich Error object
  try {
    // get the data from cosmos queryClient
    const { balance } = await client.cosmos.bank.v1beta1.balance({
      address,
      denom,
    });

    balanceValue = balance;
    // console.log("swr fetcher success: ", url);
  } catch (error) {
    console.error(`swr fetcher : url: ${url},  error: ${error}`);
    throw error;
  }

  // return the data
  return balanceValue;
};

export const useAvailableBalance = () => {
  // get the connected wallet parameters from useChain hook
  const walletManager = useChain(defaultChainName);
  const { address } = walletManager;

  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: balanceObject, error } = useSwr(
    address ? ["useAvailableBalance", address] : null,
    fetchAvailableBalance,
    {
      fallbackData: { amount: placeholderAvailableBalance, denom },
      refreshInterval: defaultRefreshInterval,
      // suspense: true,
    }
  );

  return {
    availableBalance: balanceObject?.amount,
    denom: balanceObject?.denom,
    isLoadingAvailableBalance: !error && !balanceObject,
    errorAvailableBalance: error,
  };
};

export const useAvailableBalanceGravity = () => {
  // get the connected wallet parameters from useChain hook
  const { address } = useChain(defaultChainName);

  // const address = "gravity1yyduggdnk5kgszamt7s9f0ep2n6hylxr6kjz7u";

  const gravityAddress = convertBech32Address(address, gravityChainName);

  let denomGravity = gravityChainDenom;
  let placeholderGravityCoin = {
    amount: placeholderAvailableBalance,
    denom: denomGravity,
  };

  let denomGravityIBCToken = gravityIBCToken;
  let placeholderGravityIBCCoin = {
    amount: placeholderAvailableBalance,
    denom: denomGravityIBCToken,
  };

  // fetcher function for useSwr of useAvailableBalance()
  const fetchAllBalancesGravity = async (url, address) => {
    // console.log("inside fetchAllBalancesGravity() ");
    // get the REST Query Client for Gravity Bridge Chain
    const rpcEndpointGravity = gravityChainRPCProxy;

    const queryClientGravity = await gravity.ClientFactory.createRPCQueryClient(
      {
        rpcEndpoint: rpcEndpointGravity,
      }
    );

    let balanceValues;

    // use a try catch block for creating rich Error object
    try {
      // get the data from cosmos queryClient
      const { balances } =
        await queryClientGravity.cosmos.bank.v1beta1.allBalances({
          address: address,
        });

      balanceValues = balances;
      // console.log("swr fetcher success: ", balances);
    } catch (error) {
      console.error(`swr fetcher error: ${url}`);
      throw error;
    }

    // return the data
    return balanceValues;
  };

  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: balanceObjects, error } = useSwr(
    gravityAddress ? ["gravitybalance", gravityAddress] : null,
    fetchAllBalancesGravity,
    {
      fallbackData: [placeholderGravityCoin, placeholderGravityIBCCoin],
      refreshInterval: defaultRefreshInterval,
      suspense: true,
    }
  );

  let availableBalanceGravityArray = balanceObjects?.filter?.(
    (value) => value?.denom == denomGravity
  );

  let availableBalanceGravityObject =
    availableBalanceGravityArray?.length != 0
      ? availableBalanceGravityArray?.[0]
      : placeholderGravityCoin;

  let availableBalanceIBCTokenArray = balanceObjects?.filter?.(
    (value) => value?.denom == denomGravityIBCToken
  );

  let availableBalanceIBCTokenObject =
    availableBalanceIBCTokenArray?.length != 0
      ? availableBalanceIBCTokenArray?.[0]
      : placeholderGravityIBCCoin;

  return {
    availableBalanceGravity: availableBalanceGravityObject?.amount,
    availableBalanceIBCToken: availableBalanceIBCTokenObject?.amount,
    denomGravity: availableBalanceGravityObject?.denom,
    denomGravityIBCToken: availableBalanceIBCTokenObject?.denom,
    isLoadingAvailableBalanceGravity: !error && !balanceObjects,
    errorAvailableBalanceGravity: error,
  };
};

export const useAvailableBalanceOsmosis = () => {
  // get the connected wallet parameters from useChain hook
  const { address } = useChain(defaultChainName);

  const osmosisAddress = convertBech32Address(address, osmosisChainName);

  let placeholderOsmosisCoin = {
    amount: placeholderAvailableBalance,
    denom: osmosisChainDenom,
  };

  let placeholderOsmosisIBCCoin = {
    amount: placeholderAvailableBalance,
    denom: osmosisIBCToken,
  };

  // fetcher function for useSwr of useAvailableBalance()
  const fetchAllBalancesOsmosis = async (url, address) => {
    const queryClientOsmosis = await cosmos.ClientFactory.createRPCQueryClient({
      rpcEndpoint: osmosisChainRPCProxy,
    });

    let balanceValues;

    // use a try catch block for creating rich Error object
    try {
      // get the data from cosmos queryClient
      const { balances } =
        await queryClientOsmosis.cosmos.bank.v1beta1.allBalances({
          address: address,
        });

      balanceValues = balances;
      // console.log("swr fetcher success: ", balances);
    } catch (error) {
      console.error(`swr fetcher error: ${url}`);
      throw error;
    }

    // return the data
    return balanceValues;
  };

  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: balanceObjects, error } = useSwr(
    osmosisAddress ? ["osmosisbalance", osmosisAddress] : null,
    fetchAllBalancesOsmosis,
    {
      fallbackData: [placeholderOsmosisCoin, placeholderOsmosisIBCCoin],
      refreshInterval: defaultRefreshInterval,
      suspense: true,
    }
  );

  let availableBalanceOsmosisArray = balanceObjects?.filter?.(
    (value) => value?.denom == osmosisChainDenom
  );

  let availableBalanceOsmosisObject =
    availableBalanceOsmosisArray?.length != 0
      ? availableBalanceOsmosisArray?.[0]
      : placeholderOsmosisCoin;

  let availableBalanceIBCTokenArray = balanceObjects?.filter?.(
    (value) => value?.denom == osmosisIBCToken
  );

  let availableBalanceIBCTokenObject =
    availableBalanceIBCTokenArray?.length != 0
      ? availableBalanceIBCTokenArray?.[0]
      : placeholderOsmosisIBCCoin;

  return {
    availableBalanceOsmosis: availableBalanceOsmosisObject?.amount,
    availableBalanceOsmosisIBCToken: availableBalanceIBCTokenObject?.amount,
    isLoadingAvailableBalanceOsmosis: !error && !balanceObjects,
    errorAvailableBalanceOsmosis: error,
  };
};

const fetchAllValidatorsBonded = async (url) => {
  // console.log("inside fetchAllValidatorsBonded() ");

  let allValidatorsBonded;

  // use a try catch block for creating rich Error object
  try {
    // get the data from cosmos queryClient
    const { validators } = await client.cosmos.staking.v1beta1.validators({
      status: "BOND_STATUS_BONDED",
    });
    allValidatorsBonded = validators;
  } catch (error) {
    console.error(`swr fetcher : url: ${url},  error: ${error}`);
    throw error;
  }
  // return the data
  return allValidatorsBonded;
};

//Get a list of all validators that can be delegated
export const useAllValidatorsBonded = () => {
  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: bondedValidatorsArray, error } = useSwr(
    "useAllValidatorsBonded",
    fetchAllValidatorsBonded,
    {
      fallbackData: [],
      // refreshInterval: 22000,
    }
  );
  return {
    allValidatorsBonded: bondedValidatorsArray,
    isLoadingValidatorsBonded: !error && !bondedValidatorsArray,
    errorValidatorsBonded: error,
  };
};

const fetchAllValidatorsUnbonded = async (url) => {
  // console.log("inside fetchAllValidatorsUnbonded() ");

  let allValidatorsUnbonded;

  // use a try catch block for creating rich Error object
  try {
    // get the data from cosmos queryClient
    const { validators } = await client.cosmos.staking.v1beta1.validators({
      status: "BOND_STATUS_UNBONDED",
    });
    allValidatorsUnbonded = validators;
  } catch (error) {
    console.error(`swr fetcher : url: ${url},  error: ${error}`);
    throw error;
  }
  // return the data
  return allValidatorsUnbonded;
};

export const useAllValidatorsUnbonded = () => {
  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: unbondedValidatorsArray, error } = useSwr(
    "useAllValidatorsUnbonded",
    fetchAllValidatorsUnbonded,
    {
      fallbackData: [],
      // refreshInterval: 20000,
    }
  );
  return {
    allValidatorsUnbonded: unbondedValidatorsArray,
    isLoadingValidatorsUnbonded: !error && !unbondedValidatorsArray,
    errorValidatorsUnbonded: error,
  };
};

export const useAllValidators = () => {
  // fetcher function for useSwr of useAvailableBalance()
  const fetchAllValidators = async (url) => {
    console.log("inside fetchAllValidators() ");

    let validatorArray;

    // use a try catch block for creating rich Error object
    try {
      // get the aggregated balance values from other swr fetchers
      const validatorBondedFetcher = fetchAllValidatorsBonded(
        "useAllValidatorsBonded2"
      );

      const validatorUnbondedFetcher = fetchAllValidatorsUnbonded(
        "useAllValidatorsUnbonded2"
      );

      const aggregatedFetchArray = await Promise.all([
        validatorBondedFetcher,
        validatorUnbondedFetcher,
      ]);

      validatorArray = [...aggregatedFetchArray[0], ...aggregatedFetchArray[1]];
      // console.log("aggregatedFetchArray: ", aggregatedFetchArray);
    } catch (error) {
      console.error(`swr fetcher : url: ${url},  error: ${error}`);
      throw error;
    }

    // return the data
    return validatorArray;
  };

  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: validatorArray, error } = useSwr(
    "useAllValidators",
    fetchAllValidators,
    {
      fallbackData: [],
    }
  );

  return {
    allValidators: validatorArray,
    isLoadingValidators: !error && !validatorArray,
    errorValidators: error,
  };
};

export const useTotalBalance = () => {
  // get the connected wallet parameters from useChain hook
  const chainContext = useChain(defaultChainName);
  const { address } = chainContext;

  // fetcher function for useSwr of useAvailableBalance()
  const fetchTotalBalance = async (url, address) => {
    // console.log("inside fetchTotalBalance() ");

    let balanceValue;

    // use a try catch block for creating rich Error object
    try {
      // get the aggregated balance values from other swr fetchers
      const availableBalanceFetcher = fetchAvailableBalance(
        "useAvailableBalance",
        address
      );

      const delegatedBalanceFetcher = fetchTotalDelegated(
        "useDelegatedValidators",
        address
      );

      const rewardsBalanceFetcher = fetchTotalRewards(
        "useTotalRewards",
        address
      );

      const unbondingBalanceFetcher = fetchTotalUnbonding(
        "useTotalUnbonding",
        address
      );

      const aggregatedFetchArray = await Promise.all([
        availableBalanceFetcher,
        delegatedBalanceFetcher,
        rewardsBalanceFetcher,
        unbondingBalanceFetcher,
      ]);

      balanceValue = BigNumber(aggregatedFetchArray?.[0]?.amount || 0)
        .plus(BigNumber(aggregatedFetchArray?.[1]?.totalDelegatedAmount || 0))
        .plus(BigNumber(aggregatedFetchArray?.[2]?.totalRewards || 0))
        .plus(BigNumber(aggregatedFetchArray?.[3]?.totalUnbondingAmount || 0))
        .toString();

      // console.log("balanceValue: ", balanceValue);
    } catch (error) {
      console.error(`swr fetcher : url: ${url},  error: ${error}`);
      throw error;
    }

    // return the data
    return balanceValue;
  };

  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: balanceValue, error } = useSwr(
    address ? ["useTotalBalance", address] : null,
    fetchTotalBalance,
    {
      fallbackData: placeholderAvailableBalance,
      refreshInterval: defaultRefreshInterval,
    }
  );

  return {
    totalBalance: balanceValue,
    isLoadingTotalBalance: !error && !balanceValue,
    errorTotalBalance: error,
  };
};

export const useVote = (proposalId) => {
  // get the connected wallet parameters from useChain hook
  const walletManager = useChain(defaultChainName);
  const { address } = walletManager;
  // fetcher function for useSwr of useAvailableBalance()
  const fetchVote = async (url, proposalId, address) => {
    // console.log("inside fetchVote() ");

    let voteInfo;
    // use a try catch block for creating rich Error object
    try {
      // get the data from cosmos queryClient
      const { vote } = await queryClient.cosmos.gov.v1beta1.vote({
        proposalId: proposalId,
        voter: address,
      });
      voteInfo = vote;
    } catch (error) {
      if (error.response.status == 400) {
        return { hasVoted: false };
      } else {
        console.error(`swr fetcher : url: ${url},  error: ${error} `);
        throw error;
      }
    }
    //return the data
    return { ...voteInfo, hasVoted: true };
  };
  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: voteObject, error } = useSwr(
    proposalId && address ? ["vote", proposalId, address] : null,
    fetchVote,
    { refreshInterval: defaultRefreshInterval }
  );

  console.log("voteObject");
  return {
    voteInfo: voteObject,
    isLoadingVote: !error && !voteObject,
    errorVote: error,
  };
};

export const useAllProposals = () => {
  // get the connected wallet parameters from useChain hook
  const walletManager = useChain(defaultChainName);
  const { walletStatus, address, currentWalletInfo } = walletManager;

  // fetcher function for useSwr of useAvailableBalance()
  const fetchAllProposals = async (url) => {
    // console.log("inside fetchAllProposals() ");

    let allProposals;

    // use a try catch block for creating rich Error object
    try {
      // get the data from cosmos queryClient
      const { proposals } = await queryClient.cosmos.gov.v1beta1.proposals({
        depositor: "",
        proposalStatus: 2,
        voter: "",
      });

      allProposals = proposals;
    } catch (error) {
      console.error(`swr fetcher : url: ${url},  error: ${error}`);
      throw error;
    }
    // return the data
    return allProposals;
  };
  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: proposalsArray, error } = useSwr(
    "useAllProposals",
    fetchAllProposals
  );
  return {
    allProposals: proposalsArray,
    isLoadingProposals: !error && !proposalsArray,
    // errorProposals: error,
  };
};

export const useAllVotes = (proposalId) => {
  // fetcher function for useSwr of useAvailableBalance()
  const fetchAllVotes = async (url) => {
    // console.log("inside fetchAllVotes() ");

    // let proposalIdSample = "6";
    let allVotes;

    // use a try catch block for creating rich Error object
    try {
      const { votes } = await queryClient.cosmos.gov.v1beta1.votes({
        proposalId: proposalId?.toString(),
      });
      allVotes = votes;
    } catch (error) {
      console.error(`swr fetcher : url: ${url},  error: ${error}`);
      throw error;
    }
    // return the data
    return allVotes;
  };
  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: votesArray, error } = useSwr("useAllVotes", fetchAllVotes);
  return {
    allVotes: votesArray,
    isLoadingVotes: !error && !votesArray,
    errorVotes: error,
  };
};

export const useWithdrawAddress = () => {
  // get the connected wallet parameters from useChain hook
  const walletManager = useChain(defaultChainName);
  const { address } = walletManager;

  // fetcher function for useSwr of useAvailableBalance()
  const fetchWithdrawAddress = async (url, address) => {
    // console.log("inside fetchWithdrawAddress() ");

    let claimAddress;

    // use a try catch block for creating rich Error object
    try {
      // get the data from cosmos queryClient
      const { withdrawAddress } =
        await client.cosmos.distribution.v1beta1.delegatorWithdrawAddress({
          delegatorAddress: address,
        });
      claimAddress = withdrawAddress;
    } catch (error) {
      console.error(`swr fetcher : url: ${url},  error: ${error}`);
      throw error;
    }
    // return the data
    return claimAddress;
  };
  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: withdrawAddress, error } = useSwr(
    address ? ["useWithdrawAddress", address] : null,
    fetchWithdrawAddress,
    {
      fallbackData: placeholderAddress,
      refreshInterval: defaultRefreshInterval,
    }
  );
  return {
    withdrawAddress: withdrawAddress,
    isLoadingWithdrawAddress: !error && !withdrawAddress,
    errorWithdrawAddress: error,
  };
};

// fetcher function for useSwr of useAvailableBalance()
const fetchAllTrades = async (url) => {
  // console.log("inside fetchAllTrades() ");
  let tradeData = [];
  let tokenDetails = {};

  try {
    const data = await fetch(
      "https://api.coingecko.com/api/v3/coins/assetmantle?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false"
    ).then((res) => res.json());

    tokenDetails = {
      marketCap: data?.market_data?.market_cap?.usd,
      circulatingSupply: data?.market_data?.circulating_supply,
      totalSupply: data?.market_data?.total_supply,
      maxSupply: data?.market_data?.max_supply,
      fullyDilutedValuation: data?.market_data?.fully_diluted_valuation?.usd,
      volume: data?.tickers
        ?.reduce(
          (accumulator, currentValue) =>
            accumulator + parseFloat(currentValue?.volume),
          0
        )
        .toFixed(2),
    };

    tradeData = data?.tickers?.map((item) => {
      const match = staticTradeData.find(
        (element) =>
          element.name == item?.market?.name &&
          element.target_coin_id == item?.target_coin_id &&
          element.coin_id == item?.coin_id
      );
      console.log(match);
      return {
        exchangeName: item?.market?.name,
        tradePair: match?.pair,
        volume: item?.converted_volume?.usd,
        price: item?.converted_last?.usd,
        logo: match?.logo,
        url: match?.url,
      };
    });
  } catch (error) {
    console.error(`swr fetcher : url: ${url},  error: ${error}`);
    throw error;
  }
  // return the data
  // console.log("inside SWR:", tradesArray);
  return { tradeData, tokenDetails };
};

export const useTrade = () => {
  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: tradesObject, error } = useSwr(
    "useTrade",
    fetchAllTrades
    // , {
    //   fallbackData: [],
    //   suspense: true,
    // }
  );
  // console.log("Outside SWR:", tradesArray);
  return {
    allTrades: tradesObject,
    isLoadingTrades: !error && !tradesObject,
    errorTrades: error,
  };
};

export const useOsmosis = () => {
  // fetcher function for useSwr of useAvailableBalance()
  const fetchAllOsmosis = async (url) => {
    // console.log("inside fetchAllOsmosis() ");

    let osmosisData;
    try {
      // const osmoMntlUsdcData = fetch("/api/osmosis/pools/v2/738").then((res) =>
      //   res.json()
      // );
      // // const osmoMntlUsdcAprData = fetch("/api/osmosis/apr/v2/738").then((res) =>
      // //   res.json()
      // // );
      // const osmoMntlOsmoData = fetch("/api/osmosis/pools/v2/690").then((res) =>
      //   res.json()
      // );
      // // const osmoMntlOsmoAprData = fetch("/api/osmosis/apr/v2/690").then((res) =>
      // //   res.json()
      // // );
      // // const osmoAtomMntlData = fetch("/api/osmosis/pools/v2/686").then((res) =>
      // //   res.json()
      // // );
      // const osmoAtomMntlAprData = fetch("/api/osmosis/apr/v2/686").then((res) =>
      //   res.json()
      // );

      // const aggregatedFetchArray = await Promise.allSettled([
      //   osmoMntlUsdcData,
      //   // osmoMntlUsdcAprData,
      //   osmoMntlOsmoData,
      //   // osmoMntlOsmoAprData,
      //   // osmoAtomMntlData,
      //   osmoAtomMntlAprData,
      // ]);

      const urlData = [
        {
          symbol: "ATOM",
          url: "https://app.osmosis.zone/pool/686",
        },
        {
          symbol: "USDC",
          url: "https://app.osmosis.zone/pool/738",
        },
        {
          symbol: "OSMO",
          url: "https://app.osmosis.zone/pool/690",
        },
      ];

      const llamaData = await fetch("https://yields.llama.fi/pools").then(
        (res) => res.json()
      );

      const filteredLlamaData = llamaData?.data?.filter(
        (item) =>
          item?.symbol.includes("MNTL") && item?.project == "osmosis-dex"
      );

      osmosisData = filteredLlamaData?.map((item) => {
        return {
          ...item,
          url: urlData.find((e) => item?.symbol.includes(e.symbol)).url,
        };
      });

      // osmosisData = [
      //   {
      //     project: "Osmosis",
      //     chain: "Cosmos",
      //     symbol:
      //       aggregatedFetchArray?.[0]?.[0]?.symbol +
      //       "-" +
      //       aggregatedFetchArray?.[0]?.[1]?.symbol,
      //     apy: Number(
      //       Math.max(
      //         aggregatedFetchArray?.[1]?.[0]?.apr_list[0]?.apr_1d,
      //         aggregatedFetchArray?.[1]?.[0]?.apr_list[0]?.apr_7d,
      //         aggregatedFetchArray?.[1]?.[0]?.apr_list[0]?.apr_14d
      //       )
      //     ).toFixed(2),
      //     tvlUsd: aggregatedFetchArray?.[0]?.[0]?.liquidity
      //       ?.toString()
      //       ?.split(".")[0],
      //     url: "https://app.osmosis.zone/pool/738",
      //   },
      //   {
      //     project: "Osmosis",
      //     chain: "Cosmos",
      //     symbol:
      //       aggregatedFetchArray?.[2]?.[0]?.symbol +
      //       "-" +
      //       aggregatedFetchArray?.[2]?.[1]?.symbol,
      //     apy: Number(
      //       Math.max(
      //         aggregatedFetchArray?.[3]?.[0]?.apr_list?.find(
      //           (item) => item?.symbol == "MNTL"
      //         )?.apr_1d,
      //         aggregatedFetchArray?.[3]?.[0]?.apr_list?.find(
      //           (item) => item?.symbol == "MNTL"
      //         )?.apr_7d,
      //         aggregatedFetchArray?.[3]?.[0]?.apr_list?.find(
      //           (item) => item?.symbol == "MNTL"
      //         )?.apr_14d
      //       )
      //     ).toFixed(2),
      //     // osmoAtomMntlAprData[0?.apr_list?.map((e)=>console.log(e))],
      //     tvlUsd: aggregatedFetchArray?.[2]?.[0]?.liquidity
      //       ?.toString()
      //       ?.split(".")[0],
      //     url: "https://app.osmosis.zone/pool/690",
      //   },
      //   {
      //     project: "Osmosis",
      //     chain: "Cosmos",
      //     symbol:
      //       aggregatedFetchArray?.[4]?.[0]?.symbol +
      //       "-" +
      //       aggregatedFetchArray?.[4]?.[1]?.symbol,
      //     apy: Number(
      //       Math.max(
      //         aggregatedFetchArray?.[5]?.[0]?.apr_list[0]?.apr_1d,
      //         aggregatedFetchArray?.[5]?.[0]?.apr_list[0]?.apr_7d,
      //         aggregatedFetchArray?.[5]?.[0]?.apr_list[0]?.apr_14d
      //       )
      //     ).toFixed(2),
      //     tvlUsd: aggregatedFetchArray?.[4]?.[0]?.liquidity
      //       ?.toString()
      //       ?.split(".")[0],
      //     url: "https://app.osmosis.zone/pool/686",
      //   },
      // ];
    } catch (error) {
      console.error(`swr fetcher : url: ${url},  error: ${error}`);
      throw error;
    }

    // return the data
    return osmosisData;
  };
  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: osmosisArray, error } = useSwr("useOsmosis", fetchAllOsmosis);
  return {
    allOsmosis: osmosisArray,
    isLoadingOsmosis: !error && !osmosisArray,
    errorOsmosis: error,
  };
};

export const useQuickswap = () => {
  // fetcher function for useSwr of useAvailableBalance()
  const fetchAllQuickswap = async (url) => {
    // console.log("inside fetchAllQuickswap() ");

    let quickswapData = [];
    const urlData = [
      {
        symbol: "VERSA",
        url: "https://quickswap.exchange/#/pools/v2?currency0=0x38a536a31ba4d8c1bcca016abbf786ecd25877e8&currency1=0x8497842420cfdbc97896c2353d75d89fc8d5be5d",
      },
      {
        symbol: "USDC",
        url: "https://quickswap.exchange/#/pools/v2?currency0=0x2791bca1f2de4661ed88a30c99a7a9449aa84174&currency1=0x38a536a31ba4d8c1bcca016abbf786ecd25877e8",
      },
    ];
    try {
      const llamaData = await fetch("https://yields.llama.fi/pools").then(
        (res) => res.json()
      );
      const filteredLlamaData = llamaData?.data?.filter(
        (item) =>
          item?.symbol.includes("MNTL") &&
          (item?.project == "quickswap-dex" || item?.project == "uniswap-v3")
      );

      quickswapData = filteredLlamaData?.map((item) => {
        return {
          ...item,
          url: urlData.find((e) => item?.symbol.includes(e.symbol)).url,
        };
      });
    } catch (error) {
      console.error(`swr fetcher : url: ${url},  error: ${error}`);
      throw error;
    }
    // return the data
    return quickswapData;
  };
  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: quickswapArray, error } = useSwr(
    "useQuickswap",
    fetchAllQuickswap,
    {
      fallbackData: [],
      suspense: true,
    }
  );
  return {
    allQuickswap: quickswapArray,
    isLoadingQuickswap: !error && !quickswapArray,
    errorQuickswap: error,
  };
};

export const useEthereumFarm = () => {
  // fetcher function for useSwr of useAvailableBalance()
  const fetchEthereumFarm = async (url) => {
    console.log("inside fetchEthereumFarm() ");
    let uniswapData;

    try {
      uniswapData = {};
      uniswapData.apr = "200";
      uniswapData.tvl = "30000";
      uniswapData.pair = "MNTL-ETH";
    } catch (error) {
      console.error(`swr fetcher : url: ${url},  error: ${error}`);
      throw error;
    }
    // return the data
    return uniswapData;
  };
  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: uniswapData, error } = useSwr(
    "useEthereumFarm",
    fetchEthereumFarm
  );
  return {
    ethereumFarm: uniswapData,
    isLoadingEtherumFarm: !error && !uniswapData,
    errorEtherumFarm: error,
  };
};

export const useComdexFarm = (poolID) => {
  // fetcher function for useSwr of useAvailableBalance()
  const fetchAllComdex = async (url, poolID) => {
    const initialData = [
      {
        api: "https://stat.comdex.one/api/v2/cswap/pairs/33",
        pair: "MNTL/CMST",
        poolNumber: "33",
      },
      {
        api: "https://stat.comdex.one/api/v2/cswap/pairs/32",
        pair: "MNTL/CMDX",
        poolNumber: "32",
      },
    ];
    let comdexData;
    try {
      const tvlData = await fetch(initialData[poolID].api).then((res) =>
        res.json()
      );

      const comdexAprData = await fetch(
        "https://stat.comdex.one/api/v2/cswap/aprs"
      ).then((res) => res.json());

      comdexData = {
        pair: initialData[poolID].pair,
        tvlUsd: tvlData?.data?.total_liquidity,
        apr: comdexAprData?.data?.[
          initialData[poolID].poolNumber
        ]?.incentive_rewards?.[0]?.apr?.toFixed(5),
        // ?.incentive_rewards?.apr,
      };
    } catch (error) {
      console.error(`swr fetcher : url: ${url},  error: ${error}`);
      throw error;
    }
    // return the data
    return comdexData;
  };
  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: comdexData, error } = useSwr(
    ["useComdex", poolID],
    fetchAllComdex,
    {
      suspense: true,
    }
  );
  return {
    comdexFarm: comdexData,
    isLoadingComdexFarm: !error && !comdexData,
    errorComdexFarm: error,
  };
};

export const usePolygonFarm = (poolIndex) => {
  let polygonFarmData;
  const { mntlUsdValue } = useMntlUsd();

  const fetchPolygonFarm = async (url, poolIndex, mntlUsdValue) => {
    const selectedQuickswapFarmPool = farmPools?.[1]?.pools?.[poolIndex];
    const quickV2StakerContractAddress =
      selectedQuickswapFarmPool?.farmContractAddress;
    const lpTokenContractAddress = selectedQuickswapFarmPool?.lpTokenAddress;
    const lpTokenABI = selectedQuickswapFarmPool?.lpTokenABI;
    const lpTokenContract = {
      address: lpTokenContractAddress,
      abi: lpTokenABI,
    };
    const hookArgs = { chainId: 137 };
    const rewardPerBlock = selectedQuickswapFarmPool?.rewardPerBlock || 0;
    const rewardsPerDay = BigNumber(rewardPerBlock)
      .multipliedBy(86400)
      .dividedToIntegerBy(2.2)
      .toString();
    const totalSupplyValue = selectedQuickswapFarmPool?.totalSupply;
    console.log("inside fetchPolygonFarm");
    try {
      const lpTokenBalanceFarmPool = await fetchBalance({
        address: quickV2StakerContractAddress,
        token: lpTokenContractAddress,
        ...hookArgs,
      });

      const balance = toDenom(lpTokenBalanceFarmPool?.formatted, 18);
      const stakedRatio = BigNumber(balance)
        ?.dividedBy(BigNumber(totalSupplyValue))
        .toString();

      // wagmi hook to get reserves of MNTL from the LP Token

      const lpTokensReserves = await readContract({
        ...lpTokenContract,
        functionName: "getReserves",
        args: [],
        ...hookArgs,
      });

      const reserves = fromDenom(
        lpTokensReserves?.[
          poolIndex == 0 ? "_reserve0" : "_reserve1"
        ]?.toString()
      );
      const stakedToken = BigNumber(reserves)
        ?.multipliedBy(BigNumber(stakedRatio))
        .toString();

      const mntlTvl = BigNumber(stakedToken)
        ?.multipliedBy(BigNumber(mntlUsdValue))
        .toString();

      const tvl = BigNumber(mntlTvl).multipliedBy(2).toFixed(2);

      const rewardsPerYear = BigNumber(rewardsPerDay)
        .multipliedBy(365)
        .toString();

      const rewardsPerYearInUsd = BigNumber(fromDenom(rewardsPerYear))
        .multipliedBy(BigNumber(mntlUsdValue))
        .toString();

      const apr = BigNumber(rewardsPerYearInUsd)
        ?.dividedBy(tvl)
        ?.multipliedBy(BigNumber(100))
        ?.toFixed(2);

      polygonFarmData = {
        pair: poolIndex == 0 ? "MNTL-VERSA" : "MNTL-USDC",
        apr: apr,
        tvl: tvl,
      };

      console.log("polygonFarmData", polygonFarmData);
    } catch (error) {
      console.error(`swr fetcher : url: ${url},  error: ${error}`);
      throw error;
    }

    // return the data
    return polygonFarmData;
  };

  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: polygonFarmObject, error } = useSwr(
    mntlUsdValue ? ["usePolygonFarm", poolIndex, mntlUsdValue] : null,
    fetchPolygonFarm,
    { suspense: true }
  );
  console.log("polygonFarmObject", polygonFarmObject);
  return {
    allPolygonFarm: polygonFarmObject,
    isLoadingPolygonFarm: !error && !polygonFarmObject,
    errorPolygonFarm: error,
  };
};
