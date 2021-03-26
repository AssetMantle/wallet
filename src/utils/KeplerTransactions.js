const {SigningCosmosClient} = require("@cosmjs/launchpad");

async function KeplerTransaction(msgs, fee, memo) {
    const chainId = "test-core-1";
    await window.keplr.enable(chainId);
    const offlineSigner = window.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts();
    console.log(accounts[0].address, "result")
    const cosmJS = new SigningCosmosClient(
        "http://128.199.29.15:1317",
        accounts[0].address,
        offlineSigner
    );
    await cosmJS.signAndBroadcast(msgs, fee, memo)
}

export default KeplerTransaction;
