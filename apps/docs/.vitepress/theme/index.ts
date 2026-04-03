import DefaultTheme from "vitepress/theme";
import { EnhanceAppContext, inBrowser } from "vitepress";
import "./custom.css";

const TOP_LEVEL_SELECTOR = ".VPSidebar .VPSidebarItem.level-0.collapsible";

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

      window.setTimeout(ensureActiveGroupOpen, 0);
    };

    window.addEventListener("pageshow", scheduleScrollReset);
    window.addEventListener("load", scheduleScrollReset);

    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        window.removeEventListener("pageshow", scheduleScrollReset);
        window.removeEventListener("load", scheduleScrollReset);
      });
    }
  },
};
