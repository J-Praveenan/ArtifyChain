"use client";

import { CardanoWallet, useWallet } from "@meshsdk/react";

export default function WalletConnect() {

  return (
    <div className="flex items-center gap-3">
      <CardanoWallet isDark={true} />
    </div>
  );
}