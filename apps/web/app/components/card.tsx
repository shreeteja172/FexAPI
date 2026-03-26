import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <article
      className={`rounded-2xl border border-[var(--line)] bg-[#fafafb] p-6 ${className}`}
    >
      {children}
    </article>
  );
}
