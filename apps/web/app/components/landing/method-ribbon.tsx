import { landingMethods } from "./data";

export function MethodRibbon() {
  return (
    <section className="border-y border-[var(--fx-border)] bg-[linear-gradient(120deg,rgba(34,211,238,0.1),rgba(249,115,22,0.08),var(--fx-surface))]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-2 px-5 py-3 max-[640px]:justify-start">
        <p className="m-0 mr-2 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[var(--fx-text-2)]">
          Route Support
        </p>
        {landingMethods.map((method) => (
          <span
            key={method}
            className="rounded-full border border-[var(--fx-border)] bg-[var(--fx-surface)] px-[11px] py-[4px] text-[0.67rem] font-semibold uppercase tracking-[0.08em] text-[var(--fx-text-2)]"
          >
            {method}
          </span>
        ))}
      </div>
    </section>
  );
}
