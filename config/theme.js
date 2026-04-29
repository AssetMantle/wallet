import { extendTheme } from "@chakra-ui/react";

export const getBalanceStyle = (
  balanceString,
  style1ClassName,
  style2ClassName
) => {
  if (balanceString && balanceString.toString().length) {
    const balanceArray = balanceString.toString().split(".");
    if (balanceArray.length > 1) {
      return (
        <span className={style1ClassName}>
          {balanceArray[0]}.
          <span className={style2ClassName}>{balanceArray[1]}</span>
        </span>
      );
    } else {
      return <span className={style1ClassName}>{balanceArray[0]}</span>;
    }
  }
};

export const defaultThemeObject = {
  fonts: {
    body: "Inter, system-ui, sans-serif",
    heading: "Work Sans, system-ui, sans-serif",
  },
  colors: {
    primary: {
      50: "#e5e7f9",
      100: "#bec4ef",
      200: "#929ce4",
      300: "#6674d9",
      400: "#4657d1",
      500: "#2539c9",
      600: "#2133c3",
      700: "#1b2cbc",
      800: "#1624b5",
      900: "#0d17a9",
    },
  },
  breakPoints: {
    sm: "30em",
    md: "48em",
    lg: "62em",
    xl: "80em",
    "2xl": "96em",
  },
  shadows: {
    largeSoft: "rgba(60, 64, 67, 0.15) 0px 2px 10px 6px;",
  },
  // Default theme is light (matches assetmantle.one). The companion SCSS
  // (config/styles/index.scss) repoints background/text tokens to light
  // values; flipping Chakra's mode here keeps any Chakra-rendered
  // components (modals, menus) in agreement with the global stylesheet.
  initialColorMode: "light",
  config: { initialColorMode: "light", useSystemColorMode: false },
};

export const defaultTheme = extendTheme(defaultThemeObject);
