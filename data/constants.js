export const formConstants = {
  recipientAddressErrorMsg: "Invalid Address",
  transferAmountErrorMsg: "Insufficient Balance",
  requiredErrorMsg: "Required field is blank",
  invalidValueErrorMsg: "Input value is invalid",
};

export const placeholderAddress = "mantle1000000...000000";
export const placeholderAddressEth =
  "0x0000000000000000000000000000000000000000";

export const getPlaceholderAddress = (hrpValue) =>
  `${hrpValue}1000000...000000`;

export const bech32AddressSeperator = "1";
export const shortenAddressSize = 6;
export const shortenAddressSizeEth = 4;
