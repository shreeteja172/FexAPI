import { landingProcessSteps } from "./data";

export function ProcessStrip() {
  return (
    <section className="border-y border-[var(--fx-border)] bg-[linear-gradient(180deg,var(--fx-bg-soft),var(--fx-surface))] py-[48px] sm:py-[56px]">
      <div className="mx-auto max-w-[1200px] px-5">
        <p className="m-0 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[var(--fx-text-2)]">
          Workflow
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {landingProcessSteps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-xl border border-[var(--fx-border)] bg-[var(--fx-surface)] p-4"
            >
              <p className="m-0 text-[0.67rem] font-semibold uppercase tracking-[0.1em] text-[var(--fx-text-3)]">
                Step {index + 1}
              </p>
              <h3 className="m-0 mt-[6px] text-[0.95rem] text-[var(--fx-text-1)] sm:text-[0.97rem]">
                {step.title}
              </h3>
              <p className="m-0 mt-[6px] text-[0.86rem] leading-[1.66] text-[var(--fx-text-2)] sm:text-[0.88rem]">
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
