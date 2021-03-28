const {SigningStargateClient} = require("@cosmjs/stargate");

//TODO take from config and env
async function KeplerTransaction(msgs, fee, memo) {
    console.log(msgs, "delegate")
    const chainId = "test-core-1";
    await window.keplr.enable(chainId);
    const offlineSigner = window.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts();
    console.log(accounts[0].address, "result")
    const cosmJS = await SigningStargateClient.connectWithSigner(
        "http://128.199.29.15:26657",
        accounts[0].address,
        offlineSigner
    );
    await cosmJS.signAndBroadcast(accounts[0].address,msgs, fee, memo)
}

export default KeplerTransaction;
