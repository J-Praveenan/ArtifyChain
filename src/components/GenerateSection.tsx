"use client";

import { useEffect, useState } from "react";
import {
  Download,
  ImageIcon,
  Loader2,
  Maximize2,
  Sparkles,
  X,
} from "lucide-react";
import { useWallet } from "@meshsdk/react";
import { ForgeScript, Mint, Transaction } from "@meshsdk/core";
import { showError, showSuccess } from "@/components/utils/toast";

const loadingSteps = [
  { time: 0, message: "Preparing prompt..." },
  { time: 3000, message: "Generating artwork..." },
  { time: 7000, message: "Enhancing details..." },
  { time: 12000, message: "Finalizing image..." },
];

function ArtworkLoader() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timers = loadingSteps.map((step, index) =>
      setTimeout(() => setStepIndex(index), step.time)
    );

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  const progress = Math.min(((stepIndex + 1) / loadingSteps.length) * 100, 100);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 via-slate-200 to-slate-400 p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle,#64748b_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-25" />

      <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-pink-300/40 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-56 w-56 rounded-full bg-cyan-300/40 blur-3xl" />

      <div className="relative z-10 flex items-center gap-2 text-slate-600">
        <Sparkles size={18} />
        <p className="text-sm font-bold">{loadingSteps[stepIndex].message}</p>
      </div>

      <div className="relative z-10 mt-auto">
        <div className="mb-3 flex items-center gap-2 text-white">
          <Loader2 className="animate-spin" size={18} />
          <span className="text-xs font-medium">
            Generating with Cloudflare AI...
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-white/30">
          <div
            className="h-full rounded-full bg-white transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function GenerateSection() {
  const [artName, setArtName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);

  const { wallet, connected } = useWallet();
  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState("");

  const splitMetadataText = (text: string) => {
    const chunks: string[] = [];

    for (let i = 0; i < text.length; i += 60) {
      chunks.push(text.slice(i, i + 60));
    }

    return chunks;
  };

  const getSafeFileName = () => {
    const name = artName.trim() || "artifychain-artwork";

    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setImageUrl("");
    setTxHash("");

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok || !data.imageUrl) {
        showError("Image generation failed");
        return;
      }

      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error("Generate image error:", error);
      showError("Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${getSafeFileName()}.png`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download image error:", error);
      showError("Failed to download image");
    }
  };


  const getWalletErrorMessage = (error: any) => {
    return (
      error?.message ||
      error?.info ||
      error?.reason ||
      error?.toString?.() ||
      ""
    );
  };

  const handleWalletError = (error: any) => {
    const message = getWalletErrorMessage(error).toLowerCase();

    if (
      message.includes("no account found") ||
      message.includes("reconnect the dapp") ||
      message.includes("account")
    ) {
      showError("Wallet is locked. Refresh the browser and connect wallet and try again.");
      return true;
    }

    if (
      message.includes("wallet is locked") ||
      message.includes("unlock")
    ) {
      showError("Wallet is locked. Refresh the browser and connect wallet and try again.");
      return true;
    }

    if (
      message.includes("cancel") ||
      message.includes("declined") ||
      message.includes("rejected") ||
      message.includes("denied") ||
      message.includes("refused")
    ) {
      return true;
    }

    return false;
  };

  const handleMintNFT = async () => {
    setMinting(true);
    setTxHash("");

    try {
      if (!connected || !wallet) {
        showError("Please connect wallet first");
        return;
      }

      if (!imageUrl) {
        showError("Generate image first.");
        return;
      }

      let usedAddresses: string[] = [];

      try {
        usedAddresses = await wallet.getUsedAddresses();
      } catch (walletError: any) {
        const msg =
          walletError?.message ||
          walletError?.info ||
          walletError?.reason ||
          walletError?.toString?.() ||
          "";

        const lower = msg.toLowerCase();

        if (
          lower.includes("no account found") ||
          lower.includes("reconnect the dapp")
        ) {
          showError("Wallet is locked. Refresh the browser and connect wallet and try again.");
          return;
        }

        if (lower.includes("wallet is locked") || lower.includes("unlock")) {
          showError("Wallet is locked. Refresh the browser and connect wallet and try again.");
          return;
        }

        throw walletError;
      }

      if (!usedAddresses.length) {
        showError("Wallet is locked. Refresh the browser and connect wallet and try again.");
        return;
      }

      const address = usedAddresses[0];
      const nftName = artName.trim() || `ArtifyChain${Date.now()}`;

      const ipfsRes = await fetch("/api/upload-ipfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl,
          name: nftName,
          prompt,
        }),
      });

      const ipfsData = await ipfsRes.json();

      if (!ipfsRes.ok) {
        showError(ipfsData.error || "IPFS upload failed.");
        return;
      }

      const forgingScript = ForgeScript.withOneSignature(address);

      const asset: Mint = {
        assetName: nftName,
        assetQuantity: "1",
        metadata: {
          name: nftName,
          image: ipfsData.ipfsUrl,
          mediaType: "image/png",
          description: "AI artwork by ArtifyChain",
          prompt: splitMetadataText(prompt),
        },
        label: "721",
        recipient: address,
      };

      const tx = new Transaction({ initiator: wallet }).mintAsset(
        forgingScript,
        asset
      );

      const unsignedTx = await tx.build();

      let signedTx: string;

      try {
        signedTx = await wallet.signTx(unsignedTx);
      } catch (signError: any) {
        const msg =
          signError?.message ||
          signError?.info ||
          signError?.reason ||
          signError?.toString?.() ||
          "";

        const lower = msg.toLowerCase();

        if (
          lower.includes("no account found") ||
          lower.includes("reconnect the dapp")
        ) {
          showError("Wallet is locked. Refresh the browser and connect wallet and try again.");
          return;
        }

        if (lower.includes("wallet is locked") || lower.includes("unlock")) {
          showError("Wallet is locked. Refresh the browser and connect wallet and try again.");
          return;
        }

        if (
          lower.includes("cancel") ||
          lower.includes("declined") ||
          lower.includes("rejected") ||
          lower.includes("denied") ||
          lower.includes("refused")
        ) {
          return;
        }

        throw signError;
      }

      let submittedTxHash = "";

      try {
        submittedTxHash = await wallet.submitTx(signedTx);
      } catch (submitError: any) {
        const msg =
          submitError?.message ||
          submitError?.info ||
          submitError?.reason ||
          submitError?.toString?.() ||
          "";

        const lower = msg.toLowerCase();

        if (
          lower.includes("no account found") ||
          lower.includes("reconnect the dapp")
        ) {
          showError("Wallet is locked. Refresh the browser and connect wallet and try again.");
          return;
        }

        if (lower.includes("wallet is locked") || lower.includes("unlock")) {
          showError("Wallet is locked. Refresh the browser and connect wallet and try again.");
          return;
        }

        throw submitError;
      }

      setTxHash(submittedTxHash);
      showSuccess("NFT created successfully!");
    } catch (error: any) {
      console.log("Mint NFT handled error:", error);

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
        showError("Wallet is locked. Refresh the browser and connect wallet and try again.");
        return;
      }

      if (lower.includes("wallet is locked") || lower.includes("unlock")) {
        showError("Wallet is locked. Refresh the browser and connect wallet and try again.");
        return;
      }

      if (
        lower.includes("cancel") ||
        lower.includes("declined") ||
        lower.includes("rejected") ||
        lower.includes("denied") ||
        lower.includes("refused")
      ) {
        return;
      }

      showError("NFT minting failed. Please try again.");
    } finally {
      setMinting(false);
    }
  };

  return (
    <>
        <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Generate Artwork
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                Enter an artwork name and creative prompt to generate your
                AI-powered digital art.
                </p>

                <input
                className="mt-6 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Artwork name, example: Cyber Temple #001"
                value={artName}
                onChange={(e) => setArtName(e.target.value)}
                />

                <textarea
                className="mt-4 h-32 w-full resize-none rounded-xl border border-slate-300 p-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:h-36"
                placeholder="Example: A futuristic Sri Lankan temple with neon lights, digital art"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                />

                <button
                onClick={handleGenerate}
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                {loading && <Loader2 className="animate-spin" size={18} />}
                {loading ? "Generating with Cloudflare AI..." : "Generate AI Art"}
                </button>

                <button
                onClick={handleMintNFT}
                disabled={!imageUrl || minting}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                {minting ? "Uploading to IPFS & Creating NFT..." : "Create NFT"}
                </button>
            </div>

            <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Artwork Preview
                </h3>

                <div className="mt-6 flex h-[260px] w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 sm:h-[360px] lg:h-[420px]">
                {loading ? (
                    <ArtworkLoader />
                ) : imageUrl ? (
                    <img
                    src={imageUrl}
                    alt={artName || "Generated artwork"}
                    className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="text-center text-slate-400">
                    <ImageIcon className="mx-auto mb-3" size={42} />
                    <p className="text-sm">Generated image will appear here</p>
                    </div>
                )}
                </div>

                {imageUrl && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button
                    onClick={() => setShowImageModal(true)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-indigo-500 hover:text-indigo-600"
                    >
                    <Maximize2 size={16} />
                    View Full Image
                    </button>

                    <button
                    onClick={handleDownloadImage}
                    className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-600"
                    >
                    <Download size={16} />
                    Download
                    </button>
                </div>
                )}

                {txHash && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
                    <p className="font-semibold text-emerald-700">
                    NFT Minted Successfully
                    </p>
                    <p className="mt-2 break-all text-emerald-600">{txHash}</p>
                </div>
                )}
            </div>
            </div>
        </div>
        </section>

        {showImageModal && imageUrl && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-3 sm:p-6">
            <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl">
            <button
                onClick={() => setShowImageModal(false)}
                className="absolute right-3 top-3 z-20 rounded-full bg-black/70 p-2 text-white transition hover:bg-black sm:right-4 sm:top-4"
            >
                <X size={22} />
            </button>

            <div className="flex max-h-[75vh] items-center justify-center bg-slate-50 p-3 sm:p-4">
                <img
                src={imageUrl}
                alt={artName || "Generated artwork"}
                className="max-h-[72vh] w-full rounded-2xl object-contain"
                />
            </div>
            </div>
        </div>
        )}
    </>
    );
}