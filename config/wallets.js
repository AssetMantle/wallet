import { wallets } from "@cosmos-kit/keplr";

console.log("wallets; ", wallets);
// const keplrExtension = new KeplrExtensionWallet(keplrExtensionInfo);
let kwallet = [];
kwallet.push(wallets[0]);
export const keplrWallets = kwallet;

// const cosmostationExtenstion = new CosmostationExtensionWallet(
//   cosmostationExtensionInfo
// );
// export const cosmostationWallets = [cosmostationExtenstion];
