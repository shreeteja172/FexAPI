import { landingFeatures } from "./data";

export function FeatureGrid() {
  return (
    <section className="py-[74px] max-[640px]:py-[58px]">
      <div className="mx-auto max-w-[1200px] px-5">
        <header className="max-w-[740px]">
          <p className="m-0 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[var(--fx-brand-1)]">
            Why teams choose FexAPI
          </p>
          <h2 className="m-0 mt-[10px] font-[family-name:var(--font-slabo)] text-[clamp(1.6rem,3.5vw,2.6rem)] tracking-[-0.02em] text-[var(--fx-text-1)]">
            Focused mock infrastructure without fake complexity.
          </h2>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {landingFeatures.map((feature) => (
            <article
              key={feature.title}
              className="grid gap-2 rounded-2xl border border-[var(--fx-border)] bg-[var(--fx-surface)] p-5 shadow-[0_14px_35px_-28px_rgba(17,33,57,0.65)]"
            >
              <h3 className="m-0 text-[1rem] tracking-[-0.01em] text-[var(--fx-text-1)]">
                {feature.title}
              </h3>
              <p className="m-0 text-[0.95rem] leading-[1.72] text-[var(--fx-text-2)]">
                {feature.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
