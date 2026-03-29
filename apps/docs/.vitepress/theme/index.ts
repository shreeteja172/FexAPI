import DefaultTheme from "vitepress/theme";
import { EnhanceAppContext, inBrowser } from "vitepress";
import "./custom.css";

const INTRODUCTION_PATH = "/getting-started/introduction";

function isRootPath(path: string) {
  return path === "/" || path === "/index.html";
}

export default {
  ...DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    DefaultTheme.enhanceApp?.(ctx);

    if (!inBrowser) {
      return;
    }

    if (isRootPath(window.location.pathname)) {
      window.location.replace(INTRODUCTION_PATH);
      return;
    }

    const previousAfterRouteChanged = ctx.router.onAfterRouteChanged;

    ctx.router.onAfterRouteChanged = (to) => {
      previousAfterRouteChanged?.(to);

      if (isRootPath(to)) {
        window.location.replace(INTRODUCTION_PATH);
        return;
      }

      // Keep docs navigation predictable on client-side transitions.
      if (!to.includes("#")) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    };
  },
};
