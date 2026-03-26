import { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function Button({ href, children, variant = "primary" }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium tracking-[-0.01em] transition-colors duration-200";
  const styles =
    variant === "primary"
      ? "bg-[var(--foreground)] text-white hover:bg-black"
      : "border border-[var(--line-dark)] bg-white/0 text-white hover:border-white/35 hover:bg-white/5";

  return (
    <a className={`${base} ${styles}`} href={href}>
      {children}
    </a>
  );
}
