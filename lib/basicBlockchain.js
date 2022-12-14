import { bech32AddressSeperator, shortenAddressSize } from "../data";

export const shortenAddress = (address) => {
  let splitArrays = address.toString().trim().split(bech32AddressSeperator);
  let hrp = splitArrays[0] + bech32AddressSeperator;
  let middleSection =
    splitArrays?.[1]?.length >= shortenAddressSize * 2
      ? splitArrays?.[1]?.substr(0, shortenAddressSize)
      : "";
  let endSection =
    splitArrays?.[1]?.length >= shortenAddressSize
      ? splitArrays?.[1]?.substr(0 - shortenAddressSize)
      : splitArrays?.[1];
  console.log({ hrp, middleSection, endSection });
  return hrp + middleSection + "..." + endSection;
};
