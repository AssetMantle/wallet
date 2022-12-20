import { AiOutlineQuestionCircle } from "react-icons/ai";
import { GiServerRack } from "react-icons/gi";
import { IoSwapHorizontal } from "react-icons/io5";
import { BsArrowUpRight } from "react-icons/bs";
import { BiBookOpen } from "react-icons/bi";
import { BsCurrencyDollar } from "react-icons/bs";

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
      title: "Stake",
      href: "/stake",
      variant: "am-link",
      icon: <BsCurrencyDollar />,
    },
    {
      title: "Vote",
      href: "/vote",
      variant: "am-link",
      icon: <GiServerRack />,
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
      icon: <BiBookOpen />,
      endIcon: <BsArrowUpRight />,
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
