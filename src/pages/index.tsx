import Head from "next/head";
import { useRef } from "react";

import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import GenerateSection from "@/components/GenerateSection";
import VerifyOwnershipSection from "@/components/VerifyOwnershipSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";
import AssetsSection from "@/components/AssetsSection";
import Footer from "@/components/Footer";

type SectionKey =
  | "hero"
  | "generate"
  | "how-it-works"
  | "functionalities"
  | "verify"
  | "assets";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const generateRef = useRef<HTMLDivElement>(null);
  const verifyRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const functionalitiesRef = useRef<HTMLDivElement>(null);
  const assetsRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: SectionKey) => {
    const refs = {
      hero: heroRef,
      generate: generateRef,
      verify: verifyRef,
      "how-it-works": howItWorksRef,
      functionalities: functionalitiesRef,
      assets: assetsRef,
    };

    refs[section].current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <Head>
        <title>ArtifyChain</title>
        <meta
          name="description"
          content="AI Art Generation and Cardano NFT Ownership Verification Platform"
        />
      </Head>

      <main className="min-h-screen bg-white text-slate-900">
        <Header scrollToSection={scrollToSection} />

        <section ref={heroRef} id="hero" className="scroll-mt-28">
          <HeroSection scrollToSection={scrollToSection} />
        </section>

        <section ref={generateRef} id="generate" className="scroll-mt-28">
          <GenerateSection />
        </section>

        <section ref={verifyRef} id="verify" className="scroll-mt-28">
          <VerifyOwnershipSection />
        </section>

        <section ref={howItWorksRef} id="how-it-works" className="scroll-mt-28">
          <HowItWorksSection />
        </section>

        <section
          ref={functionalitiesRef}
          id="functionalities"
          className="scroll-mt-28"
        >
          <FeaturesSection />
        </section>

        <section ref={assetsRef} id="assets" className="scroll-mt-28">
          <AssetsSection />
        </section>

        <Footer />
      </main>
    </>
  );
}