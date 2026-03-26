type NavItem = {
  label: string;
  href: string;
};

type NavbarProps = {
  title: string;
  items: NavItem[];
};

export function Navbar({ title, items }: NavbarProps) {
  return (
    <header className="topbar">
      <div className="topbarInner">
        <a className="brand" href="#top">
          {title}
        </a>
        <nav className="topnav" aria-label="Primary">
          {items.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
