import Link from "next/link";
import { toast } from "react-toastify";
import {
  defaultChainName,
  defaultToastContainerId,
  defaultToastErrorMessage,
  defaultToastSubmittedMessage,
  ethereumChainName,
  gravityChainName,
  polygonChainName,
} from "./defaults";

export const placeholderAvailableBalance = "0.0000";
export const placeholderMntlUsdValue = "0.0000";
export const placeholderRewards = "0.0000";
export const mntlUsdApi =
  "https://api.coingecko.com/api/v3/simple/price?ids=assetmantle&vs_currencies=usd%2Ceth&precision=18";
// "https://api.coingecko.com/api/v3/simple/price?ids=assetmantle&vs_currencies=usd&precision=6";

export const placeholderTotalDelegations = "0.0000";
export const placeholderTotalUnbonding = "0.0000";

export const toastConfig = {
  position: "bottom-center",
  autoClose: 8000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: "dark",
  containerId: defaultToastContainerId,
};

const CustomToastWithLink = ({ txHash, message }) => (
  <p>
    {message}
    <Link href={`https://etherscan.io/tx/${txHash}`}>
      <a style={{ color: "#ffc640" }} target="_blank">
        {" "}
        Here
      </a>
    </Link>
  </p>
);

export const notify = (txHash, id, message) => {
  if (txHash) {
    toast.update(id, {
      render: <CustomToastWithLink message={message} txHash={txHash} />,
      type: "success",
      isLoading: false,
      toastId: txHash,
      ...toastConfig,
    });
  } else {
    toast.update(id, {
      render: message,
      type: "error",
      isLoading: false,
      ...toastConfig,
    });
  }
};

const ToastMessageComponent = ({ chain, message, txHash }) => {
  let hrefUrl;
  switch (chain) {
    case defaultChainName:
      hrefUrl = `https://explorer.assetmantle.one/transactions/${txHash}`;
      break;

    case gravityChainName:
      hrefUrl = `https://www.mintscan.io/gravity-bridge/txs/${txHash}`;
      break;

    case ethereumChainName:
      hrefUrl = `https://etherscan.io/tx/${txHash}`;
      break;

    case polygonChainName:
      hrefUrl = `https://polygonscan.com/tx/${txHash}`;
      break;

    default:
      hrefUrl = `https://explorer.assetmantle.one/transactions/${txHash}`;
      break;
  }
  return (
    <p>
      {message}
      <Link href={hrefUrl}>
        <a style={{ color: "#ffc640" }} target="_blank">
          {" "}
          Here
        </a>
      </Link>
    </p>
  );
};

export const updateToastNotification = (
  chain,
  txHash,
  initialToastId,
  message
) => {
  if (txHash) {
    toast.update(initialToastId, {
      render: (
        <ToastMessageComponent
          chain={chain}
          message={message || defaultToastSubmittedMessage}
          txHash={txHash}
        />
      ),
      type: "success",
      isLoading: false,
      toastId: txHash,
      ...toastConfig,
    });
  } else {
    toast.update(initialToastId, {
      render: message || defaultToastErrorMessage,
      type: "error",
      isLoading: false,
      ...toastConfig,
    });
  }
};
