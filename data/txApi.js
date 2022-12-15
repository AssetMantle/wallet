import { assets } from "chain-registry";
import { get } from "https";
import { defaultChainDenom, defaultChainName } from "../config";
import { cosmos } from "../modules";
import { toChainDenom } from "./swrStore";

// get the wallet properties and functions for that specific chain
export const sendTokensTxn = async (
  fromAddress,
  toAddress,
  amount,
  memo = "",
  {
    getSigningStargateClient,
    chainName = defaultChainName,
    chainDenom = defaultChainDenom,
  }
) => {
  try {
    // get the chain assets for the specified chain
    const chainassets = assets.find((chain) => chain.chain_name === chainName);
    // get the coin data from the chain assets data
    const coin = chainassets.assets.find((asset) => asset.base === chainDenom);
    // get the amount in denom terms
    const amountInDenom = toChainDenom(amount, chainName, chainDenom);
    // populate the optional argument fromAddress
    fromAddress = fromAddress || address;
    // initialize stargate client and create txn
    const stargateClient = await getSigningStargateClient();
    if (!stargateClient || !fromAddress) {
      throw new error("stargateClient or from address undefined");
    }
    // create a message template from the composer
    const { send } = cosmos.bank.v1beta1.MessageComposer.withTypeUrl;
    // populate the message with transaction arguments
    const msg = send({
      amount: [
        {
          denom: coin.base,
          amount: amountInDenom,
        },
      ],
      toAddress,
      fromAddress,
    });
    // populate the fee data
    const fee = {
      amount: [
        {
          denom: coin.base,
          amount: "2000",
        },
      ],
      gas: "86364",
    };
    // use the stargate client to dispatch the transaction
    const response = await stargateClient.signAndBroadcast(
      fromAddress,
      [msg],
      fee,
      memo
    );
    console.log("msg: ", msg, " amount: ", amountInDenom);
    return { response, error: null };
  } catch (error) {
    console.error("Error during transaction: ", error?.message);
    return { response: null, error };
  }
};

export const sendRedelegation = async (
  delegatorAddress,
  validatorSrcAddress,
  validatorDstAddress,
  amount,
  memo,
  {
    getSigningStargateClient,
    chainName = defaultChainName,
    chainDenom = defaultChainDenom,
  }
) => {
  console.log(getSigningStargateClient);
  try {
    // get the chain assets for the specified chain
    const chainassets = assets.find((chain) => chain.chain_name === chainName);
    // get the coin data from the chain assets data
    const coin = chainassets.assets.find((asset) => asset.base === chainDenom);
    // get the amount in denom terms
    const amountInDenom = toChainDenom(amount, chainName, chainDenom);
    // // populate the optional argument fromAddress
    const fromAddress = delegatorAddress;
    // // initialize stargate client and create txn
    const stargateClient = await getSigningStargateClient();
    console.log(stargateClient);
    if (!stargateClient || !fromAddress) {
      throw new error("stargateClient or from address undefined");
    }

    // create a message template from the composer
    const { beginRedelegate } =
      cosmos.staking.v1beta1.MessageComposer.withTypeUrl;

    const msg = beginRedelegate({
      delegatorAddress,
      validatorDstAddress,
      validatorSrcAddress,
      amount,
    });
    // populate the fee data
    const fee = {
      amount: [
        {
          denom: "umntl",
          amount: "2000",
        },
      ],
      gas: "86364",
    };
    // use the stargate client to dispatch the transaction
    const response = await stargateClient.signAndBroadcast(
      delegatorAddress,
      [msg],
      fee,
      memo
    );
    console.log("msg: ", msg, " amount: ", amountInDenom);
    return { response, error: null };
  } catch (error) {
    console.error("Error during transaction: ", error?.message);
    return { response: null, error };
  }
};

export const sendDelegation = async (
  delegatorAddress,
  validatorAddress,
  amount,
  memo,
  {
    getSigningStargateClient,
    chainName = defaultChainName,
    chainDenom = defaultChainDenom,
  }
) => {
  try {
    // get the chain assets for the specified chain
    const chainassets = assets.find((chain) => chain.chain_name === chainName);
    // get the coin data from the chain assets data
    const coin = chainassets.assets.find((asset) => asset.base === chainDenom);
    // get the amount in denom terms
    const amountInDenom = toChainDenom(amount, chainName, chainDenom);
    // // populate the optional argument fromAddress
    const fromAddress = delegatorAddress;
    // // initialize stargate client and create txn
    const stargateClient = await getSigningStargateClient();
    if (!stargateClient || !fromAddress) {
      throw new error("stargateClient or from address undefined");
    }

    // create a message template from the composer
    const { delegate } = cosmos.staking.v1beta1.MessageComposer.withTypeUrl;

    const msg = delegate({
      delegatorAddress,
      validatorAddress,
      amount,
    });
    // populate the fee data
    const fee = {
      amount: [
        {
          denom: "umntl",
          amount: "2000",
        },
      ],
      gas: "86364",
    };
    // use the stargate client to dispatch the transaction
    const response = await stargateClient.signAndBroadcast(
      delegatorAddress,
      [msg],
      fee,
      memo
    );
    console.log("msg: ", msg, " amount: ", amountInDenom);
    return { response, error: null };
  } catch (error) {
    console.error("Error during transaction: ", error?.message);
    return { response: null, error };
  }
};

export const sendUndelegation = async (
  delegatorAddress,
  validatorAddress,
  amount,
  memo,
  {
    getSigningStargateClient,
    chainName = defaultChainName,
    chainDenom = defaultChainDenom,
  }
) => {
  try {
    // get the chain assets for the specified chain
    const chainassets = assets.find((chain) => chain.chain_name === chainName);
    // get the coin data from the chain assets data
    const coin = chainassets.assets.find((asset) => asset.base === chainDenom);
    // get the amount in denom terms
    const amountInDenom = toChainDenom(amount, chainName, chainDenom);
    // // populate the optional argument fromAddress
    const fromAddress = delegatorAddress;
    // // initialize stargate client and create txn
    const stargateClient = await getSigningStargateClient();
    if (!stargateClient || !fromAddress) {
      throw new error("stargateClient or from address undefined");
    }

    // create a message template from the composer
    const { undelegate } = cosmos.staking.v1beta1.MessageComposer.withTypeUrl;

    const msg = undelegate({
      delegatorAddress,
      validatorAddress,
      amount,
    });
    // populate the fee data
    const fee = {
      amount: [
        {
          denom: "umntl",
          amount: "2000",
        },
      ],
      gas: "86364",
    };
    // use the stargate client to dispatch the transaction
    const response = await stargateClient.signAndBroadcast(
      delegatorAddress,
      [msg],
      fee,
      memo
    );
    console.log("msg: ", msg, " amount: ", amountInDenom);
    return { response, error: null };
  } catch (error) {
    console.error("Error during transaction: ", error?.message);
    return { response: null, error };
  }
};

export const sendRewards = async (
  delegatorAddress,
  validatorAddress,
  memo,
  {
    getSigningStargateClient,
    chainName = defaultChainName,
    chainDenom = defaultChainDenom,
  }
) => {
  try {
    // get the chain assets for the specified chain
    const chainassets = assets.find((chain) => chain.chain_name === chainName);
    // get the coin data from the chain assets data
    const coin = chainassets.assets.find((asset) => asset.base === chainDenom);
    // // get the amount in denom terms
    // const amountInDenom = toChainDenom(amount, chainName, chainDenom);
    // // populate the optional argument fromAddress
    const fromAddress = delegatorAddress;
    // // initialize stargate client and create txn
    const stargateClient = await getSigningStargateClient();
    if (!stargateClient || !fromAddress) {
      throw new error("stargateClient or from address undefined");
    }

    // create a message template from the composer
    const { withdrawDelegatorReward } =
      cosmos.distribution.v1beta1.MessageComposer.withTypeUrl;

    const msg = withdrawDelegatorReward({
      delegatorAddress,
      validatorAddress,
    });
    // populate the fee data
    const fee = {
      amount: [
        {
          denom: "umntl",
          amount: "2000",
        },
      ],
      gas: "86364",
    };
    // use the stargate client to dispatch the transaction
    const response = await stargateClient.signAndBroadcast(
      delegatorAddress,
      [msg],
      fee,
      memo
    );
    console.log("msg: ", msg, " amount: ", amountInDenom);
    return { response, error: null };
  } catch (error) {
    console.error("Error during transaction: ", error?.message);
    return { response: null, error };
  }
};

export const sendVote = async (
  proposalId,
  voter,
  option,
  memo,
  {
    getSigningStargateClient,
    chainName = defaultChainName,
    chainDenom = defaultChainDenom,
  }
) => {
  try {
    // get the chain assets for the specified chain
    const chainassets = assets.find((chain) => chain.chain_name === chainName);
    // get the coin data from the chain assets data
    const coin = chainassets.assets.find((asset) => asset.base === chainDenom);
    // // get the amount in denom terms
    // const amountInDenom = toChainDenom(amount, chainName, chainDenom);
    // // populate the optional argument fromAddress
    const fromAddress = voter;
    // // initialize stargate client and create txn
    const stargateClient = await getSigningStargateClient();
    if (!stargateClient || !fromAddress) {
      throw new error("stargateClient or from address undefined");
    }

    // create a message template from the composer
    const { vote } = cosmos.gov.v1beta1.MessageComposer.withTypeUrl;

    const msg = vote({
      proposalId,
      voter,
      option,
    });
    // populate the fee data
    const fee = {
      amount: [
        {
          denom: "umntl",
          amount: "2000",
        },
      ],
      gas: "86364",
    };
    // use the stargate client to dispatch the transaction
    const response = await stargateClient.signAndBroadcast(
      voter,
      [msg],
      fee,
      memo
    );
    console.log("msg: ", msg, " amount: ", amountInDenom);
    return { response, error: null };
  } catch (error) {
    console.error("Error during transaction: ", error?.message);
    return { response: null, error };
  }
};
