import DefaultTheme from "vitepress/theme";
import { EnhanceAppContext, inBrowser } from "vitepress";
import { h } from "vue";
import PackageManagerPreference from "./components/PackageManagerPreference.vue";
import "./custom.css";

const TOP_LEVEL_SELECTOR = ".VPSidebar .VPSidebarItem.level-0.collapsible";
const PACKAGE_MANAGER_KEY = "fexapi.docs.packageManager";
const PACKAGE_MANAGERS = ["npm", "pnpm", "bun", "yarn"] as const;

type PackageManager = (typeof PACKAGE_MANAGERS)[number];

const PACKAGE_MANAGER_ALIASES: Record<PackageManager, string[]> = {
  npm: ["npm", "npx"],
  pnpm: ["pnpm", "pnpm dlx"],
  bun: ["bun", "bunx"],
  yarn: ["yarn", "yarn dlx"],
};

function normalizePackageManager(value: string | null): PackageManager {
  if (value && PACKAGE_MANAGERS.includes(value as PackageManager)) {
    return value as PackageManager;
  }

  return "npm";
}

function getPreferredPackageManager(): PackageManager {
  return normalizePackageManager(
    window.localStorage.getItem(PACKAGE_MANAGER_KEY),
  );
}

function getCodeGroupTabTitle(label: HTMLLabelElement) {
  return (
    label.getAttribute("data-title")?.trim().toLowerCase() ??
    label.textContent?.trim().toLowerCase() ??
    ""
  );
}

function applyPackageManagerToCodeGroups() {
  const preferred = getPreferredPackageManager();
  const aliases = new Set(PACKAGE_MANAGER_ALIASES[preferred]);
  const codeGroups = document.querySelectorAll<HTMLElement>(".vp-code-group");
  const currentScrollY = window.scrollY;

  codeGroups.forEach((group) => {
    const labels = Array.from(
      group.querySelectorAll<HTMLLabelElement>(".tabs label"),
    );
    const matchingLabel = labels.find((label) =>
      aliases.has(getCodeGroupTabTitle(label)),
    );

    if (!matchingLabel) {
      return;
    }

    const forId = matchingLabel.getAttribute("for");
    if (!forId) {
      return;
    }

    const input = group.querySelector<HTMLInputElement>(
      `input#${CSS.escape(forId)}`,
    );

    if (!input || input.checked) {
      return;
    }

    // Switch code tabs without simulating a click to avoid viewport jumps.
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });

  if (window.scrollY !== currentScrollY) {
    window.scrollTo({ top: currentScrollY, left: 0, behavior: "auto" });
  }
}

function getTopLevelGroups() {
  return Array.from(document.querySelectorAll<HTMLElement>(TOP_LEVEL_SELECTOR));
}

function getCaret(group: HTMLElement) {
  return group.querySelector<HTMLElement>(":scope > .item > .caret");
}

function getActiveGroup() {
  const groups = getTopLevelGroups();
  return (
    groups.find((group) =>
      Boolean(
        group.querySelector(
          ".VPSidebarLink.active, .VPSidebarItem.is-active, a[aria-current='page']",
        ),
      ),
    ) ?? null
  );
}

function openGroup(group: HTMLElement) {
  if (!group.classList.contains("collapsed")) {
    return;
  }

  getCaret(group)?.click();
}

function ensureActiveGroupOpen() {
  const activeGroup = getActiveGroup();
  if (!activeGroup) {
    return;
  }

  openGroup(activeGroup);
}

export default {
  ...DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      "sidebar-nav-before": () =>
        h(PackageManagerPreference, {
          variant: "sidebar",
        }),
      "nav-screen-content-before": () =>
        h(PackageManagerPreference, {
          variant: "mobile",
        }),
    }),
  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp?.(ctx);

    if (!inBrowser) {
      return;
    }

    const scrollToTop = () => {
      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    };

    const scheduleScrollReset = () => {
      if (window.location.hash) {
        return;
      }

      scrollToTop();
      window.setTimeout(scrollToTop, 0);
      window.setTimeout(scrollToTop, 120);
      window.setTimeout(scrollToTop, 300);
    };

    // Prevent stale browser-restored scroll positions from hiding page content.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    requestAnimationFrame(scheduleScrollReset);

    // Keep the section for the active route open after hydration.
    window.setTimeout(ensureActiveGroupOpen, 0);

    const previousAfterRouteChanged = ctx.router.onAfterRouteChanged;
    ctx.router.onAfterRouteChanged = (to) => {
      previousAfterRouteChanged?.(to);
      if (!to.includes("#")) {
        requestAnimationFrame(scheduleScrollReset);
      }

      window.setTimeout(() => {
        ensureActiveGroupOpen();
        applyPackageManagerToCodeGroups();
      }, 0);
    };

    window.addEventListener("pageshow", scheduleScrollReset);
    window.addEventListener("load", scheduleScrollReset);
    const handlePackageManagerChange = () => {
      applyPackageManagerToCodeGroups();
    };
    window.addEventListener(
      "fexapi:package-manager-change",
      handlePackageManagerChange,
    );

    window.setTimeout(applyPackageManagerToCodeGroups, 0);

    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        window.removeEventListener("pageshow", scheduleScrollReset);
        window.removeEventListener("load", scheduleScrollReset);
        window.removeEventListener(
          "fexapi:package-manager-change",
          handlePackageManagerChange,
        );
      });
    }
  },
};
