import { keplrExtensionInfo, KeplrExtensionWallet } from "@cosmos-kit/keplr";

const keplrExtension = new KeplrExtensionWallet(keplrExtensionInfo);
export const wallets = [keplrExtension];
