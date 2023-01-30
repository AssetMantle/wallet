export const NavBarData = {
  logo: "/logo.svg",
  title: "Mantle Wallet",
  navs: [
    {
      title: "Transact",
      href: "/",
      variant: "am-link",
      icon: <i className="bi bi-arrow-left-right" />,
    },
    {
      title: "Stake",
      href: "/stake",
      variant: "am-link",
      icon: <i className="bi bi-currency-dollar" />,
    },
    {
      title: "Vote",
      href: "/vote",
      variant: "am-link",
      icon: <i className="bi bi-receipt-cutoff" />,
    },
    // {
    //   title: "Bridge",
    //   href: "/bridge",
    //   variant: "am-link",
    //   icon: <i className="bi bi-diagram-2" />,
    // },
    {
      title: "Explorer",
      href: "https://explorer.assetmantle.one/",
      variant: "am-link",
      target: "_blank",
      icon: <i className="bi bi-book" />,
      endIcon: <i className="bi bi-arrow-up-right" />,
    },
  ],
  rightNav: [
    {
      title: "",
      href: "https://docs.assetmantle.one/",
      variant: "am-link",
      target: "_blank",
      icon: <i className="bi bi-question-circle" />,
    },
  ],
};
