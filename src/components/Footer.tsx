"use client";

import {
  WandSparkles,
  ShieldCheck,
  Coins,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">

              <div>
                <h2 className="text-xl font-bold">
                  ArtifyChain
                </h2>

                <p className="text-sm text-slate-400">
                  AI Art + Cardano NFT Ownership
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              ArtifyChain empowers creators to generate AI artwork,
              store assets securely on IPFS, mint Cardano NFTs,
              and verify ownership transparently through blockchain
              technology.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">
              Platform
            </h3>

            <ul className="space-y-3 text-sm text-slate-400">
              <li>AI Artwork Generation</li>
              <li>IPFS Decentralized Storage</li>
              <li>Cardano NFT Minting</li>
              <li>NFT Ownership Verification</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">
              Technologies
            </h3>

            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <WandSparkles className="h-4 w-4 text-indigo-400" />
                AI Image Generation
              </div>

              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-indigo-400" />
                Cardano Blockchain
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                Ownership Verification
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © 2026 ArtifyChain. Built with AI, IPFS, and Cardano Blockchain.
        </div>
      </div>
    </footer>
  );
}