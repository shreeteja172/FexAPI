import DefaultTheme from "vitepress/theme";
import { inBrowser } from "vitepress";
import "./custom.css";

export default {
  ...DefaultTheme,
  enhanceApp() {
    if (!inBrowser) {
      return;
    }

    // Redirect root path to introduction on initial load
    if (
      window.location.pathname === "/" ||
      window.location.pathname === "/index.html"
    ) {
      window.location.replace("/getting-started/introduction");
    }
  },
};
