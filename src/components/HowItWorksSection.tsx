"use client";

import {
  Brain,
  ImagePlus,
  UploadCloud,
  Wallet,
  BadgeCheck,
} from "lucide-react";

const steps = [
  {
    icon: Brain,
    title: "Enter Prompt",
    description:
      "Describe your idea with a simple text prompt and let AI understand your creativity.",
  },
  {
    icon: ImagePlus,
    title: "Generate AI Artwork",
    description:
      "Our AI model transforms your prompt into a unique digital artwork within seconds.",
  },
  {
    icon: UploadCloud,
    title: "Store on IPFS",
    description:
      "The generated artwork is uploaded to decentralized IPFS storage for permanent accessibility.",
  },
  {
    icon: Wallet,
    title: "Mint as NFT",
    description:
      "Create a Cardano NFT containing artwork metadata and ownership information.",
  },
  {
    icon: BadgeCheck,
    title: "Verify Ownership",
    description:
      "Anyone can verify the NFT owner, metadata, and authenticity directly from the blockchain.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="bg-slate-50 py-20"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 ring-1 ring-indigo-200">
            How It Works
          </span>

          <h2 className="mt-5 text-4xl font-black text-slate-900 md:text-5xl">
            From Prompt to Blockchain Ownership
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            ArtifyChain provides a seamless workflow to generate AI artwork,
            store it securely, mint NFTs, and verify ownership on the Cardano
            blockchain.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="absolute right-5 top-5 text-4xl font-black text-slate-100">
                {index + 1}
              </span>

              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200">
                <step.icon className="h-7 w-7" />
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}