"use client";
import dynamic from "next/dynamic";

const CardanoWallet = dynamic(
  () => import("@meshsdk/react").then((mod) => mod.CardanoWallet),
  { ssr: false }
);

export default function WalletConnect() {
  return (
    <div className="flex items-center gap-3">
      <CardanoWallet isDark={true} />
    </div>
  );
}