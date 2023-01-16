export const formConstants = {
  recipientAddressErrorMsg: "Invalid Address",
  transferAmountErrorMsg: "Insufficient Balance",
  requiredErrorMsg: "Required field is blank",
};

export const placeholderAddress = "mantle1000000...000000";

export const getPlaceholderAddress = (hrpValue) =>
  `${hrpValue}1000000...000000`;

export const bech32AddressSeperator = "1";
export const shortenAddressSize = 6;
