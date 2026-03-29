import { defineConfig } from "vitepress";

export default defineConfig({
  title: "FexAPI",
  description: "Schema-first mock API CLI for frontend development",
  cleanUrls: true,
  appearance: true,

  head: [
    ["meta", { name: "theme-color", content: "#0b1220" }],
    ["meta", { name: "color-scheme", content: "dark light" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "FexAPI Documentation" }],
    [
      "meta",
      {
        property: "og:description",
        content: "Schema-first mock API CLI for frontend development",
      },
    ],
    ["meta", { property: "og:url", content: "https://docs.fexapi.dev" }],
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    [
      "link",
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap",
      },
    ],
  ],

  themeConfig: {
    logo: undefined,
    siteTitle: "FexAPI",

    nav: [
      { text: "Guide", link: "/getting-started/introduction" },
      { text: "CLI Reference", link: "/cli/overview" },
      { text: "Schema", link: "/schema/basics" },
      { text: "Troubleshooting", link: "/advanced/troubleshooting" },
    ],

    sidebar: [
      {
        text: "Getting Started",
        collapsed: false,
        items: [
          { text: "Introduction", link: "/getting-started/introduction" },
          { text: "Installation", link: "/getting-started/installation" },
          { text: "Quick Start", link: "/getting-started/quick-start" },
          { text: "Configuration", link: "/getting-started/configuration" },
        ],
      },
      {
        text: "CLI Reference",
        collapsed: true,
        items: [
          { text: "Commands Overview", link: "/cli/overview" },
          { text: "fexapi init", link: "/cli/init" },
          { text: "fexapi generate", link: "/cli/generate" },
          { text: "fexapi serve", link: "/cli/serve" },
          { text: "fexapi dev", link: "/cli/dev" },
          { text: "fexapi format", link: "/cli/format" },
        ],
      },
      {
        text: "Schema Guide",
        collapsed: true,
        items: [
          { text: "Schema Basics", link: "/schema/basics" },
          { text: "Field Types", link: "/schema/field-types" },
          { text: "Faker Methods", link: "/schema/faker-methods" },
          { text: "Custom Schemas", link: "/schema/custom-schemas" },
          { text: "Example Schemas", link: "/schema/examples" },
        ],
      },
      {
        text: "Advanced",
        collapsed: true,
        items: [
          { text: "CORS Configuration", link: "/advanced/cors" },
          { text: "Custom Port", link: "/advanced/custom-port" },
          { text: "Request Logging", link: "/advanced/logging" },
          { text: "Troubleshooting", link: "/advanced/troubleshooting" },
        ],
      },
      {
        text: "Examples",
        collapsed: true,
        items: [
          { text: "React + FexAPI", link: "/examples/react" },
          { text: "Vue + FexAPI", link: "/examples/vue" },
          { text: "Testing with FexAPI", link: "/examples/testing" },
          { text: "CI/CD Integration", link: "/examples/cicd" },
        ],
      },
      {
        text: "Contributing",
        collapsed: true,
        items: [
          { text: "Development Setup", link: "/contributing/setup" },
          { text: "Contribution Guide", link: "/contributing/guide" },
          { text: "Code of Conduct", link: "/contributing/code-of-conduct" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/shreeteja172/fexapi" },
      { icon: "npm", link: "https://www.npmjs.com/package/fexapi" },
    ],

    editLink: {
      pattern:
        "https://github.com/shreeteja172/fexapi/edit/main/apps/docs/:path",
      text: "Edit this page on GitHub",
    },

    search: {
      provider: "local",
    },

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024-present Shreeteja Mutukundu",
    },

    outline: {
      level: [2, 3],
      label: "On this page",
    },
  },
});
