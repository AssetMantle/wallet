const { pos } = require("../../config");
const { getPOSClient } = require("../../utils_pos");

const execute = async (depositAmount, fromAddress) => {
  const client = await getPOSClientMainnet();
  const erc20Token = client.erc20(pos.parent.erc20, true);

  const result = await erc20Token.deposit(depositAmount, fromAddress, {
    fromAddress,
    gasLimit: 300000,
    gasPrice: 50000000000,
    // maxPriorityFeePerGas: 6000000000,
  });

  const txHash = await result.getTransactionHash();
  console.log("txHash", txHash);
  const receipt = await result.getReceipt();
  console.log("receipt", receipt);
};
