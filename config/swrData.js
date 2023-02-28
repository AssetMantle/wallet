import Link from "next/link";
import { toast } from "react-toastify";

export const placeholderAvailableBalance = "0.0000";
export const placeholderMntlUsdValue = "0.0000";
export const placeholderRewards = "0.0000";
export const mntlUsdApi =
  "https://api.coingecko.com/api/v3/simple/price?ids=assetmantle&vs_currencies=usd&precision=6";
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
      position: "bottom-center",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      toastId: txHash,
    });
  } else {
    toast.update(id, {
      render: message,
      type: "error",
      isLoading: false,
      position: "bottom-center",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }
};
