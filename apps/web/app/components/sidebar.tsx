type SidebarItem = {
  label: string;
  href: string;
};

type SidebarGroup = {
  title: string;
  items: SidebarItem[];
};

type SidebarProps = {
  groups: SidebarGroup[];
};

export function Sidebar({ groups }: SidebarProps) {
  return (
    <aside
      className="grid gap-4 rounded-2xl border border-[var(--line)] bg-white p-4 shadow-[0_14px_32px_-24px_rgba(16,17,20,0.22)] sm:sticky sm:top-24 sm:p-5"
      aria-label="Documentation navigation"
    >
      {groups.map((group) => (
        <section key={group.title} className="grid gap-3">
          <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            {group.title}
          </h2>
          <ul className="grid gap-1.5">
            {group.items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block rounded-xl px-3 py-2 text-sm text-[var(--foreground)] transition-colors duration-200 hover:bg-black/5 hover:text-black sm:text-[0.92rem]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </aside>
  );
}
