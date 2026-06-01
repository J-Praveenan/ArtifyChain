"use client";

import { WandSparkles } from "lucide-react";

type SectionKey =
  | "home"
  | "how-it-works"
  | "functionalities"
  | "verify"
  | "assets";

type HeroSectionProps = {
  scrollToSection: (section: SectionKey) => void;
};

export default function HeroSection({
  scrollToSection,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
          <WandSparkles size={16} />
          AI Art + Cardano NFT Ownership
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl">
          Generate AI Art and Prove Ownership on the{" "}
          <span className="text-indigo-600">Cardano Blockchain</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Transform your ideas into stunning AI-generated artwork, store them
          securely on IPFS, mint them as Cardano NFTs, and verify ownership
          transparently on the blockchain.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => scrollToSection("home")}
            className="rounded-2xl bg-indigo-600 px-7 py-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Create Artwork
          </button>

          <button
            onClick={() => scrollToSection("verify")}
            className="rounded-2xl border border-indigo-200 bg-white px-7 py-4 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
          >
            Verify NFT
          </button>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "AI Art",
              description: "Generate unique artwork from prompts",
            },
            {
              title: "IPFS",
              description: "Decentralized artwork storage",
            },
            {
              title: "Cardano",
              description: "Immutable NFT ownership proof",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-3xl font-black text-indigo-600">
                {item.title}
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}