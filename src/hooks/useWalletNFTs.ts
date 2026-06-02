import { showError } from "@/components/utils/toast";
import { useWallet } from "@meshsdk/react";
import { useState } from "react";

export type WalletNFT = {
  unit: string;
  policyId: string;
  assetName: string;
  quantity: string;
  image?: string;
  description?: string;
  fingerprint?: string;
};

export function useWalletNFTs() {
  const { wallet, connected } = useWallet();
  const [assets, setAssets] = useState<WalletNFT[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAssets = async () => {
    if (!connected || !wallet) {
      showError("Please connect your wallet first.");
      return;
    }

    setLoading(true);

    try {
      let walletAssets;

      try {
        walletAssets = await wallet.getAssets();
      } catch (walletError: any) {
        const msg =
          walletError?.message ||
          walletError?.info ||
          walletError?.reason ||
          walletError?.toString?.() ||
          "";

        const lower = msg.toLowerCase();

        // Wallet disconnected
        if (
          lower.includes("no account found") ||
          lower.includes("reconnect the dapp")
        ) {
          showError(
            "Wallet connection expired. Please disconnect and reconnect Lace Wallet."
          );
          return;
        }

        // Wallet locked
        if (
          lower.includes("wallet is locked") ||
          lower.includes("unlock")
        ) {
          showError("Please unlock your Lace Wallet first.");
          return;
        }

        throw walletError;
      }

      const nftAssets = walletAssets.filter(
        (asset: any) => asset.quantity === "1"
      );

      const detailedAssets = await Promise.all(
        nftAssets.map(async (asset: any) => {
          try {
            const res = await fetch("/api/get-asset-details", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                unit: asset.unit,
              }),
            });

            if (!res.ok) {
              return {
                unit: asset.unit,
                policyId: asset.policyId,
                assetName: asset.assetName || "Unnamed NFT",
                quantity: asset.quantity,
              };
            }

            return await res.json();
          } catch {
            return {
              unit: asset.unit,
              policyId: asset.policyId,
              assetName: asset.assetName || "Unnamed NFT",
              quantity: asset.quantity,
            };
          }
        })
      );

      setAssets(detailedAssets);
    } catch (error: any) {
      console.error("Fetch wallet NFTs error:", error);

      const msg =
        error?.message ||
        error?.info ||
        error?.reason ||
        error?.toString?.() ||
        "";

      const lower = msg.toLowerCase();

      if (
        lower.includes("no account found") ||
        lower.includes("reconnect the dapp")
      ) {
        showError(
          "Wallet connection expired. Please disconnect and reconnect Lace Wallet."
        );
        return;
      }

      if (
        lower.includes("wallet is locked") ||
        lower.includes("unlock")
      ) {
        showError("Please unlock your Lace Wallet first.");
        return;
      }

      showError("Failed to load NFT collection.");
    } finally {
      setLoading(false);
    }
  };

  const removeAsset = (unit: string) => {
    setAssets((prev) => prev.filter((asset) => asset.unit !== unit));
  };

  return {
    connected,
    assets,
    loading,
    fetchAssets,
    removeAsset,
  };
}