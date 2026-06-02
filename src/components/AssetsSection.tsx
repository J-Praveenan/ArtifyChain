"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Flame,
} from "lucide-react";
import { useWallet } from "@meshsdk/react";
import { ForgeScript, Transaction } from "@meshsdk/core";
import { useWalletNFTs } from "@/hooks/useWalletNFTs";
import { showError, showSuccess } from "./utils/toast";
import WalletConnect from "./WalletConnect";

const ITEMS_PER_PAGE = 4;

export default function AssetsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [burningUnit, setBurningUnit] = useState("");
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [showBurnModal, setShowBurnModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [showSkeleton, setShowSkeleton] = useState(false);

  const { wallet, connected } = useWallet();
  const { assets, loading, fetchAssets, removeAsset } = useWalletNFTs();

  const totalPages = Math.max(1, Math.ceil(assets.length / ITEMS_PER_PAGE));

  const paginatedAssets = assets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleLoadAssets = async () => {
    setShowSkeleton(true);
    setLoadedImages({});

    await Promise.all([
      fetchAssets(),
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]);

    setShowSkeleton(false);
  };

  const handleBurnNFT = async (asset: any) => {
    if (!connected) {
      showError("Please connect your wallet first.");
      return;
    }

    setBurningUnit(asset.unit);

    try {
      const usedAddresses = await wallet.getUsedAddresses();

      if (!usedAddresses.length) {
        showError("Wallet address not found.");
        return;
      }

      const address = usedAddresses[0];
      const forgingScript = ForgeScript.withOneSignature(address);

      const tx = new Transaction({
        initiator: wallet,
      }).burnAsset(forgingScript, {
        unit: asset.unit,
        quantity: "1",
      });

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);

      showSuccess(`NFT burned successfully!`);

      removeAsset(asset.unit);

      setTimeout(() => {
        fetchAssets();
      }, 8000);

      await handleLoadAssets();
    } catch (error) {
      console.error("Burn NFT Error:", error);
      showError("Failed to burn NFT. Please try again.");
    } finally {
      setBurningUnit("");
    }
  };

  return (
    <>
      <section id="assets" className="scroll-mt-28 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 ring-1 ring-indigo-200">
              My Collection
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              My NFT assets
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              View, verify, and burn NFTs owned by your connected Cardano
              wallet.
            </p>
          </div>

          <div className="mt-8 flex justify-center sm:mt-10 sm:justify-end">
            <button
              onClick={handleLoadAssets}
              disabled={loading || showSkeleton || !connected}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-50 sm:w-auto"
            >
              <RefreshCw
                size={16}
                className={loading || showSkeleton ? "animate-spin" : ""}
              />
              {loading || showSkeleton ? "Loading..." : "Load My Assets"}
            </button>
          </div>

          {!connected && (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto max-w-md">
                <h3 className="text-lg font-bold text-slate-900">
                  Connect your wallet
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Connect your Cardano wallet to view your NFT collection,
                  verify ownership, and manage your assets.
                </p>

                <div className="mt-6 flex justify-center">
                  <WalletConnect />
                </div>
              </div>
            </div>
          )}

          {connected && assets.length === 0 && !loading && !showSkeleton && (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 sm:p-8">
              No wallet assets loaded yet. Click “Load My Assets”.
            </div>
          )}

          {showSkeleton && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
                >
                  <div className="h-56 animate-pulse rounded-2xl bg-slate-200 sm:h-52" />

                  <div className="mt-5 h-6 w-3/4 animate-pulse rounded bg-slate-200" />

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="h-12 animate-pulse rounded-xl bg-slate-200" />
                    <div className="h-12 animate-pulse rounded-xl bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showSkeleton && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedAssets.map((asset) => (
                <div
                  key={asset.unit}
                  className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-5"
                >
                  <div className="relative h-56 overflow-hidden rounded-2xl bg-indigo-50 sm:h-52">
                    {asset.image ? (
                      <>
                        {!loadedImages[asset.unit] && (
                          <div className="absolute inset-0 animate-pulse bg-slate-200" />
                        )}

                        <img
                          src={asset.image}
                          alt={asset.assetName || "NFT Asset"}
                          className={`h-full w-full object-cover transition-opacity duration-300 ${
                            loadedImages[asset.unit]
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                          onLoad={() =>
                            setLoadedImages((prev) => ({
                              ...prev,
                              [asset.unit]: true,
                            }))
                          }
                        />
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center px-4 text-center text-sm text-indigo-600">
                        No Image Found
                      </div>
                    )}
                  </div>

                  <h3 className="mt-5 truncate text-base font-bold text-slate-900 sm:text-lg">
                    {asset.assetName || "Unnamed NFT"}
                  </h3>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <a
                      href={`https://preprod.cardanoscan.io/transaction/${asset.initialMintTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
                    >
                      View
                      <ExternalLink size={16} />
                    </a>

                    <button
                      onClick={() => {
                        setSelectedAsset(asset);
                        setShowBurnModal(true);
                      }}
                      disabled={burningUnit === asset.unit}
                      className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                      <Flame size={16} />
                      {burningUnit === asset.unit ? "Burning..." : "Burn"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {assets.length > 0 && !showSkeleton && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:justify-end">
              <button
                onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                disabled={currentPage === 1}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((page) => Math.min(page + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </section>

      {showBurnModal && selectedAsset && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                  <Flame size={28} />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    Burn NFT
                  </h3>
                  <p className="text-sm text-slate-500">
                    Confirm permanent NFT burn
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              {selectedAsset.image && (
                <div className="mb-5 flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <img
                    src={selectedAsset.image}
                    alt={selectedAsset.assetName || "NFT"}
                    className="h-16 w-16 rounded-xl object-cover"
                  />

                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">
                      {selectedAsset.assetName || "Unnamed NFT"}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {selectedAsset.unit}
                    </p>
                  </div>
                </div>
              )}

              <p className="text-sm leading-6 text-slate-600">
                Are you sure you want to burn this NFT? This will permanently remove
                the asset from your wallet.
              </p>

              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-700">
                  This action cannot be undone.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => {
                    setShowBurnModal(false);
                    setSelectedAsset(null);
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    setShowBurnModal(false);
                    await handleBurnNFT(selectedAsset);
                    setSelectedAsset(null);
                  }}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  <Flame size={17} />
                  Burn NFT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}