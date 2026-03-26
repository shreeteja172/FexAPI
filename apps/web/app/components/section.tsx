import { ReactNode } from "react";

type SectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="docSection">
      <h2>{title}</h2>
      <div className="sectionContent">{children}</div>
    </section>
  );
}
