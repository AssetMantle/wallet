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
  defaultChainSymbol,
  gravityChainDenom,
  gravityChainName,
  gravityChainRPCProxy,
  gravityIBCToken,
  mntlUsdApi,
  placeholderAvailableBalance,
  placeholderMntlUsdValue,
} from "../config";
import { convertBech32Address } from "../lib";
import { cosmos as cosmosModule } from "../modules";
import { bech32AddressSeperator, placeholderAddress } from "./constants";

const rpcEndpoint = defaultChainRPCProxy;
const restEndpoint = defaultChainRESTProxy;

const rpcEndpointGravity = gravityChainRPCProxy;

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

// get the REST Query Client for Gravity Bridge Chain
const queryClientGravity = await cosmos.ClientFactory.createRPCQueryClient({
  rpcEndpoint: rpcEndpointGravity,
});

export const fromDenom = (value, exponent = defaultChainDenomExponent) => {
  return parseFloat(
    (parseFloat(value) / Math.pow(10, parseFloat(exponent))).toFixed(6)
  );
};

export const toDenom = (value, exponent = defaultChainDenomExponent) => {
  return parseFloat(
    (parseFloat(value) * Math.pow(10, parseFloat(exponent))).toFixed(0)
  );
};

export const fromChainDenom = (
  value,
  chainName = defaultChainName,
  chainDenom = defaultChainDenom
) => {
  let amount;
  // get the chain assets for the specified chain
  const chainassets = assets.find((chain) => chain.chain_name === chainName);
  // get the coin data from the chain assets data
  const coin = chainassets.assets.find((asset) => asset.base === chainDenom);
  // Get the display exponent
  // we can get the exponent from chain registry asset denom_units
  const exp = coin.denom_units.find(
    (unit) => unit.denom === coin.display
  )?.exponent;
  // show balance in display values by exponentiating it
  const valueBigNumber = new BigNumber(value?.toString() || 0);
  if (BigNumber.isBigNumber(valueBigNumber)) {
    amount = valueBigNumber
      .multipliedBy(10 ** -exp)
      .toFixed(exp)
      .toString();
  } else {
    return "-1";
  }
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
  const exp = coin?.denom_units?.find?.(
    (unit) => unit?.denom === coin?.display
  )?.exponent;
  // show balance in display values by exponentiating it
  const valueBigNumber = new BigNumber(value?.toString() || 0);
  if (BigNumber.isBigNumber(valueBigNumber)) {
    amount = valueBigNumber
      .multipliedBy(10 ** exp)
      .toFixed(0)
      .toString();
  } else {
    return "-1";
  }
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
    exponent ||
    coin?.denom_units?.find?.((unit) => unit?.denom === coin?.display)
      ?.exponent;
  const bnValue = BigNumber(value || 0);
  if (bnValue.isNaN()) bnValue = BigNumber(0);

  return bnValue.toFixed(exp).toString();
};

// function to check whether an address is invalid
export const isInvalidAddress = (address, chainName = defaultChainName) => {
  console.log("inside isInvalidAddress, address: ", address);
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

//Get total value being unbonded
export const useTotalUnbonding = () => {
  // get the connected wallet parameters from useChain hook
  const walletManager = useChain(defaultChainName);
  const { address } = walletManager;

  const fetchTotalUnbonding = async (url, address) => {
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

  const { data: unbondingObject, error } = useSwr(
    address ? ["unbonding", address] : null,
    fetchTotalUnbonding,
    {
      fallbackData: [
        {
          delegatorAddress: placeholderAddress,
          entries: [],
          validatorAddress: placeholderAddress,
        },
      ],
      refreshInterval: 1000,
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

//Get total claimable rewards
export const useTotalRewards = () => {
  // get the connected wallet parameters from useChain hook
  const walletManager = useChain(defaultChainName);
  const { address } = walletManager;
  const fetchTotalRewards = async (url) => {
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

  const { data: rewardsObject, error } = useSwr(
    address ? ["rewards", address] : null,
    fetchTotalRewards,
    {
      fallbackData: [
        {
          validatorAddress: placeholderAddress,
          reward: [],
        },
      ],

      refreshInterval: 1000,
      suspense: true,
    }
  );
  return {
    allRewards: rewardsObject?.totalRewards,
    rewardsArray: rewardsObject?.rewardsArray,
    isLoadingRewards: !error && !rewardsObject,
    errorRewards: error,
  };
};

//Get total amount delegated and everyone delegated to
export const useDelegatedValidators = () => {
  // get the connected wallet parameters from useChain hook
  const walletManager = useChain(defaultChainName);
  const { address } = walletManager;

  // let address = null;
  // console.log("address: ", address, " currentWalletInfo: ", currentWalletInfo);

  // fetcher function for useSwr of useAvailableBalance()
  const fetchTotalDelegated = async (url, address) => {
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

  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: delegatedObject, error } = useSwr(
    address ? ["delegated", address] : null,
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
      refreshInterval: 1000,
    }
  );
  return {
    delegatedValidators: delegatedObject?.delegatedValidators,
    totalDelegatedAmount: delegatedObject?.totalDelegatedAmount,
    isLoadingDelegatedAmount: !error && !delegatedObject,
    errorDelegatedAmount: error,
  };
};

//Get all current delegations of a particular address
export const useTotalDelegations = () => {
  // get the connected wallet parameters from useChain hook
  const walletManager = useChain(defaultChainName);
  const { address } = walletManager;

  // let address = null;
  // console.log("address: ", address, " currentWalletInfo: ", currentWalletInfo);

  // fetcher function for useSwr of useAvailableBalance()
  const fetchTotalDelegations = async (url, address) => {
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
  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: delegationsArray, error } = useSwr(
    address ? ["delegations", address] : null,
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
      refreshInterval: 1000,
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
    let mntlUsdValue;

    // use a try catch block for creating rich Error object
    try {
      // fetch the data from API
      const res = await fetch(mntlUsdApi);
      const resJson = await res?.json?.();
      mntlUsdValue = resJson?.assetmantle?.usd;
    } catch (error) {
      console.error(`swr fetcher : url: ${url},  error: ${error}`);
      throw error;
    }

    // return the data
    return mntlUsdValue;
  };

  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: mntlUsdValue, error } = useSwr("mntlusd", fetchMntlUsd, {
    fallbackData: placeholderMntlUsdValue,
    refreshInterval: 10000,
    suspense: true,
  });

  return {
    mntlUsdValue: mntlUsdValue,
    // isLoadingMntlUsdValue: !error && !mntlUsdValue,
    errorMntlUsdValue: error,
  };
};

export const useAvailableBalance = () => {
  // get the connected wallet parameters from useChain hook
  const walletManager = useChain(defaultChainName);
  const { address } = walletManager;

  // fetcher function for useSwr of useAvailableBalance()
  const fetchAvailableBalance = async (url, address) => {
    // console.log("inside fetchAvailableBalance, url: ", url);
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

  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: balanceObject, error } = useSwr(
    address ? ["balance", address] : null,
    fetchAvailableBalance,
    {
      fallbackData: { amount: placeholderAvailableBalance, denom },
      refreshInterval: 1000,
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
  const fetchAllBalances = async (url, address) => {
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
    fetchAllBalances,
    {
      fallbackData: [placeholderGravityCoin, placeholderGravityIBCCoin],
      refreshInterval: 1000,
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

export const useTotalBalance = () => {
  // fetcher function for useSwr of useAvailableBalance()
  const { availableBalance, errorAvailableBalance, isLoadingAvailableBalance } =
    useAvailableBalance();

  const {
    availableBalanceIBCToken,
    errorAvailableBalanceGravity,
    isLoadingAvailableBalanceGravity,
  } = useAvailableBalanceGravity();

  const {
    totalDelegatedAmount,
    isLoadingDelegatedAmount,
    errorDelegatedAmount,
  } = useDelegatedValidators();

  const { allRewards, errorRewards, isLoadingRewards } = useTotalRewards();

  const { totalUnbondingAmount, isLoadingUnbonding, errorUnbonding } =
    useTotalUnbonding();

  const isLoading =
    isLoadingAvailableBalance ||
    isLoadingAvailableBalanceGravity ||
    isLoadingDelegatedAmount ||
    isLoadingRewards ||
    isLoadingUnbonding;

  const isError =
    errorAvailableBalance ||
    errorAvailableBalanceGravity ||
    errorDelegatedAmount ||
    errorRewards ||
    errorUnbonding;

  const summation =
    isLoading || isError
      ? placeholderAvailableBalance
      : BigNumber(availableBalance || 0)
          .plus(BigNumber(availableBalanceIBCToken || 0))
          .plus(BigNumber(totalDelegatedAmount || 0))
          .plus(BigNumber(allRewards || 0))
          .plus(BigNumber(totalUnbondingAmount || 0))
          .toString();

  return {
    totalBalance: summation,
    denomTotalBalance: defaultChainSymbol,
    isLoadingTotalBalance: isLoading,
    isErrorTotalBalance: isError,
  };
};

//Get a list of all validators that can be delegated
export const useAllValidators = () => {
  const fetchAllValidators = async (url) => {
    let allValidators;

    // use a try catch block for creating rich Error object
    try {
      // get the data from cosmos queryClient
      const { validators } = await client.cosmos.staking.v1beta1.validators({
        status: "",
      });
      allValidators = validators;
    } catch (error) {
      console.error(`swr fetcher : url: ${url},  error: ${error}`);
      throw error;
    }
    // return the data
    return allValidators;
  };
  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: validatorsArray, error } = useSwr(
    "validators",
    fetchAllValidators,
    {
      fallbackData: [
        {
          commission: {},
          consensusPubkey: {},
          delegatorShares: "",
          description: {},
          jailed: "",
          minSelfDelegation: "",
          operatorAddress: placeholderAddress,
          status: "",
          tokens: "",
          unbondingHeight: {},
          unbondingTime: {},
        },
      ],
      suspense: true,
      refreshInterval: 1000,
    }
  );
  return {
    allValidators: validatorsArray,
    isLoadingValidators: !error && !validatorsArray,
    errorValidators: error,
  };
};

export const useVote = (proposalId) => {
  // get the connected wallet parameters from useChain hook
  const walletManager = useChain(defaultChainName);
  const { address } = walletManager;
  // fetcher function for useSwr of useAvailableBalance()
  const fetchVote = async (url, proposalId, address) => {
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
      console.error(`swr fetcher : url: ${url},  error: ${error}`);
    }
    // return the data
    return voteInfo;
  };
  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: voteObject, error } = useSwr(
    proposalId && address ? ["vote", proposalId, address] : null,
    fetchVote,
    {
      fallbackData: {},
      suspense: true,
      refreshInterval: 1000,
    }
  );
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
    fetchAllProposals,
    {
      fallbackData: [
        {
          proposal_id: "",
          content: {},
          status: "",
          deposit_end_time: "",
          final_tally_result: {},
          submit_time: "",
          total_deposit: [],
          voting_end_time: "",
          voting_start_time: "",
        },
      ],
      suspense: true,
      refreshInterval: 1000,
    }
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
  const { data: votesArray, error } = useSwr("useAllVotes", fetchAllVotes, {
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
    refreshInterval: 1000,
  });
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
  const fetchWithdrawAddress = async () => {
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
    address ? ["validators", address] : null,
    fetchWithdrawAddress,
    {
      fallbackData: placeholderAddress,
      suspense: true,
      refreshInterval: 1000,
    }
  );
  return {
    withdrawAddress: withdrawAddress,
    isLoadingWithdrawAddress: !error && !withdrawAddress,
    errorWithdrawAddress: error,
  };
};

export const useTrade = () => {
  // fetcher function for useSwr of useAvailableBalance()
  const fetchAllTrades = async (url) => {
    let tradeData = [];

    try {
      const data = await fetch(
        "https://api.coingecko.com/api/v3/coins/assetmantle?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false"
      ).then((res) => res.json());
      tradeData = data;
    } catch (error) {
      console.error(`swr fetcher : url: ${url},  error: ${error}`);
      throw error;
    }
    // return the data
    // console.log("inside SWR:", tradesArray);
    return tradeData;
  };
  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: tradesArray, error } = useSwr("useAllTrades", fetchAllTrades, {
    fallbackData: [],
    suspense: true,
  });
  // console.log("Outside SWR:", tradesArray);
  return {
    allTrades: tradesArray,
    isLoadingTrades: !error && !tradesArray,
    errorTrades: error,
  };
};

// export const useOsmosis = () => {
//   // fetcher function for useSwr of useAvailableBalance()
//   const fetchAllOsmosis = async (url) => {
//     let osmosisData = [];
//     try {
//       const osmoMntlUsdcData = await fetch(
//         "https://api.osmosis.zone/pools/v2/738"
//       ).then((res) => res.json());
//       const osmoMntlUsdcAprData = await fetch(
//         "https://api.osmosis.zone/apr/v2/738"
//       ).then((res) => res.json());
//       const osmoMntlOsmoData = await fetch(
//         "https://api.osmosis.zone/pools/v2/690"
//       ).then((res) => res.json());
//       const osmoMntlOsmoAprData = await fetch(
//         "https://api.osmosis.zone/apr/v2/690"
//       ).then((res) => res.json());
//       const osmoAtomMntlData = await fetch(
//         "https://api.osmosis.zone/pools/v2/690"
//       ).then((res) => res.json());
//       const osmoAtomMntlAprData = await fetch(
//         "https://api.osmosis.zone/apr/v2/690"
//       ).then((res) => res.json());
//       osmosisData = [
//         {
//           name: "Osmosis",
//           chain: "Cosmos",
//           pair: osmoMntlUsdcData[0]?.symbol + "-" + osmoMntlUsdcData[1]?.symbol,
//           apy: Number(
//             Math.max(
//               osmoMntlUsdcAprData[0]?.apr_list[0]?.apr_1d,
//               osmoMntlUsdcAprData[0]?.apr_list[0]?.apr_7d,
//               osmoMntlUsdcAprData[0]?.apr_list[0]?.apr_14d
//             )
//           ).toFixed(2),
//           tvl: osmoMntlUsdcData[0]?.liquidity,
//         },
//         {
//           name: "Osmosis",
//           chain: "Cosmos",
//           pair: osmoMntlOsmoData[0]?.symbol + "-" + osmoMntlOsmoData[1]?.symbol,
//           apy: Number(
//             Math.max(
//               osmoMntlOsmoAprData[0]?.apr_list[0]?.apr_1d,
//               osmoMntlOsmoAprData[0]?.apr_list[0]?.apr_7d,
//               osmoMntlOsmoAprData[0]?.apr_list[0]?.apr_14d
//             )
//           ).toFixed(2),
//           tvl: osmoMntlOsmoData[0]?.liquidity,
//         },
//         {
//           name: "Osmosis",
//           chain: "Cosmos",
//           pair: osmoAtomMntlData[0]?.symbol + "-" + osmoAtomMntlData[1]?.symbol,
//           apy: Number(
//             Math.max(
//               osmoAtomMntlAprData[0]?.apr_list[0]?.apr_1d,
//               osmoAtomMntlAprData[0]?.apr_list[0]?.apr_7d,
//               osmoAtomMntlAprData[0]?.apr_list[0]?.apr_14d
//             )
//           ).toFixed(2),
//           tvl: osmoAtomMntlData[0]?.liquidity,
//         },
//       ];
//     } catch (error) {
//       console.error(`swr fetcher : url: ${url},  error: ${error}`);
//       throw error;
//     }
//     // return the data
//     return osmosisData;
//   };
//   // implement useSwr for cached and revalidation enabled data retrieval
//   const { data: osmosisArray, error } = useSwr("useEarn", fetchAllOsmosis, {
//     suspense: true,
//   });
//   return {
//     allOsmosis: osmosisArray,
//     isLoadingOsmosis: !error && !osmosisArray,
//     errorOsmosis: error,
//   };
// };

export const useQuickswap = () => {
  // fetcher function for useSwr of useAvailableBalance()
  const fetchAllQuickswap = async (url) => {
    let quickswapData = [];
    try {
      const llamaData = await fetch("https://yields.llama.fi/pools").then(
        (res) => res.json()
      );
      const filteredLlamaData = llamaData?.data?.filter(
        (item) =>
          item?.symbol.includes("MNTL") &&
          (item?.project == "quickswap-dex" || item?.project == "uniswap-v3")
      );
      quickswapData = filteredLlamaData;
    } catch (error) {
      console.error(`swr fetcher : url: ${url},  error: ${error}`);
      throw error;
    }
    // return the data
    return quickswapData;
  };
  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: quickswapArray, error } = useSwr("useEarn", fetchAllQuickswap, {
    fallbackData: [],
    suspense: true,
  });
  return {
    allQuickswap: quickswapArray,
    isLoadingQuickswap: !error && !quickswapArray,
    errorQuickswap: error,
  };
};
