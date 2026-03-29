import { Container } from "./container";
import { ThemeToggle } from "./theme-toggle";

type NavItem = {
  label: string;
  href: string;
};

type NavbarProps = {
  productName: string;
  productTag: string;
  items?: NavItem[];
  docsAction: {
    label: string;
    href: string;
  };
  githubHref?: string;
};

export function Navbar({
  productName,
  productTag,
  items = [],
  docsAction,
  githubHref,
}: NavbarProps) {
  const isExternalDocs = docsAction.href.startsWith("http");
  const hasGithub = Boolean(githubHref);

  return (
    <header className="sticky top-0 z-50 py-3">
      <Container>
        <div className="flex items-center justify-between gap-4 rounded-[18px] border border-[var(--fx-border)] bg-[color:var(--fx-surface)] px-4 py-3 shadow-[0_18px_38px_-28px_rgba(9,18,36,0.75)] backdrop-blur-xl">
          <a
            className="flex items-center gap-3"
            href="/"
            aria-label="Go to homepage"
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#2b4367] bg-[linear-gradient(150deg,#0b1424,#101f36)] text-xs font-semibold tracking-[0.08em] text-[#f4f8ff] shadow-[0_12px_26px_-16px_rgba(5,12,22,0.95)]">
              FX
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-[#11243e] bg-[linear-gradient(145deg,var(--fx-brand-2),var(--fx-orange))]" />
            </span>
            <span className="flex items-end gap-2">
              <span className="font-[family-name:var(--font-slabo)] text-[1.95rem] leading-none tracking-[-0.02em] text-[var(--fx-text-1)]">
                {productName}
              </span>
              <span className="mb-[4px] rounded-full border border-[var(--fx-border)] bg-[color:var(--fx-surface-solid)] px-2.5 py-1 text-[0.63rem] font-semibold uppercase tracking-[0.12em] text-[var(--fx-text-3)] max-[920px]:hidden">
                {productTag}
              </span>
            </span>
          </a>

          {items.length > 0 ? (
            <nav
              className="hidden items-center gap-1 rounded-2xl border border-[var(--fx-border)] bg-[color:var(--fx-surface-solid)] p-1.5 shadow-[0_12px_30px_-24px_rgba(20,42,73,0.7)] lg:flex"
              aria-label="Primary"
            >
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-2 text-[0.92rem] font-semibold text-[var(--fx-text-2)] transition-all duration-200 hover:bg-[color:var(--fx-surface)] hover:text-[var(--fx-text-1)]"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          ) : null}

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {hasGithub ? (
              <a
                href={githubHref}
                target="_blank"
                rel="noreferrer"
                aria-label="Open GitHub repository"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--fx-border)] bg-[color:var(--fx-surface-solid)] text-[var(--fx-text-2)] shadow-[0_10px_22px_-18px_rgba(21,43,76,0.7)] transition-all duration-200 hover:-translate-y-[1px] hover:border-[var(--fx-brand-1)] hover:text-[var(--fx-brand-1)]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-[1.08rem] w-[1.08rem]"
                  aria-hidden="true"
                >
                  <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.54-1.37-1.33-1.73-1.33-1.73-1.09-.74.08-.73.08-.73 1.2.08 1.83 1.23 1.83 1.23 1.08 1.84 2.82 1.31 3.51 1 .11-.78.42-1.31.76-1.61-2.67-.31-5.47-1.34-5.47-5.94 0-1.31.47-2.39 1.23-3.23-.12-.3-.53-1.53.12-3.19 0 0 1.01-.32 3.31 1.23a11.4 11.4 0 0 1 6.03 0c2.3-1.55 3.31-1.23 3.31-1.23.65 1.66.24 2.89.12 3.19.77.84 1.23 1.92 1.23 3.23 0 4.61-2.81 5.63-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
                </svg>
              </a>
            ) : null}
            <a
              href={docsAction.href}
              target={isExternalDocs ? "_blank" : undefined}
              rel={isExternalDocs ? "noreferrer" : undefined}
              className="inline-flex min-h-11 items-center gap-1 rounded-full border border-transparent bg-[linear-gradient(120deg,var(--fx-brand-1),var(--fx-brand-2),var(--fx-orange))] px-4 text-[0.9rem] font-bold text-[#03131d] shadow-[0_12px_24px_-18px_rgba(5,12,22,0.9)] transition-all duration-200 hover:-translate-y-[1px] hover:saturate-110"
            >
              {docsAction.label}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
}
