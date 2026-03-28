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
  {
    label: "Features",
    href: `${process.env.NEXT_PUBLIC_DOCS_URL ?? "http://localhost:5173"}/getting-started/introduction`,
  },
  {
    label: "Usage",
    href: `${process.env.NEXT_PUBLIC_DOCS_URL ?? "http://localhost:5173"}/getting-started/quick-start`,
  },
  {
    label: "Platform",
    href: `${process.env.NEXT_PUBLIC_DOCS_URL ?? "http://localhost:5173"}/contributing/setup`,
  },
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
        primaryAction={{
          label: "Start Building",
          href: `${docsUrl}/getting-started/installation`,
        }}
      />

      <main>
        <section className="border-b border-[#1d222c] bg-[#0b0e14] py-24 text-white sm:py-32">
          <Container>
            <div className="mx-auto max-w-4xl text-center">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#111723] px-4 py-2 text-sm font-medium text-white/70">
                <span className="h-2 w-2 rounded-full bg-[#8ea0ff]" />
                Open Source CLI Tool
              </div>

              <h1 className="mt-10 font-[family-name:var(--font-slabo)] text-5xl leading-[1.02] tracking-[-0.02em] sm:text-7xl">
                Mock APIs for
                <span className="block text-[#8ea0ff]">
                  frontend developers.
                </span>
              </h1>

              <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-white/70 sm:text-2xl sm:leading-10">
                Define your endpoints in a schema file. Run one command. Get a
                local server with realistic fake data powered by Faker.js.
              </p>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={`${docsUrl}/getting-started/quick-start`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-xl border border-[#8ea0ff] bg-[#8ea0ff] px-8 py-3 text-base font-semibold text-[#0b1020] transition-colors duration-200 hover:bg-[#a4b2ff]"
                >
                  Get Started
                </a>
                <a
                  href={docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-xl border border-white/15 bg-transparent px-8 py-3 text-base font-semibold text-white/85 transition-colors duration-200 hover:border-white/30 hover:bg-white/5"
                >
                  View Docs
                </a>
              </div>

              <div className="mt-16 overflow-hidden rounded-2xl border border-white/10 bg-[#090d15] text-left shadow-[0_36px_72px_-44px_rgba(0,0,0,0.88)]">
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
                    <span className="font-semibold text-[#8ea0ff]">
                      http://localhost:4000
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <section className="border-b border-[var(--line)] bg-white py-9">
          <Container className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-semibold tracking-[0.02em] text-[#7b828f] sm:justify-between">
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
          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title}>
                <h3 className="font-[family-name:var(--font-slabo)] text-3xl leading-tight text-[var(--foreground)]">
                  {feature.title}
                </h3>
                <p className="mt-4 text-[15px] leading-8 text-[var(--muted)]">
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
          className="border-y border-[var(--line)] bg-[#0a0d14] text-white"
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
          <div className="grid gap-6 md:grid-cols-3">
            {platformBlocks.map((block) => (
              <Card key={block.title} className="bg-white">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">
                  {block.title}
                </p>
                <p className="mt-4 text-[15px] leading-8 text-[var(--muted)]">
                  {block.text}
                </p>
              </Card>
            ))}
          </div>
        </Section>
      </main>

      <footer className="border-t border-[var(--line)] bg-white py-12">
        <Container className="flex flex-col gap-4 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-[family-name:var(--font-slabo)] text-2xl leading-none text-[var(--foreground)]">
            FexAPI
          </p>
          <div className="flex items-center gap-6">
            <a
              className="transition-colors hover:text-[var(--foreground)]"
              href={`${docsUrl}/getting-started/introduction`}
              target="_blank"
              rel="noreferrer"
            >
              Features
            </a>
            <a
              className="transition-colors hover:text-[var(--foreground)]"
              href={`${docsUrl}/getting-started/quick-start`}
              target="_blank"
              rel="noreferrer"
            >
              Usage
            </a>
            <a
              className="transition-colors hover:text-[var(--foreground)]"
              href={`${docsUrl}/contributing/setup`}
              target="_blank"
              rel="noreferrer"
            >
              Platform
            </a>
          </div>
        </Container>
      </footer>
    </div>
  );
}
