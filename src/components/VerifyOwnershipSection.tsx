"use client";

import { useState } from "react";
import { Download, ExternalLink, SearchCheck, X } from "lucide-react";
import { showError } from "./utils/toast";

export default function VerifyOwnershipSection() {
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [imageLoading, setImageLoading] = useState(true);

  const downloadImage = async (imageUrl: string, name: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = `${name || "artifychain-nft"}.png`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download image error:", error);
      showError("Failed to download image");
    }
  };

  const handleVerify = async () => {
    if (!txHash.trim()) {
      showError("Enter Transaction Hash");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/verify-asset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ txHash }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.error || "Verification failed");
        return;
      }

      setResult(data);
    } catch (error) {
      console.error(error);
      showError("Failed to verify transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section id="verify" className="scroll-mt-28 py-20">
        <div className="text-center">
          <p className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 ring-1 ring-indigo-200">
            Verify Ownership
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Verify NFT ownership
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Paste the Cardano transaction hash to view NFT image, owner address,
            policy ID, and blockchain proof.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-6xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
          <input
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            placeholder="Enter transaction hash"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <button
            onClick={handleVerify}
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            <SearchCheck size={18} />
            {loading ? "Verifying..." : "Verify NFT"}
          </button>

          {result && (
            <div className="mt-8">
              {result.assets.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                  No NFT/native assets found in this transaction.
                </div>
              ) : (
                <div className="space-y-8">
                  {result.assets.slice(0, 1).map((asset: any, index: number) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="bg-slate-50 p-5 md:p-8">
                          {imageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="h-full w-full animate-pulse rounded-2xl bg-slate-200" />
                            </div>
                          )}
                          <img
                            src={asset.image}
                            alt={asset.name}
                            className="h-[280px] w-full rounded-2xl object-cover sm:h-[380px] lg:h-full lg:max-h-[560px]"
                            onLoad={() => setImageLoading(false)}
                          />
                        </div>

                        <div className="flex flex-col justify-between p-5 md:p-8">
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">
                              {asset.name}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500 md:text-base">
                              AI artwork generated and minted on Cardano
                              blockchain.
                            </p>

                            <div className="mt-8 space-y-5">
                              <DetailItem
                                label="Policy ID"
                                value={asset.policyId}
                              />
                              <DetailItem
                                label="Transaction Hash"
                                value={txHash}
                              />
                              <DetailItem
                                label="Asset Name"
                                value={asset.name}
                              />
                              <DetailItem
                                label="Owner Address"
                                value={asset.ownerAddress}
                              />
                            </div>
                          </div>

                          <div className="mt-10 space-y-3">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              <button
                                onClick={() => setSelectedImage(asset)}
                                className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                              >
                                View Full Image
                              </button>

                              <button
                                onClick={() =>
                                  downloadImage(asset.image, asset.name)
                                }
                                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
                              >
                                <Download size={16} />
                                Download Image
                              </button>
                            </div>

                            <a
                              href={`https://preprod.cardanoscan.io/transaction/${txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                              View Transaction on CardanoScan
                              <ExternalLink size={16} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-6">
          <div className="relative flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-black text-slate-900 sm:text-xl">
                  {selectedImage.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                  Verified Cardano NFT Artwork
                </p>
              </div>

              <button
                onClick={() => setSelectedImage(null)}
                className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-red-100 hover:text-red-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-4 sm:p-6">
              <div className="relative flex max-h-[70vh] w-full items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.name}
                  className="max-h-[66vh] w-full rounded-2xl object-contain"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  Blockchain verified artwork
                </p>
                <p className="mt-1 break-all text-xs text-slate-500">
                  {selectedImage.fingerprint || selectedImage.unit || "Cardano NFT"}
                </p>
              </div>

              <button
                onClick={() => downloadImage(selectedImage.image, selectedImage.name)}
                className="w-full rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-600 sm:w-auto"
              >
                Download Image
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-sm font-semibold text-slate-700">{label}</p>
      <p className="break-all rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
        {value || "-"}
      </p>
    </div>
  );
}