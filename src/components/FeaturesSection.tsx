"use client";

import {
  WandSparkles,
  ImageIcon,
  CloudUpload,
  Coins,
  ShieldCheck,
  SearchCheck,
} from "lucide-react";

const features = [
  {
    icon: WandSparkles,
    title: "AI Prompt Generation",
    description: "Generate unique digital artwork from simple text prompts.",
  },
  {
    icon: ImageIcon,
    title: "Artwork Preview",
    description: "Preview generated artwork before storing or minting it.",
  },
  {
    icon: CloudUpload,
    title: "IPFS Storage",
    description: "Upload generated artwork to decentralized IPFS storage.",
  },
  {
    icon: Coins,
    title: "NFT Minting",
    description: "Mint the artwork as a Cardano NFT with metadata.",
  },
  {
    icon: ShieldCheck,
    title: "Ownership Proof",
    description: "Prove ownership using wallet address and transaction hash.",
  },
  {
    icon: SearchCheck,
    title: "Asset Verification",
    description: "Verify NFT details such as policy ID, asset name, and owner.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="functionalities" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 ring-1 ring-indigo-200">
            Features
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Powerful features for AI art ownership
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            ArtifyChain combines AI image generation, decentralized storage, NFT
            minting, and blockchain-based ownership verification.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon size={25} />
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}