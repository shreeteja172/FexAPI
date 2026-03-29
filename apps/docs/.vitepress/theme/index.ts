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

function closeGroup(group: HTMLElement) {
  if (group.classList.contains("collapsed")) {
    return;
  }

  getCaret(group)?.click();
}

function openGroup(group: HTMLElement) {
  if (!group.classList.contains("collapsed")) {
    return;
  }

  getCaret(group)?.click();
}

function enforceSingleOpen(activeGroup?: HTMLElement | null) {
  const groups = getTopLevelGroups();
  if (groups.length === 0) {
    return;
  }

  const openGroups = groups.filter(
    (group) => !group.classList.contains("collapsed"),
  );

  let target = activeGroup ?? null;
  if (!target || !groups.includes(target)) {
    target = openGroups[0] ?? groups[0];
  }

  for (const group of groups) {
    if (group !== target) {
      closeGroup(group);
    }
  }

  openGroup(target);
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

    const bindSidebarAccordion = () => {
      const onSidebarToggle = (event: Event) => {
        const target = event.target as HTMLElement | null;
        const group = target?.closest<HTMLElement>(TOP_LEVEL_SELECTOR) ?? null;

        window.setTimeout(() => {
          enforceSingleOpen(group);
        }, 0);
      };

      const onSidebarEnter = (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          onSidebarToggle(event);
        }
      };

      document.addEventListener("click", onSidebarToggle);
      document.addEventListener("keydown", onSidebarEnter);

      // Keep one section open after hydration and route transitions.
      window.setTimeout(() => enforceSingleOpen(), 0);

      return () => {
        document.removeEventListener("click", onSidebarToggle);
        document.removeEventListener("keydown", onSidebarEnter);
      };
    };

    const unbindAccordion = bindSidebarAccordion();

    const previousAfterRouteChanged = ctx.router.onAfterRouteChanged;
    ctx.router.onAfterRouteChanged = (to) => {
      previousAfterRouteChanged?.(to);
      if (!to.includes("#")) {
        requestAnimationFrame(scheduleScrollReset);
      }

      window.setTimeout(() => enforceSingleOpen(), 0);
    };

    window.addEventListener("pageshow", scheduleScrollReset);
    window.addEventListener("load", scheduleScrollReset);

    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        window.removeEventListener("pageshow", scheduleScrollReset);
        window.removeEventListener("load", scheduleScrollReset);
        unbindAccordion();
      });
    }
  },
};
