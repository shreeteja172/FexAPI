import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <article
      className={`rounded-2xl border border-[var(--line)] bg-white p-7 shadow-[0_14px_32px_-24px_rgba(16,17,20,0.28)] transition-shadow duration-200 hover:shadow-[0_20px_40px_-26px_rgba(16,17,20,0.34)] ${className}`}
    >
      {children}
    </article>
  );
}
