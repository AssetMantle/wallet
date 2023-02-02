import BigNumber from "bignumber.js";
import { assets } from "chain-registry";
import { cosmos } from "osmojs";
import {
  defaultChainDenom,
  defaultChainName,
  gravityBasisPoints,
  gravityBasisPointsScalingExponent,
  gravityChainDenom,
  gravityChainRPCProxy,
  gravityIBCToken,
} from "../config";
import { toChainDenom } from "../data";
import { getSigningGravityClient } from "../modules";

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
    // initialize stargate client and create txn
    const stargateClient = await getSigningStargateClient();
    if (!stargateClient || !fromAddress) {
      throw new error("stargateClient or from address undefined");
    }
    // create a message template from the composer
    const { send } = cosmos.bank.v1beta1.MessageComposer.withTypeUrl;
    // populate the message with transaction arguments
    const msg = send({
      fromAddress,
      toAddress,
      amount: [
        {
          denom: coin.base,
          amount: amountInDenom,
        },
      ],
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
    console.log(amountInDenom);
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
      amount: {
        denom: coin.base,
        amount: amountInDenom,
      },
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
      amount: {
        denom: coin.base,
        amount: amountInDenom,
      },
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
      amount: {
        denom: coin.base,
        amount: amountInDenom,
      },
    });
    console.log("msg: ", msg, " amount: ", amountInDenom);

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

export const sendWithdrawAddress = async (
  address,
  withdrawAddress,
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
    // // initialize stargate client and create txn
    const stargateClient = await getSigningStargateClient();
    if (!stargateClient || !address) {
      throw new error("stargateClient or from address undefined");
    }

    // create a message template from the composer
    const { setWithdrawAddress } =
      cosmos.distribution.v1beta1.MessageComposer.withTypeUrl;

    const msg = setWithdrawAddress({
      delegatorAddress: address,
      withdrawAddress,
    });
    console.log(msg);
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
      address,
      [msg],
      fee,
      memo
    );
    console.log("msg: ", msg);
    return { response, error: null };
  } catch (error) {
    console.error("Error during transaction: ", error?.message);
    return { response: null, error };
  }
};

export const sendRewardsBatched = async (
  address,
  withdrawAddress,
  validatorAddresses,
  memo,
  {
    getSigningStargateClient,
    chainName = defaultChainName,
    chainDenom = defaultChainDenom,
  }
) => {
  let response = null;
  try {
    // get the chain assets for the specified chain
    const chainassets = assets.find((chain) => chain.chain_name === chainName);
    // get the coin data from the chain assets data
    const coin = chainassets.assets.find((asset) => asset.base === chainDenom);
    // get the amount in denom terms
    // const amountInDenom = toChainDenom(amount, chainName, chainDenom);
    // populate the optional argument fromAddress
    const fromAddress = address;
    // initialize stargate client and create txn
    const stargateClient = await getSigningStargateClient();

    if (!stargateClient || !fromAddress) {
      throw new error("stargateClient or from address undefined");
    }

    // create a message template from the composer
    const { withdrawDelegatorReward } =
      cosmos.distribution.v1beta1.MessageComposer.withTypeUrl;

    const msgArray = validatorAddresses.map((validatorAddress) =>
      withdrawDelegatorReward({
        delegatorAddress: withdrawAddress,
        validatorAddress,
      })
    );

    // populate the fee data
    const fee = {
      amount: [
        {
          denom: "umntl",
          amount: "2000",
        },
      ],
      gas: "863640",
    };

    // use the stargate client to dispatch the transaction
    response = await stargateClient.signAndBroadcast(
      fromAddress,
      msgArray,
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

export const sendIbcTokenToGravity = async (
  fromAddress,
  toGravityAddress,
  amount,
  memo,
  {
    getSigningStargateClient,
    chainName = defaultChainName,
    chainDenom = defaultChainDenom,
  }
) => {
  let response = null;
  try {
    console.log(fromAddress, toGravityAddress, amount);
    // get the chain assets for the specified chain
    const chainassets = assets.find((chain) => chain.chain_name === chainName);
    // get the coin data from the chain assets data
    const coin = chainassets.assets.find((asset) => asset.base === chainDenom);
    // get the amount in denom terms
    const amountInDenom = toChainDenom(amount, chainName, chainDenom);
    // initialize stargate client and create txn
    const stargateClient = await getSigningStargateClient();
    if (!stargateClient || !fromAddress) {
      throw new error("stargateClient or from address undefined");
    }

    // get the sourcePort and sourceChannel values pertaining to IBC transaction from AssetMantle to Gravity Chain
    const sourcePort = "transfer";
    const sourceChannel = "channel-8";

    // get the amount object
    const transferAmount = {
      denom: coin.base,
      amount: amountInDenom,
    };

    // populate the fee data
    const fee = {
      amount: [
        {
          denom: "umntl",
          amount: "2000",
        },
      ],
      gas: "100000",
    };

    // directly call sendIbcTokens from the stargateclient
    response = await stargateClient.sendIbcTokens(
      fromAddress,
      toGravityAddress,
      transferAmount,
      sourcePort,
      sourceChannel,
      undefined,
      1773583353,
      fee,
      memo
    );

    return { response, error: null };
  } catch (error) {
    console.error("Error during transaction: ", error?.message);
    return { response: null, error };
  }
};

export const sendIbcTokenToEth = async (
  senderAddress,
  ethDestAddress,
  amount,
  memo,
  {
    getOfflineSigner,
    chainName = defaultChainName,
    chainDenom = defaultChainDenom,
  }
) => {
  try {
    // keep the values to defaultChain and defaultDenom since we are dealing with ibc tokens of default chain
    const amountInDenom = toChainDenom(amount, chainName, chainDenom);

    // get the amount object of type Coin
    const transferAmount = {
      denom: gravityIBCToken,
      amount: amountInDenom,
    };

    // quick validation of amount being empty (not really required here, must go in form validation)
    if (!BigNumber(amountInDenom).isGreaterThan(0)) {
      return {
        response: null,
        error: new Error("Amount set is invalid"),
      };
    }

    const chainFeeAmountInDenom = BigNumber(amountInDenom.toString())
      .multipliedBy(
        BigNumber(gravityBasisPoints).multipliedBy(
          BigNumber(10).exponentiatedBy(gravityBasisPointsScalingExponent)
        )
      )
      .integerValue(BigNumber.ROUND_CEIL)
      .toString();

    // populate the chainFee data which will also be in MNTL
    const chainFee = {
      denom: defaultChainDenom,
      amount: chainFeeAmountInDenom,
    };

    // populate the bridgeFee data, which will be in MNTL
    const bridgeFee = {
      denom: defaultChainDenom,
      amount: "20000",
    };

    let signer = getOfflineSigner();

    // initialize stargate client and create txn
    const client = await getSigningGravityClient({
      rpcEndpoint: gravityChainRPCProxy,
      signer: signer,
    });

    console.log("isGravitychainID: ", stargateClient.registry);

    // get the msg object
    const msg = {
      typeUrl: "/gravity.v1.MsgSendToEth",
      value: {
        sender: senderAddress,
        ethDest: ethDestAddress,
        amount: transferAmount,
        bridgeFee,
        chainFee,
      },
    };

    console.log("msg: ", msg);

    // populate the fee data
    const fee = {
      amount: [
        {
          denom: gravityChainDenom,
          amount: "2000",
        },
      ],
      gas: "86364",
    };

    // use the stargate client to dispatch the transaction
    const response = await stargateClient.signAndBroadcast(
      senderAddress,
      [msg],
      fee,
      memo
    );
    return { response, error: null };
  } catch (error) {
    console.error("Error during transaction: ", error?.message);
    return { response: null, error };
  }
};
