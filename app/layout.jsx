import "./globals.css";
import { WalletProviderClient } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>MantleWallet</title>
        <meta name="description" content="Primary Wallet App of AssetMantle" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <WalletProviderClient>{children}</WalletProviderClient>
      </body>
    </html>
  );
}
