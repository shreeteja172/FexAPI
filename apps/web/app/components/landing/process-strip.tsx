import { landingProcessSteps } from "./data";

export function ProcessStrip() {
  return (
    <section className="border-y border-[var(--fx-border)] bg-[linear-gradient(180deg,var(--fx-bg-soft),var(--fx-surface))] py-[56px] max-[640px]:py-[46px]">
      <div className="mx-auto max-w-[1200px] px-5">
        <p className="m-0 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[var(--fx-text-2)]">
          Workflow
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {landingProcessSteps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-xl border border-[var(--fx-border)] bg-[var(--fx-surface)] p-4"
            >
              <p className="m-0 text-[0.67rem] font-semibold uppercase tracking-[0.1em] text-[var(--fx-text-3)]">
                Step {index + 1}
              </p>
              <h3 className="m-0 mt-[6px] text-[0.97rem] text-[var(--fx-text-1)]">
                {step.title}
              </h3>
              <p className="m-0 mt-[6px] text-[0.88rem] leading-[1.66] text-[var(--fx-text-2)]">
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
