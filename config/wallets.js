import { keplrExtensionInfo, KeplrExtensionWallet } from "@cosmos-kit/keplr";
import {
  cosmostationExtensionInfo,
  CosmostationExtensionWallet,
} from "@cosmos-kit/cosmostation";

const keplrExtension = new KeplrExtensionWallet(keplrExtensionInfo);
export const keplrWallets = [keplrExtension];

const cosmostationExtenstion = new CosmostationExtensionWallet(
  cosmostationExtensionInfo
);
export const cosmostationWallets = [cosmostationExtenstion];
