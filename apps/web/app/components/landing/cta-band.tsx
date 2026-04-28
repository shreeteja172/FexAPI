type CtaBandProps = {
  docsUrl: string;
};

export function CtaBand({ docsUrl }: CtaBandProps) {
  return (
    <section className="py-[76px] max-[640px]:py-[58px]">
      <div className="mx-auto max-w-[980px] px-5">
        <div className="grid gap-4 rounded-[24px] border border-[var(--fx-border)] bg-[radial-gradient(420px_180px_at_100%_0%,rgba(249,115,22,0.18),transparent_72%),linear-gradient(145deg,var(--fx-bg-soft),var(--fx-surface-solid))] p-5 shadow-[0_25px_55px_-35px_rgba(5,10,18,0.95)] sm:p-8">
          <p className="m-0 text-[0.72rem] font-bold uppercase tracking-[0.11em] text-[var(--fx-brand-1)]">
            Ready To Ship Faster
          </p>
          <h2 className="m-0 font-[family-name:var(--font-slabo)] text-[clamp(1.5rem,4vw,2.45rem)] tracking-[-0.02em] text-[var(--fx-text-1)]">
            Put a stable local API in front of every feature branch.
          </h2>
          <p className="m-0 max-w-[60ch] text-[0.95rem] leading-[1.72] text-[var(--fx-text-2)]">
            Keep your frontend release cadence moving while backend contracts
            evolve. FexAPI keeps schema edits and mock responses synchronized.
          </p>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
            <a
              href={`${docsUrl}/getting-started/installation`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-transparent bg-[linear-gradient(120deg,var(--fx-brand-1),var(--fx-brand-2),var(--fx-orange))] px-[18px] text-[0.9rem] font-bold text-[#03131d] sm:w-auto"
            >
              Install & Run
            </a>
            <a
              href={`${docsUrl}/advanced/troubleshooting`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[var(--fx-border)] bg-[var(--fx-surface)] px-[18px] text-[0.9rem] font-bold text-[var(--fx-text-2)] sm:w-auto"
            >
              Troubleshooting Guide
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
