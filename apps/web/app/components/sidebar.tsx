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
    <aside className="sidebar" aria-label="Documentation navigation">
      {groups.map((group) => (
        <section key={group.title} className="sidebarGroup">
          <h2>{group.title}</h2>
          <ul>
            {group.items.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </aside>
  );
}
