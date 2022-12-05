import { IoSwapHorizontal } from "react-icons/io5";
import { AiOutlineQuestionCircle } from "react-icons/ai";

export const BasicData = {
  logo: "/logo.svg",
  title: "Mantle Wallet",
  navs: [
    {
      title: "Connect",
      href: "/",
      variant: "am-link",
    },
    {
      title: "Transact",
      href: "/transact",
      variant: "am-link",
      icon: <IoSwapHorizontal />,
    },
    {
      title: "Delegate",
      href: "/delegate",
      variant: "am-link",
    },
    {
      title: "Explorer",
      href: "https://explorer.assetmantle.one/",
      variant: "am-link",
      target: "_blank",
    },
    {
      title: "IBC Transaction",
      href: "/ibc",
      variant: "am-link",
    },
    {
      title: "Interchain",
      href: "/interchain",
      variant: "am-link",
    },
  ],
  rightNav: [
    {
      title: "Help",
      href: "",
      variant: "am-link",
      icon: <AiOutlineQuestionCircle />,
    },
  ],
};
