import DefaultTheme from "vitepress/theme";
import { EnhanceAppContext, inBrowser } from "vitepress";
import "./custom.css";

export default {
  ...DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp?.(ctx);

    if (!inBrowser) {
      return;
    }

    // Redirect root path to introduction on initial load
    if (
      window.location.pathname === "/" ||
      window.location.pathname === "/index.html"
    ) {
      window.location.replace("/getting-started/introduction");
      return;
    }

    const scrollToTop = () => {
      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    };

    // Prevent stale browser-restored scroll positions from hiding page content.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    requestAnimationFrame(scrollToTop);

    const previousAfterRouteChanged = ctx.router.onAfterRouteChanged;
    ctx.router.onAfterRouteChanged = (to) => {
      previousAfterRouteChanged?.(to);
      if (!to.includes("#")) {
        requestAnimationFrame(scrollToTop);
      }
    };

    window.addEventListener("pageshow", scrollToTop);

    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        window.removeEventListener("pageshow", scrollToTop);
      });
    }
  },
};
