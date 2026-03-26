import { Container } from "./container";

type NavItem = {
  label: string;
  href: string;
};

type NavbarProps = {
  productName: string;
  productTag: string;
  items: NavItem[];
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction: {
    label: string;
    href: string;
  };
};

export function Navbar({
  productName,
  productTag,
  items,
  primaryAction,
  secondaryAction,
}: NavbarProps) {
  const isExternalSecondary = secondaryAction.href.startsWith("http");

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(247,247,248,0.94)] backdrop-blur-xl">
      <Container className="flex h-[78px] items-center justify-between gap-6">
        <a className="flex items-center gap-3" href="#">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#cfd4de] bg-[#101216] text-xs font-semibold tracking-[0.04em] text-white">
            FX
          </span>
          <span className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-slabo)] text-[27px] leading-none text-[var(--foreground)]">
              {productName}
            </span>
            <span className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
              {productTag}
            </span>
          </span>
        </a>

        <nav
          className="hidden items-center gap-1 rounded-xl border border-[var(--line)] bg-white p-1 lg:flex"
          aria-label="Primary"
        >
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--muted)] transition-all duration-200 hover:bg-[#f2f3f7] hover:text-[var(--foreground)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href={secondaryAction.href}
            target={isExternalSecondary ? "_blank" : undefined}
            rel={isExternalSecondary ? "noreferrer" : undefined}
            className="hidden rounded-lg border border-transparent px-3.5 py-2 text-sm font-medium text-[var(--muted)] transition-colors duration-200 hover:border-[var(--line)] hover:bg-white hover:text-[var(--foreground)] sm:inline-flex"
          >
            {secondaryAction.label}
          </a>
          <a
            href={primaryAction.href}
            className="inline-flex rounded-xl border border-[#101216] bg-[#101216] px-4.5 py-2 text-sm font-medium text-white shadow-[0_10px_20px_-14px_rgba(16,18,22,0.9)] transition-colors duration-200 hover:bg-[#1a1d24]"
          >
            {primaryAction.label}
          </a>
        </div>
      </Container>
    </header>
  );
}
