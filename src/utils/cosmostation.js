// import { stringToNumber } from "./scripts";
// import { DefaultChainInfo } from "../config";
import { cosmos } from "@cosmostation/extension-client";
const chainID = process.env.REACT_APP_CHAIN_ID;
// const restAPI = process.env.REACT_APP_API_KEY;
// const tendermintRPC = process.env.REACT_APP_TENDERMINT_RPC_ENDPOINT;
// const chainName = process.env.REACT_APP_CHAIN_NAME;
// const websiteURL = process.env.REACT_APP_WEBSITE_URL;
// const coinName = DefaultChainInfo.currency.coinDenom;
// const coinDenom = DefaultChainInfo.currency.coinMinimalDenom;
// const prefix = DefaultChainInfo.prefix;

async function CosmostationWallet() {
    //  Cosmostation extension injects the offline signer that is compatible with cosmJS.
    // You can get this offline signer from `window.getOfflineSigner(chainId:string)` after load event.
    // And it also injects the helper function to `window.cosmostation`.
    // If `window.getOfflineSigner` or `window.cosmostation` is null,  Cosmostation extension may be not installed on browser.
    if (!window.getOfflineSigner || !window.cosmostation) {
        throw new Error("install cosmostation extension");
    } else {
        const provider = await cosmos();
        const account = await provider.requestAccount(chainID);
        localStorage.setItem("cosmostationAddress", account.address);
    }
}

export default CosmostationWallet;
