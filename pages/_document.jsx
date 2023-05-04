import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html data-bs-theme="dark">
      <Head />
      <body className=".bg-dark-subtle">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
