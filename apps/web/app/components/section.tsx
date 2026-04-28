import { ReactNode } from "react";
import { Container } from "./container";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className = "",
}: SectionProps) {
  return (
    <section id={id} className={`py-16 sm:py-24 lg:py-28 ${className}`}>
      <Container>
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="font-[family-name:var(--font-slabo)] text-[2rem] leading-tight tracking-[-0.02em] text-[var(--foreground)] sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 text-[var(--muted)] sm:mt-5 sm:text-base sm:leading-8">
              {description}
            </p>
          ) : null}
        </div>
        <div className="mt-8 sm:mt-12">{children}</div>
      </Container>
    </section>
  );
}
