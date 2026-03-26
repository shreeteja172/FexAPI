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
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur-xl">
      <Container className="flex h-[74px] items-center justify-between gap-4">
        <a className="flex items-center gap-3" href="#">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] bg-[#111216] text-xs font-semibold tracking-[0.02em] text-white">
            FX
          </span>
          <span className="flex items-baseline gap-2">
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
              {productName}
            </span>
            <span className="text-xs font-medium text-[var(--muted)]">
              {productTag}
            </span>
          </span>
        </a>

        <nav
          className="hidden items-center gap-1 rounded-xl border border-[var(--line)] bg-[#f7f8fa] p-1 lg:flex"
          aria-label="Primary"
        >
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--muted)] transition-all duration-200 hover:bg-white hover:text-[var(--foreground)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={secondaryAction.href}
            target={isExternalSecondary ? "_blank" : undefined}
            rel={isExternalSecondary ? "noreferrer" : undefined}
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] transition-colors duration-200 hover:text-[var(--foreground)] sm:inline-flex"
          >
            {secondaryAction.label}
          </a>
          <a
            href={primaryAction.href}
            className="inline-flex rounded-xl border border-[#111216] bg-[#111216] px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-black"
          >
            {primaryAction.label}
          </a>
        </div>
      </Container>
    </header>
  );
}
