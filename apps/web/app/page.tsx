import { Button } from "./components/button";
import { Card } from "./components/card";
import { CodeBlock } from "./components/code-block";
import { Container } from "./components/container";
import { Navbar } from "./components/navbar";
import { Section } from "./components/section";

const trustItems = [
  "Atlas",
  "Northstar",
  "Helix",
  "Pulse",
  "Monolith",
  "Lattice",
];

const features = [
  {
    title: "Schema-first mocks",
    description:
      "Define endpoints once and generate stable, realistic payloads for every stage of product development.",
  },
  {
    title: "Deterministic output",
    description:
      "Seeded generation keeps API responses predictable so design reviews, QA flows, and snapshots stay aligned.",
  },
  {
    title: "Team runtime controls",
    description:
      "Tune latency, response size, and route behavior with runtime flags without rebuilding local tooling.",
  },
  {
    title: "Production-like ergonomics",
    description:
      "Headers, status codes, pagination, and failure branches mirror real APIs so integration work lands faster.",
  },
];

const platformBlocks = [
  {
    title: "Security",
    text: "Role-based route ownership and audited config changes keep shared mock environments safe by default.",
  },
  {
    title: "Performance",
    text: "Warm route compilation and memory-efficient generators deliver fast startup and consistent request throughput.",
  },
  {
    title: "Infrastructure",
    text: "Deploy from local machines to CI workers with identical behavior using a single configuration contract.",
  },
];

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Usage", href: "#usage" },
  { label: "Platform", href: "#platform" },
];

const docsUrl = process.env.NEXT_PUBLIC_DOCS_URL ?? "http://localhost:5173";

export default function Home() {
  return (
    <div className="bg-[var(--background)]">
      <Navbar
        productName="FexAPI"
        productTag="Mock Runtime"
        items={navItems}
        secondaryAction={{ label: "View Docs", href: docsUrl }}
        primaryAction={{ label: "Start Building", href: "#usage" }}
      />

      <main>
        <section className="border-b border-[var(--line)] bg-[#0c0d10] py-20 text-white sm:py-28">
          <Container>
            <div className="grid items-start gap-12 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.12em] text-white/60">
                  API Mocking Infrastructure
                </p>
                <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                  Build and ship APIs before the backend is ready.
                </h1>
                <p className="mt-6 max-w-xl text-base text-white/70 sm:text-lg">
                  FexAPI gives product teams fast, deterministic API
                  environments with the structure and control required for
                  serious development workflows.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Button href="#usage" variant="primary">
                    Start Building
                  </Button>
                  <Button href="#features" variant="secondary">
                    Explore Features
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.8)]">
                <p className="text-sm font-medium text-white/80">
                  Live System Preview
                </p>
                <div className="mt-5 space-y-4">
                  <div className="rounded-xl border border-white/10 bg-[#111318] p-4">
                    <p className="text-xs uppercase tracking-[0.08em] text-white/50">
                      Latency Profile
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                      42 ms
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#111318] p-4">
                    <p className="text-xs uppercase tracking-[0.08em] text-white/50">
                      Active Routes
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                      128
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#111318] p-4">
                    <p className="text-xs uppercase tracking-[0.08em] text-white/50">
                      Environment Status
                    </p>
                    <p className="mt-2 text-sm text-white/75">
                      Synchronized across local, preview, and CI.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-b border-[var(--line)] py-8">
          <Container className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-medium text-[#818793] sm:justify-between">
            {trustItems.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </Container>
        </section>

        <Section
          id="features"
          eyebrow="Feature Set"
          title="Built for fast product iteration."
          description="A practical toolkit for teams that need high fidelity API behavior across development, design, and release pipelines."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title}>
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-[15px] text-[var(--muted)]">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </Section>

        <Section
          id="usage"
          eyebrow="Usage"
          title="Developer workflow with zero friction."
          description="Move from schema definition to production-grade mocks in minutes with predictable, inspectable output."
          className="border-y border-[var(--line)] bg-[#07080b] text-white"
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <CodeBlock
              language="ts"
              filename="fexapi.config.ts"
              lines={[
                [
                  { text: "import", className: "text-[#7dd3fc]" },
                  { text: " { defineConfig } ", className: "text-[#e9ecf2]" },
                  { text: "from", className: "text-[#7dd3fc]" },
                  { text: ' "fexapi";', className: "text-[#86efac]" },
                ],
                [{ text: "" }],
                [
                  { text: "export", className: "text-[#7dd3fc]" },
                  { text: " default ", className: "text-[#7dd3fc]" },
                  { text: "defineConfig", className: "text-[#c4b5fd]" },
                  { text: "({", className: "text-[#e9ecf2]" },
                ],
                [
                  { text: "  port: ", className: "text-[#e9ecf2]" },
                  { text: "4100", className: "text-[#fca5a5]" },
                  { text: ",", className: "text-[#e9ecf2]" },
                ],
                [
                  { text: "  latency: ", className: "text-[#e9ecf2]" },
                  { text: "42", className: "text-[#fca5a5]" },
                  { text: ",", className: "text-[#e9ecf2]" },
                ],
                [{ text: "  routes: {", className: "text-[#e9ecf2]" }],
                [
                  {
                    text: '    "GET /projects": {',
                    className: "text-[#86efac]",
                  },
                ],
                [
                  {
                    text: '      schema: "project",',
                    className: "text-[#e9ecf2]",
                  },
                ],
                [
                  { text: "      count: ", className: "text-[#e9ecf2]" },
                  { text: "12", className: "text-[#fca5a5]" },
                ],
                [{ text: "    }", className: "text-[#e9ecf2]" }],
                [{ text: "  }", className: "text-[#e9ecf2]" }],
                [{ text: "});", className: "text-[#e9ecf2]" }],
              ]}
            />

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-white/55">
                  Runtime Command
                </p>
                <p className="mt-3 font-mono text-sm text-white/90">
                  pnpm fexapi dev --watch --log
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-white/55">
                  Output Shape
                </p>
                <p className="mt-3 text-sm leading-7 text-white/75">
                  Every response follows route contracts, deterministic fields,
                  and status handling for consistent frontend integration.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-white/55">
                  Scaling Strategy
                </p>
                <p className="mt-3 text-sm leading-7 text-white/75">
                  Promote configs between local and CI without rewriting route
                  logic or modifying consumer clients.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="platform"
          eyebrow="Platform"
          title="Engineered for secure, reliable delivery."
          description="Structured controls for teams that need confidence across security, speed, and deployment consistency."
        >
          <div className="grid gap-5 md:grid-cols-3">
            {platformBlocks.map((block) => (
              <Card key={block.title} className="bg-white">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">
                  {block.title}
                </p>
                <p className="mt-4 text-[15px] leading-7 text-[var(--muted)]">
                  {block.text}
                </p>
              </Card>
            ))}
          </div>
        </Section>
      </main>

      <footer className="border-t border-[var(--line)] py-10">
        <Container className="flex flex-col gap-4 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>FexAPI</p>
          <div className="flex items-center gap-6">
            <a
              className="transition-colors hover:text-[var(--foreground)]"
              href="#features"
            >
              Features
            </a>
            <a
              className="transition-colors hover:text-[var(--foreground)]"
              href="#usage"
            >
              Usage
            </a>
            <a
              className="transition-colors hover:text-[var(--foreground)]"
              href="#platform"
            >
              Platform
            </a>
          </div>
        </Container>
      </footer>
    </div>
  );
}
