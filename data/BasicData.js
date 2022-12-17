import { AiOutlineQuestionCircle } from "react-icons/ai";
import { GiServerRack } from "react-icons/gi";
import { IoSwapHorizontal } from "react-icons/io5";
import { BsArrowUpRight } from "react-icons/bs";
import { BiBookOpen } from "react-icons/bi";

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
      title: "Vote",
      href: "/vote",
      variant: "am-link",
      icon: <GiServerRack />,
    },
    {
      title: "Delegate",
      href: "/stake",
      variant: "am-link",
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
    {
      title: "Explorer",
      href: "https://explorer.assetmantle.one/",
      variant: "am-link",
      target: "_blank",
      icon: <BiBookOpen />,
      endIcon: <BsArrowUpRight />,
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
