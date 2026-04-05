import { Slabo_13px } from "next/font/google";

import { Navbar } from "./components/navbar";
import { CtaBand } from "./components/landing/cta-band";
import { FeatureGrid } from "./components/landing/feature-grid";
import { HeroSection } from "./components/landing/hero-section";
import { LandingFooter } from "./components/landing/landing-footer";
import { MethodRibbon } from "./components/landing/method-ribbon";
import { ProcessStrip } from "./components/landing/process-strip";

const slabo = Slabo_13px({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-slabo",
});

const docsUrl = process.env.NEXT_PUBLIC_DOCS_URL ?? "http://localhost:5173";

export default function Home() {
  return (
    <main
      className={`${slabo.variable} fx-page-bg min-h-screen text-[var(--fx-text-1)]`}
    >
      <div className="mx-auto max-w-[1200px] px-5">
        <Navbar
          productName="FexAPI"
          productTag=""
          items={[]}
          docsAction={{ label: "View Docs", href: docsUrl }}
          githubHref="https://github.com/shreeteja172/fexapi"
        />
        <HeroSection docsUrl={docsUrl} />
      </div>

      <MethodRibbon />
      <FeatureGrid />
      <ProcessStrip />
      <CtaBand docsUrl={docsUrl} />
      <LandingFooter />
    </main>
  );
}
