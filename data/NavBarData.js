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
    {
      title: "Bridge",
      href: "/bridge",
      variant: "am-link",
      icon: <i className="bi bi-diagram-2" />,
    },
    {
      title: "Trade",
      href: "/trade",
      variant: "am-link",
      icon: <i className="bi bi-bag" />,
    },
    {
      title: "Earn",
      href: "/earn",
      variant: "am-link",
      icon: <i className="bi bi-cash-coin" />,
    },
    /* {
      title: "Farm",
      href: "/farm",
      variant: "am-link",
      icon: <i className="bi bi-piggy-bank" />,
    }, */
    {
      title: "Explorer",
      href: "https://explorer.assetmantle.one/",
      variant: "am-link",
      target: "_blank",
      icon: <i className="bi bi-book" />,
      endIcon: <i className="bi bi-arrow-up-right" />,
    },
    {
      title: "MantlePlace",
      href: "https://marketplace.assetmantle.one/",
      variant: "am-link",
      target: "_blank",
      icon: <i className="bi bi-shop-window" />,
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

/* export const newdsd = {
  success: true,
  result: [
    {
      transactionHash:
        "0xd78940ac12c93d6ae3fc5e1f7c73b2e5edbbc06b17ba033fefe1f877ebf084b6",
      userAddress: "0xae6094170abc0601b4bbe933d04368cd407c186a",
      childToken: "0x38a536a31ba4d8c1bcca016abbf786ecd25877e8",
      amount: "170000050",
      isPos: true,
      isFx: false,
      blockNumber: 39733871,
      timestamp: "2023-02-26T14:36:13.000Z",
      transactionStatus: "exited",
      tokenType: "ERC20",
    },
  ],
  paginationData: { page: 0, pageSize: 50, totalCount: 1, hasNextPage: false },
}; */
