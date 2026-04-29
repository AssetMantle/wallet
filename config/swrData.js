import Link from "next/link";
import { toast } from "react-toastify";
import { defaultToastContainerId } from "./defaults";

export const placeholderAvailableBalance = "0.0000";
export const placeholderMntlUsdValue = "0.0000";
export const placeholderRewards = "0.0000";

// CoinMarketCap IDs:
//   19686 = AssetMantle (MNTL)   12220 = Osmosis (OSMO)
//    2781 = USD                   1027 = Ethereum (ETH)
// `convertId` accepts a comma-separated list; the response embeds one
// `quotes[]` entry per requested currency, in input order.
export const cmcMntlId = "19686";
export const cmcOsmoId = "12220";
export const cmcUsdConvertId = "2781";
export const cmcEthConvertId = "1027";
export const mntlUsdApi = `/api/cmc/cryptocurrency/quote/latest?id=${cmcMntlId}&convertId=${cmcUsdConvertId},${cmcEthConvertId}`;

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

    case "polygon":
      return `https://polygonscan.com/tx/${txHash}`;

    default:
      return `https://etherscan.io/tx/${txHash}`;
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
