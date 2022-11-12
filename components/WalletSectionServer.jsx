import { WalletSection } from "./wallet";
import { Suspense } from "react";

export const WalletSectionServer = () => {
  return (
    <>
      <Suspense fallback={<p>Loading feed...</p>}>
        <WalletSection />
      </Suspense>
    </>
  );
};
