"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const initialTheme: Theme =
      savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    applyTheme(initialTheme);
    setTheme(initialTheme);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      aria-label={
        mounted && theme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      title={mounted && theme === "dark" ? "Light mode" : "Dark mode"}
      onClick={toggleTheme}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--fx-border)] bg-[color:var(--fx-surface-solid)] text-[var(--fx-text-2)] shadow-[0_10px_22px_-18px_rgba(21,43,76,0.7)] transition-all duration-200 hover:-translate-y-[1px] hover:border-[var(--fx-brand-1)] hover:text-[var(--fx-brand-1)]"
    >
      <span className="text-[1rem] leading-none" aria-hidden="true">
        {mounted && theme === "dark" ? "☀" : "☾"}
      </span>
    </button>
  );
}
