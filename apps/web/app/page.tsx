import { Card } from "./components/card";
import { CodeBlock } from "./components/code-block";
import { Container } from "./components/container";
import { Navbar } from "./components/navbar";
import { Section } from "./components/section";
import { UsageStackShowcase } from "./components/usage-stack-showcase";

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
        <section className="border-b border-[var(--line)] bg-[#07090d] py-20 text-white sm:py-28">
          <Container>
            <div className="mx-auto max-w-4xl text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Open Source CLI Tool
              </div>

              <h1 className="mt-8 text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-6xl">
                Mock APIs for
                <span className="block text-[#8a98ff]">
                  frontend developers.
                </span>
              </h1>

              <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-white/65 sm:text-[28px] sm:leading-10">
                Define your endpoints in a schema file. Run one command. Get a
                local server with realistic fake data powered by Faker.js.
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#usage"
                  className="inline-flex items-center rounded-xl bg-[#8a98ff] px-8 py-3 text-base font-semibold text-[#0c1021] transition-colors duration-200 hover:bg-[#a0abff]"
                >
                  Get Started
                </a>
                <a
                  href={docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-8 py-3 text-base font-semibold text-white/85 transition-colors duration-200 hover:bg-white/10"
                >
                  View Docs
                </a>
              </div>

              <div className="mt-14 overflow-hidden rounded-2xl border border-white/10 bg-[#06080d] text-left shadow-[0_30px_80px_-45px_rgba(0,0,0,0.9)]">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  </div>
                  <span className="text-sm font-medium text-white/45">
                    terminal
                  </span>
                  <span className="w-14" />
                </div>
                <div className="space-y-3 px-6 py-6 font-mono text-base leading-8 text-white/75">
                  <p>
                    <span className="text-white/45">$</span>{" "}
                    <span className="font-semibold text-white/95">
                      npx fexapi init
                    </span>
                  </p>
                  <p>
                    <span className="text-white/50">?</span> What port should
                    the server run on?{" "}
                    <span className="text-white/40">4000</span>
                  </p>
                  <p>
                    <span className="text-white/50">?</span> Enable CORS?{" "}
                    <span className="font-semibold text-emerald-400">Yes</span>
                  </p>
                  <p>
                    <span className="text-white/50">?</span> Generate sample
                    schemas?{" "}
                    <span className="font-semibold text-emerald-400">Yes</span>
                  </p>
                  <p className="pt-2">
                    <span className="font-semibold text-emerald-400">✓</span>{" "}
                    Created fexapi/schema.fexapi
                  </p>
                  <p>
                    <span className="font-semibold text-emerald-400">✓</span>{" "}
                    Created schemas/user.yaml
                  </p>
                  <p className="pt-2">
                    <span className="text-white/45">$</span>{" "}
                    <span className="font-semibold text-white/95">
                      npx fexapi dev --watch
                    </span>
                  </p>
                  <p>
                    Mock API running at{" "}
                    <span className="font-semibold text-[#8a98ff]">
                      http://localhost:4000
                    </span>
                  </p>
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
          title="Use FexAPI across your stack."
          description="Run one mock server and plug it into React, Next.js, Express, Vue, or any client that speaks HTTP."
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

            <UsageStackShowcase />
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
