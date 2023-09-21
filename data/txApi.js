import BigNumber from "bignumber.js";
import { assets } from "chain-registry";
import { cosmos } from "osmojs";
import {
  defaultChainDenom,
  defaultChainName,
  defaultChainRPCProxy,
  defaultFeeAmount,
  defaultFeeGas,
  defaultIBCSourceChannel,
  defaultIBCSourcePort,
  gravityBasisPoints,
  gravityBasisPointsScalingExponent,
  gravityChainDenom,
  gravityChainId,
  gravityChainName,
  gravityChainRPCProxy,
  gravityFeeAmount,
  gravityIBCSourceChannel,
  gravityIBCSourcePort,
  gravityIBCToken,
  premiumFeeGas,
  ultraPremiumGas,
} from "../config";
import { toChainDenom, toDenom } from "../data";
import {
  getSigningCosmosClient,
  getSigningGravityClient,
  gravity,
} from "../modules";

// get the wallet properties and functions for that specific chain
export const sendTokensTxn = async (
  fromAddress,
  toAddress,
  amount,
  memo = "",
  compositeWallet,
  {
    getOfflineSigner,
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

    // initialize stargate client using signer and create txn
    let signer = compositeWallet?.signer;
    const stargateClient = await getSigningCosmosClient({
      rpcEndpoint: defaultChainRPCProxy,
      signer: signer,
    });

    if (!stargateClient || !fromAddress) {
      throw new Error("stargateClient or from address undefined");
    }

    // create a message template from the composer
    const { send } = cosmos.bank.v1beta1.MessageComposer.withTypeUrl;
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
          amount: defaultFeeAmount,
        },
      ],
      gas: defaultFeeGas,
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
      throw new Error("stargateClient or from address undefined");
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
          amount: defaultFeeAmount,
        },
      ],
      gas: premiumFeeGas,
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
      throw new Error("stargateClient or from address undefined");
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
          amount: defaultFeeAmount,
        },
      ],
      gas: defaultFeeGas,
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
      throw new Error("stargateClient or from address undefined");
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
          amount: defaultFeeAmount,
        },
      ],
      gas: defaultFeeGas,
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
    // // populate the optional argument fromAddress
    const fromAddress = voter;
    // // initialize stargate client and create txn
    const stargateClient = await getSigningStargateClient();
    if (!stargateClient || !fromAddress) {
      throw new Error("stargateClient or from address undefined");
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
          amount: defaultFeeAmount,
        },
      ],
      gas: defaultFeeGas,
    };
    // use the stargate client to dispatch the transaction
    const response = await stargateClient.signAndBroadcast(
      voter,
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
      throw new Error("stargateClient or from address undefined");
    }

    // create a message template from the composer
    const { setWithdrawAddress } =
      cosmos.distribution.v1beta1.MessageComposer.withTypeUrl;

    const msg = setWithdrawAddress({
      delegatorAddress: address,
      withdrawAddress,
    });
    // populate the fee data
    const fee = {
      amount: [
        {
          denom: "umntl",
          amount: defaultFeeAmount,
        },
      ],
      gas: defaultFeeGas,
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
    // get the amount in denom terms
    // populate the optional argument fromAddress
    const fromAddress = address;
    console.log(address, withdrawAddress);
    // initialize stargate client and create txn
    const stargateClient = await getSigningStargateClient();
    if (!stargateClient || !fromAddress) {
      throw new Error("stargateClient or from address undefined");
    }

    // create a message template from the composer
    const { withdrawDelegatorReward } =
      cosmos.distribution.v1beta1.MessageComposer.withTypeUrl;

    const msgArray = validatorAddresses.map((validatorAddress) =>
      withdrawDelegatorReward({
        delegatorAddress: fromAddress,
        validatorAddress,
      })
    );
    let gasResponse;
    try {
      // get gas fees using simulate
      gasResponse = await stargateClient.simulate(fromAddress, msgArray, memo);
      gasResponse = BigNumber(gasResponse).isNaN()
        ? ultraPremiumGas
        : gasResponse;
    } catch (error) {
      console.error("Error during Simulate: ", error?.message);
      gasResponse = ultraPremiumGas;
    }

    // populate the fee data
    const fee = {
      amount: [
        {
          denom: "umntl",
          amount: defaultFeeAmount,
        },
      ],
      gas: BigNumber(gasResponse).plus(BigNumber(100000)).toString(),
    };

    // use the stargate client to dispatch the transaction
    response = await stargateClient.signAndBroadcast(
      fromAddress,
      msgArray,
      fee,
      memo
    );

    console.log("msgArray: ", msgArray);
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
    // get the coin data
    const denomOfAmount = defaultChainDenom;
    // get the amount in denom terms
    const amountInDenom = toChainDenom(amount, chainName, chainDenom);
    // initialize stargate client and create txn
    const stargateClient = await getSigningStargateClient();
    if (!stargateClient || !fromAddress) {
      throw new Error("stargateClient or from address undefined");
    }

    // get the sourcePort and sourceChannel values pertaining to IBC transaction from AssetMantle to Gravity Chain
    const sourcePort = defaultIBCSourcePort;
    const sourceChannel = defaultIBCSourceChannel;

    // get the amount object
    const transferAmount = {
      denom: denomOfAmount,
      amount: amountInDenom,
    };

    // populate the fee data
    const fee = {
      amount: [
        {
          denom: defaultChainDenom,
          amount: defaultFeeAmount,
        },
      ],
      gas: defaultFeeGas,
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

// GRAVITY CHAIN

export const sendIbcTokenToMantle = async (
  fromGravityAddress,
  toMantleAddress,
  amount,
  memo,
  {
    getOfflineSigner,
    chainName = defaultChainName,
    chainDenom = defaultChainDenom,
  }
) => {
  let response = null;

  try {
    console.log(
      "inside sendIbcTokenToMantle: ",
      fromGravityAddress,
      toMantleAddress,
      amount
    );
    // get the coin data
    const denomOfAmount = gravityIBCToken;
    // get the amount in denom terms
    const amountInDenom = toChainDenom(
      amount,
      gravityChainName,
      gravityChainDenom
    );

    // get the sourcePort and sourceChannel values pertaining to IBC transaction from AssetMantle to Gravity Chain
    const sourcePort = gravityIBCSourcePort;
    const sourceChannel = gravityIBCSourceChannel;

    // get the amount object
    const transferAmount = {
      denom: denomOfAmount,
      amount: amountInDenom,
    };

    // populate the fee data
    const fee = {
      amount: [
        {
          denom: gravityChainDenom,
          amount: gravityFeeAmount,
        },
      ],
      gas: defaultFeeGas,
    };

    // initialize signing client
    // const stargateClient = await getSigningStargateClient();

    // initialize stargate client using signer and create txn
    let signer = await getOfflineSigner(gravityChainId);
    const stargateClient = await getSigningGravityClient({
      rpcEndpoint: gravityChainRPCProxy,
      signer: signer,
    });

    if (!stargateClient || !fromGravityAddress) {
      throw new Error("stargateClient or from address undefined");
    }

    // directly call sendIbcTokens from the stargateclient
    response = await stargateClient.sendIbcTokens(
      fromGravityAddress,
      toMantleAddress,
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
  bridgeFeeAmount,
  memo,
  {
    getOfflineSigner,
    chainName = defaultChainName,
    chainDenom = defaultChainDenom,
  }
) => {
  console.log(
    "inside sendIcTokenToEth senderAdress: ",
    senderAddress,
    " ethDestAddress: ",
    ethDestAddress,
    " amount: ",
    amount,
    " bridgeFeeAmount: ",
    bridgeFeeAmount
  );
  try {
    // keep the values to defaultChain and defaultDenom since we are dealing with ibc tokens of default chain
    const amountInDenom = toChainDenom(amount, chainName, chainDenom);

    // quick validation of amount being empty (not really required here, must go in form validation)
    if (!BigNumber(amountInDenom).isGreaterThan(0)) {
      return {
        response: null,
        error: new Error("Amount set is invalid"),
      };
    }

    // get the amount object of type Coin
    const transferAmount = {
      denom: gravityIBCToken,
      amount: amountInDenom,
    };

    const chainFeeAmountInDenom = BigNumber(amountInDenom.toString())
      .multipliedBy(
        BigNumber(gravityBasisPoints).shiftedBy(
          gravityBasisPointsScalingExponent
        )
      )
      .integerValue(BigNumber.ROUND_CEIL)
      .toString();

    const bridgeFeeInDenom = toDenom(bridgeFeeAmount);

    // populate the chainFee data which will also be in MNTL
    const chainFee = {
      denom: gravityIBCToken,
      amount: chainFeeAmountInDenom,
    };

    // populate the bridgeFee data, which will be in MNTL
    const bridgeFee = {
      denom: gravityIBCToken,
      amount: bridgeFeeInDenom,
    };

    const { sendToEth } = gravity.v1.MessageComposer.withTypeUrl;
    const msg = sendToEth({
      ethDest: ethDestAddress,
      sender: senderAddress,
      amount: transferAmount,
      bridgeFee,
      chainFee,
    });

    console.log("msg: ", msg);

    // populate the fee data
    const fee = {
      amount: [
        {
          denom: gravityChainDenom,
          amount: "2000",
        },
      ],
      gas: "250000",
    };

    // initialize stargate client using signer and create txn
    let signer = await getOfflineSigner(gravityChainId);
    const stargateClient = await getSigningGravityClient({
      rpcEndpoint: gravityChainRPCProxy,
      signer: signer,
    });

    /* // initialize stargate client using getter
    const stargateClient = await getSigningStargateClient(); */

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
