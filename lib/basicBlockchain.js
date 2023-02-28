import { fromBech32, toBech32 } from "@cosmjs/encoding";
import { chains } from "chain-registry";
import { ethers } from "ethers";
import { defaultChainName } from "../config";
import {
  bech32AddressSeperator,
  getPlaceholderAddress,
  placeholderAddress,
  shortenAddressSize,
} from "../data";

const abiEncoder = ethers.utils.defaultAbiCoder;

export const shortenAddress = (address, chainName = defaultChainName) => {
  if (address && address != placeholderAddress) {
    let splitArrays = address?.toString().trim().split(bech32AddressSeperator);
    let hrp = splitArrays?.[0];
    let frontSection = hrp + bech32AddressSeperator;
    let middleSection =
      splitArrays?.[1]?.length >= shortenAddressSize * 2
        ? splitArrays?.[1]?.substr(0, shortenAddressSize)
        : "";
    let endSection =
      splitArrays?.[1]?.length >= shortenAddressSize
        ? splitArrays?.[1]?.substr(0 - shortenAddressSize)
        : splitArrays?.[1];
    return frontSection + middleSection + "..." + endSection;
  }
  // get the hrp of the chain
  const hrpValue = chains.find(
    (_chain) => _chain?.chain_name === chainName
  )?.bech32_prefix;
  return getPlaceholderAddress(hrpValue);
};

export const shortenEthAddress = (address) => {
  if (address) {
    let frontSection =
      address.length >= shortenAddressSize * 2
        ? address.substr(0, shortenAddressSize)
        : address;
    let endSection =
      address.length >= shortenAddressSize
        ? address.substr(0 - shortenAddressSize)
        : "";

    return address.length >= shortenAddressSize * 2
      ? frontSection + "..." + endSection
      : frontSection;
  } else return "0x0000...0000";
};

export const convertBech32Address = (address, chainName = defaultChainName) => {
  if (address) {
    try {
      // convert address to hex
      const { data } = fromBech32(address);

      // get the hrp of the chain
      const hrpValue = chains.find(
        (_chain) => _chain?.chain_name === chainName
      )?.bech32_prefix;

      // convert hex address to chain address
      const destinationChainAddress = toBech32(hrpValue, data);
      return destinationChainAddress;
    } catch (error) {
      console.error("Error in lib function: ", error);
      throw error;
    }
  }
  return address;
};

export const getIncentiveKeyEncoded = (incentiveKey) => {
  if (incentiveKey) {
    return abiEncoder.encode(
      ["tuple(address,address,uint256,uint256,address)"],
      [incentiveKey]
    );
  }
  return "0x";
};

export const getIncentiveIdFromKey = (incentiveKey) => {
  if (incentiveKey?.length) {
    return ethers.utils.keccak256(getIncentiveKeyEncoded(incentiveKey));
  }
  return null;
};
