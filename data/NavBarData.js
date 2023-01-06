import { AiOutlineQuestionCircle } from "react-icons/ai";
import { GiServerRack } from "react-icons/gi";
import { IoSwapHorizontal } from "react-icons/io5";
import { BsArrowUpRight } from "react-icons/bs";
import { BiBookOpen } from "react-icons/bi";
import { BsCurrencyDollar } from "react-icons/bs";
import { CgListTree } from "react-icons/cg";

export const NavBarData = {
  logo: "/logo.svg",
  title: "Mantle Wallet",
  navs: [
    {
      title: "Transact",
      href: "/",
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
      title: "Bridge",
      href: "/bridge",
      variant: "am-link",
      icon: <CgListTree />,
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
      title: "",
      href: "https://docs.assetmantle.one/",
      variant: "am-link",
      target: "_blank",
      icon: <AiOutlineQuestionCircle />,
    },
  ],
};
