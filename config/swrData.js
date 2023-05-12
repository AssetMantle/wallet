import Link from "next/link";
import { toast } from "react-toastify";
import { defaultToastContainerId } from "./defaults";

export const placeholderAvailableBalance = "0.0000";
export const placeholderMntlUsdValue = "0.0000";
export const placeholderRewards = "0.0000";
export const mntlUsdApi =
  "https://api.coingecko.com/api/v3/simple/price?ids=assetmantle&vs_currencies=usd%2Ceth&precision=18";

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

const getExplorerLink = (chain, txHash) => {
  switch (chain) {
    case "ethereum":
      return `https://etherscan.io/tx/${txHash}`;
      break;

    case "polygon":
      return `https://polygonscan.com/tx/${txHash}`;
      break;

    default:
      return `https://etherscan.io/tx/${txHash}`;
      break;
  }
};

const CustomToastWithLink = ({ txHash, message, chain = "ethereum" }) => {
  const urlLink = getExplorerLink(chain, txHash);
  return (
    <p>
      {message}
      <Link href={urlLink}>
        <a style={{ color: "#ffc640" }} target="_blank">
          {" "}
          Here
        </a>
      </Link>
    </p>
  );
};

export const notify = (txHash, id, message, chain = "ethereum") => {
  if (txHash) {
    toast.update(id, {
      render: (
        <CustomToastWithLink message={message} txHash={txHash} chain={chain} />
      ),
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
