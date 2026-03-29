import DefaultTheme from "vitepress/theme";
import { inBrowser } from "vitepress";
import "./custom.css";

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx);

    if (!inBrowser) {
      return;
    }

    const previousAfterRouteChanged = ctx.router.onAfterRouteChanged;

    ctx.router.onAfterRouteChanged = (to) => {
      previousAfterRouteChanged?.(to);

      // Keep docs navigation predictable on client-side transitions.
      if (!to.includes("#")) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    };
  },
};
