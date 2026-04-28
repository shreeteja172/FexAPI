import { landingStats } from "./data";

type HeroSectionProps = {
  docsUrl: string;
};

type TerminalTone = "command" | "question" | "info" | "success";

const terminalPhases = [
  {
    label: "Bootstrap",
    lines: [
      { text: "$ fexapi init", tone: "command" as TerminalTone },
      {
        text: "? What port? (default: 4000) 4000",
        tone: "question" as TerminalTone,
      },
      { text: "? Enable CORS? Yes", tone: "question" as TerminalTone },
      {
        text: "ok Created fexapi/schema.fexapi",
        tone: "success" as TerminalTone,
      },
      { text: "ok Created fexapi.config.js", tone: "success" as TerminalTone },
    ],
  },
  {
    label: "Compile",
    lines: [
      { text: "$ fexapi generate", tone: "command" as TerminalTone },
      {
        text: "ok Generate complete (changed)",
        tone: "success" as TerminalTone,
      },
    ],
  },
  {
    label: "Live Watch",
    lines: [
      { text: "$ fexapi dev --watch --log", tone: "command" as TerminalTone },
      {
        text: "info [watch] change detected (schema.fexapi changed)",
        tone: "info" as TerminalTone,
      },
      {
        text: "info [watch] regenerating generated.api.json from schema changes...",
        tone: "info" as TerminalTone,
      },
      { text: "ok [watch] server reloaded", tone: "success" as TerminalTone },
    ],
  },
];

function lineToneClass(tone: TerminalTone) {
  if (tone === "command") {
    return "text-[#dbe5fa]";
  }

  if (tone === "question") {
    return "text-[#9bb0cf]";
  }

  if (tone === "success") {
    return "text-[#6df2b6]";
  }

  return "text-[#9bb0cf]";
}

export function HeroSection({ docsUrl }: HeroSectionProps) {
  return (
    <section className="py-[72px] pb-[42px] sm:py-[96px] sm:pb-[52px]">
      <div className="grid items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="pt-0 sm:pt-[10px]">
          <p className="m-0 text-[0.74rem] font-bold uppercase tracking-[0.12em] text-[var(--fx-brand-1)]">
            Open Source Mock API Runtime
          </p>
          <h1 className="m-0 mt-[14px] max-w-[13ch] font-[family-name:var(--font-slabo)] text-[clamp(2rem,8.2vw,4.85rem)] leading-[0.96] tracking-[-0.03em] text-[var(--fx-text-1)] lg:max-w-[17ch]">
            Build frontend flows before backend delivery.
          </h1>
          <p className="m-0 mt-[16px] max-w-[56ch] text-[0.98rem] leading-[1.75] text-[var(--fx-text-2)] sm:text-[1.01rem]">
            FexAPI gives your team a schema-first local API with real data
            shape, clear watch feedback, and no artifact clutter.
          </p>

          <div className="mt-[22px] flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={`${docsUrl}/getting-started/quick-start`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-transparent bg-[linear-gradient(120deg,var(--fx-brand-1),var(--fx-brand-2),var(--fx-orange))] px-[18px] text-[0.92rem] font-bold text-[#03131d] transition-transform duration-150 hover:-translate-y-[1px] sm:w-auto"
            >
              Start in 2 Minutes
            </a>
            <a
              href={`${docsUrl}/cli/overview`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[var(--fx-border)] bg-[var(--fx-surface)] px-[18px] text-[0.92rem] font-bold text-[var(--fx-text-2)] transition-all duration-150 hover:-translate-y-[1px] hover:border-[var(--fx-brand-1)] sm:w-auto"
            >
              Explore CLI
            </a>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-[10px] sm:grid-cols-2 lg:grid-cols-3">
            {landingStats.map((stat) => (
              <article
                key={stat.label}
                className="grid gap-1 rounded-xl border border-[var(--fx-border)] bg-[var(--fx-surface)] p-3"
              >
                <p className="m-0 text-[0.73rem] uppercase tracking-[0.07em] text-[var(--fx-text-3)]">
                  {stat.label}
                </p>
                <strong className="text-[0.94rem] tracking-[-0.01em] text-[var(--fx-text-1)]">
                  {stat.value}
                </strong>
              </article>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-[#1b2b49] bg-[linear-gradient(180deg,#091324_0%,#040a14_100%)] shadow-[0_32px_70px_-42px_rgba(4,10,24,0.98)] lg:max-w-[780px]">
          <div className="flex min-h-11 items-center justify-between gap-2 border-b border-[#1a2a45] px-[14px]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[rgba(207,218,239,0.42)]" />
              <span className="h-2 w-2 rounded-full bg-[rgba(207,218,239,0.42)]" />
              <span className="h-2 w-2 rounded-full bg-[rgba(207,218,239,0.42)]" />
              <p className="m-0 ml-2 text-[0.75rem] uppercase tracking-[0.06em] text-[#95a8c8]">
                fexapi-session
              </p>
            </div>
            <span className="rounded-full border border-[#25436d] bg-[rgba(24,45,76,0.42)] px-2.5 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.08em] text-[#7dc2ff]">
              live preview
            </span>
          </div>

          <div className="grid gap-3 p-4 max-[640px]:p-3">
            {terminalPhases.map((phase, phaseIndex) => (
              <section
                key={phase.label}
                className="rounded-xl border border-[#172741] bg-[rgba(7,15,28,0.78)] p-3"
              >
                <p className="m-0 mb-2 text-[0.67rem] font-semibold uppercase tracking-[0.11em] text-[#7f95b9]">
                  {phaseIndex + 1}. {phase.label}
                </p>
                <div className="grid gap-[7px]">
                  {phase.lines.map((line) => (
                    <p
                      key={line.text}
                      className={`m-0 font-[family-name:var(--font-geist-mono)] text-[0.8rem] leading-[1.56] ${lineToneClass(line.tone)} max-[640px]:text-[0.73rem]`}
                    >
                      {line.text.startsWith("$") ? (
                        <>
                          <span className="text-[#7f95b9]">$</span>
                          {line.text.slice(1)}
                        </>
                      ) : (
                        line.text
                      )}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            <div className="rounded-xl border border-[#1b3358] bg-[linear-gradient(90deg,rgba(20,42,76,0.42),rgba(27,66,96,0.24))] px-3 py-2 text-[0.73rem] font-medium text-[#98b5da]">
              Tip: keep this terminal open while editing schema.fexapi to watch
              live regeneration and instant server reloads.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
