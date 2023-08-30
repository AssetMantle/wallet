import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html data-bs-theme="dark">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Work+Sans:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
        ></link>
      </Head>
      <body className="bg-dark-subtle">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
