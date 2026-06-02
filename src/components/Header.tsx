"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

import dynamic from "next/dynamic";

const WalletConnect = dynamic(() => import("./WalletConnect"), {
  ssr: false,
});

type SectionKey =
  | "hero"
  | "generate"
  | "how-it-works"
  | "functionalities"
  | "verify"
  | "assets";

type HeaderProps = {
  scrollToSection: (section: SectionKey) => void;
};

const navItems = [
  { label: "Create Artwork", value: "generate" },
  { label: "How It Works", value: "how-it-works" },
  { label: "Features", value: "functionalities" },
  { label: "Verify NFT", value: "verify" },
  { label: "My Collection", value: "assets" },
] as const;

export default function Header({ scrollToSection }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] =
    useState<SectionKey>("hero");

  const handleClick = (section: SectionKey) => {
    setActiveSection(section);
    scrollToSection(section);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <button
          onClick={() => handleClick("hero")}
          className="flex items-center gap-3 text-left"
        >
          <Image
            src="/artify-chain-logo.png"
            alt="ArtifyChain Logo"
            width={80}
            height={80}
            className="rounded-xl object-contain"
            priority
          />

          <div>
            <h1 className="text-xl font-black text-slate-900">
              ArtifyChain
            </h1>

            <p className="text-xs font-medium text-slate-500">
              AI Art + Cardano NFT Ownership
            </p>
          </div>
        </button>

        <div className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => handleClick(item.value)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                activeSection === item.value
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <WalletConnect />
        </div>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-xl border border-slate-200 p-2 text-slate-700 lg:hidden"
        >
          {menuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-5 py-4 lg:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleClick(item.value)}
                className={`rounded-xl px-4 py-3 text-left text-sm font-semibold ${
                  activeSection === item.value
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-50 text-indigo-600"
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-3">
              <WalletConnect />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}