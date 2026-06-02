"use client";

import Image from "next/image";
import {
  WandSparkles,
  Coins,
  Database,
  Boxes,
  Wallet,
} from "lucide-react";

const platformLinks = [
  { label: "Create Artwork", href: "#generate" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#functionalities" },
  { label: "Verify NFT", href: "#verify" },
  { label: "My Collection", href: "#assets" },
];

const technologyLinks = [
  {
    label: "Cardano",
    href: "https://cardano.org/",
    icon: Coins,
  },
  {
    label: "MeshJS",
    href: "https://meshjs.dev/",
    icon: Wallet,
  },
  {
    label: "Next.js",
    href: "https://nextjs.org/",
    icon: WandSparkles,
  },
  {
    label: "Pinata IPFS",
    href: "https://www.pinata.cloud/",
    icon: Boxes,
  },
  {
    label: "Blockfrost",
    href: "https://blockfrost.io/",
    icon: Database,
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-4">
              <Image
                src="/artify-chain-logo.png"
                alt="ArtifyChain Logo"
                width={80}
                height={80}
                className="rounded-2xl object-contain"
              />

              <div>
                <h2 className="text-2xl font-bold">
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

          {/* Platform Links */}
          <div>
            <h3 className="mb-4 font-semibold text-white">
              Platform
            </h3>

            <ul className="space-y-3 text-sm text-slate-400">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="transition hover:text-indigo-400"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Technology Links */}
          <div>
            <h3 className="mb-4 font-semibold text-white">
              Technologies
            </h3>

            <div className="space-y-3 text-sm text-slate-400">
              {technologyLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 transition hover:text-indigo-400"
                  >
                    <Icon className="h-4 w-4 text-indigo-400" />
                    {link.label}
                  </a>
                );
              })}

            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © 2026 ArtifyChain. Built with AI, IPFS, Cardano, Blockfrost, and
          Next.js.
        </div>
      </div>
    </footer>
  );
}