import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { DetectedProject, SupportedFramework } from "../types/project";

const readDependencyNames = (packageJsonPath: string): Set<string> => {
  type JsonLike = Record<string, unknown>;

  const packageJsonText = readFileSync(packageJsonPath, "utf-8");
  const packageJson = JSON.parse(packageJsonText) as JsonLike;

  const dependencies = (packageJson.dependencies ?? {}) as Record<
    string,
    string
  >;
  const devDependencies = (packageJson.devDependencies ?? {}) as Record<
    string,
    string
  >;

  return new Set([
    ...Object.keys(dependencies),
    ...Object.keys(devDependencies),
  ]);
};

const readWorkspaceDependencyNames = (projectRoot: string): Set<string> => {
  const result = new Set<string>();

  const rootsToScan = [
    join(projectRoot, "apps"),
    join(projectRoot, "packages"),
  ];

  for (const rootPath of rootsToScan) {
    if (!existsSync(rootPath)) {
      continue;
    }

    for (const entry of readdirSync(rootPath)) {
      const entryPath = join(rootPath, entry);
      if (!statSync(entryPath).isDirectory()) {
        continue;
      }

      const packageJsonPath = join(entryPath, "package.json");
      if (!existsSync(packageJsonPath)) {
        continue;
      }

      const dependencyNames = readDependencyNames(packageJsonPath);
      for (const dependencyName of dependencyNames) {
        result.add(dependencyName);
      }
    }
  }

  return result;
};

export const detectProject = (
  packageJsonPath: string,
  projectRoot: string,
): DetectedProject => {
  const dependencyNames = readDependencyNames(packageJsonPath);

  const frameworks = new Set<SupportedFramework>();
  const tooling = new Set<string>();

  if (
    dependencyNames.has("turbo") ||
    existsSync(join(projectRoot, "turbo.json"))
  ) {
    tooling.add("turborepo");
  }

  if (dependencyNames.has("nx") || existsSync(join(projectRoot, "nx.json"))) {
    tooling.add("nx");
  }

  if (existsSync(join(projectRoot, "pnpm-workspace.yaml"))) {
    tooling.add("pnpm-workspace");
  }

  if (tooling.has("turborepo") || tooling.has("pnpm-workspace")) {
    const workspaceDeps = readWorkspaceDependencyNames(projectRoot);
    for (const dependencyName of workspaceDeps) {
      dependencyNames.add(dependencyName);
    }
  }

  if (dependencyNames.has("next")) frameworks.add("nextjs");
  if (dependencyNames.has("react") || dependencyNames.has("react-dom"))
    frameworks.add("reactjs");
  if (dependencyNames.has("vue")) frameworks.add("vue");
  if (dependencyNames.has("nuxt")) frameworks.add("nuxt");
  if (dependencyNames.has("svelte")) frameworks.add("svelte");
  if (dependencyNames.has("@sveltejs/kit")) frameworks.add("sveltekit");
  if (dependencyNames.has("@angular/core")) frameworks.add("angular");
  if (dependencyNames.has("solid-js")) frameworks.add("solid");
  if (
    dependencyNames.has("@remix-run/react") ||
    dependencyNames.has("@remix-run/node")
  )
    frameworks.add("remix");
  if (dependencyNames.has("astro")) frameworks.add("astro");

  if (dependencyNames.has("vite")) {
    tooling.add("vite");
  }

  const frameworkList = Array.from(frameworks);
  const primaryFramework = frameworkList[0] ?? "unknown";

  return {
    primaryFramework,
    frameworks: frameworkList.length > 0 ? frameworkList : ["unknown"],
    tooling: Array.from(tooling),
  };
};

export const getSchemaTemplate = (
  framework: SupportedFramework,
  port = 4000,
): string => {
  const frameworkLabel =
    framework === "nextjs"
      ? "Next.js"
      : framework === "reactjs"
        ? "React"
        : framework === "vue"
          ? "Vue"
          : framework === "nuxt"
            ? "Nuxt"
            : framework === "svelte"
              ? "Svelte"
              : framework === "sveltekit"
                ? "SvelteKit"
                : framework === "angular"
                  ? "Angular"
                  : framework === "solid"
                    ? "Solid"
                    : framework === "remix"
                      ? "Remix"
                      : framework === "astro"
                        ? "Astro"
                        : "unknown";

  return [
    `# Framework: ${frameworkLabel}`,
    "",
    "# ──────────────────────────────────────────────",
    "# Server",
    "# ──────────────────────────────────────────────",
    `port: ${port}`,
    "",
    "# ──────────────────────────────────────────────",
    "# Available types",
    "#   string   → random words",
    "#   number   → random integer",
    "#   boolean  → true / false",
    "#   uuid     → unique id",
    "#   email    → fake email",
    "#   name     → full name",
    "#   url      → fake URL",
    "#   phone    → phone number",
    "#   date     → ISO date string",
    "# ──────────────────────────────────────────────",
    "",
    "# ──────────────────────────────────────────────",
    "# Routes",
    "#",
    "# Single-line:  GET /items: id:uuid, name:string",
    "# Multi-line:",
    "#   GET /items:",
    "#     id:uuid",
    "#     name:string",
    "# ──────────────────────────────────────────────",
    "",
    "# ── Users ────────────────────────────────────",
    "",
    "GET /users:",
    "  id:uuid",
    "  fullName:name",
    "  username:string",
    "  email:email",
    "  phone:phone",
    "  avatarUrl:url",
    "  joinedAt:date",
    "",
    "POST /users:",
    "  id:uuid",
    "  fullName:name",
    "  username:string",
    "  email:email",
    "",
    "# ── Posts ────────────────────────────────────",
    "",
    "GET /posts:",
    "  id:uuid",
    "  title:string",
    "  body:string",
    "  authorId:uuid",
    "  published:boolean",
    "  createdAt:date",
    "",
    "POST /posts:",
    "  id:uuid",
    "  title:string",
    "  body:string",
    "  authorId:uuid",
    "",
    "PUT /posts:",
    "  id:uuid",
    "  title:string",
    "  body:string",
    "",
    "DELETE /posts: id:uuid",
    "",
    "# ── Comments (single-line example) ───────────",
    "",
    "GET /comments: id:uuid, body:string, postId:uuid, authorId:uuid, createdAt:date",
  ].join("\n");
};
