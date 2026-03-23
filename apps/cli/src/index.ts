#!/usr/bin/env node

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { parseMockitSchema } from "./schema";
import { startServer } from "./server";
import type { GeneratedApiSpec } from "./server";

const args = process.argv.slice(2);
const GENERATED_SPEC_RELATIVE_PATH = "mockit/generated.api.json";

const printHelp = () => {
  console.log("mockit-cli");
  console.log("");
  console.log("Usage:");
  console.log("  mockit init [--force]");
  console.log("  mockit generate");
  console.log("  mockit serve [--host <host>] [--port <number>]");
  console.log("  mockit [--host <host>] [--port <number>]");
  console.log("  mockit --help");
  console.log("");
  console.log("Examples:");
  console.log("  mockit init");
  console.log("  mockit init --force");
  console.log("  mockit generate");
  console.log("  mockit serve --host 127.0.0.1 --port 5000");
  console.log("  mockit --port 4000");
  console.log("");
  console.log("Package manager usage:");
  console.log("  npx mockit init");
  console.log("  pnpm dlx mockit init");
  console.log("  yarn dlx mockit init");
  console.log("");
  console.log("`mockit init` creates:");
  console.log("  mockit.config.json");
  console.log("  mockit/schema.mockit");
  console.log("");
  console.log("Then run:");
  console.log("  mockit generate");
  console.log("  mockit serve");
};

type SupportedFramework =
  | "nextjs"
  | "reactjs"
  | "vue"
  | "nuxt"
  | "svelte"
  | "sveltekit"
  | "angular"
  | "solid"
  | "remix"
  | "astro"
  | "unknown";

type DetectedProject = {
  primaryFramework: SupportedFramework;
  frameworks: SupportedFramework[];
  tooling: string[];
};

const findClosestPackageJson = (startDirectory: string): string | undefined => {
  let currentDirectory = startDirectory;

  while (true) {
    const candidate = join(currentDirectory, "package.json");
    if (existsSync(candidate)) {
      return candidate;
    }

    const parentDirectory = dirname(currentDirectory);
    if (parentDirectory === currentDirectory) {
      return undefined;
    }

    currentDirectory = parentDirectory;
  }
};

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

const detectProject = (
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

  if (dependencyNames.has("next")) {
    frameworks.add("nextjs");
  }

  if (dependencyNames.has("react") || dependencyNames.has("react-dom")) {
    frameworks.add("reactjs");
  }

  if (dependencyNames.has("vue")) {
    frameworks.add("vue");
  }

  if (dependencyNames.has("nuxt")) {
    frameworks.add("nuxt");
  }

  if (dependencyNames.has("svelte")) {
    frameworks.add("svelte");
  }

  if (dependencyNames.has("@sveltejs/kit")) {
    frameworks.add("sveltekit");
  }

  if (dependencyNames.has("@angular/core")) {
    frameworks.add("angular");
  }

  if (dependencyNames.has("solid-js")) {
    frameworks.add("solid");
  }

  if (
    dependencyNames.has("@remix-run/react") ||
    dependencyNames.has("@remix-run/node")
  ) {
    frameworks.add("remix");
  }

  if (dependencyNames.has("astro")) {
    frameworks.add("astro");
  }

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

const getSchemaTemplate = (framework: SupportedFramework): string => {
  const frameworkHint =
    framework === "nextjs"
      ? "# Framework: Next.js"
      : framework === "reactjs"
        ? "# Framework: React"
        : "# Framework: unknown";

  return [
    frameworkHint,
    "# Server",
    "port: 4000",
    "",
    "# Routes",
    "# Format: METHOD /endpoint: field:type,field:type",
    "GET /users: id:uuid,fullName:name,username:string,email:email,avatarUrl:url",
    "GET /posts: id:uuid,title:string,body:string,createdAt:date",
  ].join("\n");
};

const parseInitOptions = (
  initArgs: string[],
): { force: boolean } | { error: string } => {
  const validFlags = new Set(["--force"]);
  const invalidFlags = initArgs.filter(
    (value) => value.startsWith("-") && !validFlags.has(value),
  );

  if (invalidFlags.length > 0) {
    return { error: `Unknown option(s): ${invalidFlags.join(", ")}` };
  }

  return { force: initArgs.includes("--force") };
};

const parseGenerateOptions = (generateArgs: string[]): { error?: string } => {
  const invalidFlags = generateArgs.filter((value) => value.startsWith("-"));

  if (invalidFlags.length > 0) {
    return { error: `Unknown option(s): ${invalidFlags.join(", ")}` };
  }

  return {};
};

const resolveProjectRoot = (): string | undefined => {
  const packageJsonPath = findClosestPackageJson(process.cwd());
  if (!packageJsonPath) {
    return undefined;
  }

  return dirname(packageJsonPath);
};

const initializeProject = ({ force }: { force: boolean }): number => {
  const packageJsonPath = findClosestPackageJson(process.cwd());

  if (!packageJsonPath) {
    console.error(
      "Could not find package.json in this directory or parent directories.",
    );
    return 1;
  }

  const projectRoot = dirname(packageJsonPath);
  const detectedProject = detectProject(packageJsonPath, projectRoot);
  const mockitDirectoryPath = join(projectRoot, "mockit");
  const schemaPath = join(mockitDirectoryPath, "schema.mockit");
  const configPath = join(projectRoot, "mockit.config.json");

  mkdirSync(mockitDirectoryPath, { recursive: true });

  const configExists = existsSync(configPath);
  const schemaExists = existsSync(schemaPath);

  const config = {
    framework: detectedProject.primaryFramework,
    frameworks: detectedProject.frameworks,
    tooling: detectedProject.tooling,
    schemaPath: "mockit/schema.mockit",
    generatedPath: GENERATED_SPEC_RELATIVE_PATH,
    createdAt: new Date().toISOString(),
  };

  if (!configExists || force) {
    writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf-8");
  }

  if (!schemaExists || force) {
    writeFileSync(
      schemaPath,
      `${getSchemaTemplate(detectedProject.primaryFramework)}\n`,
      "utf-8",
    );
  }

  console.log(`Initialized Mockit in ${projectRoot}`);
  console.log(`Detected framework: ${detectedProject.primaryFramework}`);
  console.log(`Detected frameworks: ${detectedProject.frameworks.join(", ")}`);
  if (detectedProject.tooling.length > 0) {
    console.log(`Detected tooling: ${detectedProject.tooling.join(", ")}`);
  }

  if (configExists && !force) {
    console.log(`Exists ${configPath}`);
  } else if (configExists && force) {
    console.log(`Overwritten ${configPath}`);
  } else {
    console.log(`Created ${configPath}`);
  }

  if (schemaExists && !force) {
    console.log(`Exists ${schemaPath}`);
  } else if (schemaExists && force) {
    console.log(`Overwritten ${schemaPath}`);
  } else {
    console.log(`Created ${schemaPath}`);
  }

  if (detectedProject.primaryFramework === "unknown") {
    console.log(
      "No known framework dependency found. Update mockit.config.json and schema.mockit if needed.",
    );
  }

  return 0;
};

const generateFromSchema = (): number => {
  const projectRoot = resolveProjectRoot();

  if (!projectRoot) {
    console.error(
      "Could not find package.json in this directory or parent directories.",
    );
    return 1;
  }

  const schemaPath = join(projectRoot, "mockit", "schema.mockit");
  const generatedPath = join(projectRoot, "mockit", "generated.api.json");
  const configPath = join(projectRoot, "mockit.config.json");

  if (!existsSync(schemaPath)) {
    console.error(`Schema file not found: ${schemaPath}`);
    console.error("Run `mockit init` first.");
    return 1;
  }

  const schemaText = readFileSync(schemaPath, "utf-8");
  const parsed = parseMockitSchema(schemaText);

  if (parsed.errors.length > 0 || !parsed.schema) {
    console.error("Failed to generate API from schema.mockit");
    for (const error of parsed.errors) {
      console.error(`- ${error}`);
    }

    return 1;
  }

  const generated = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    port: parsed.schema.port,
    routes: parsed.schema.routes,
  };

  writeFileSync(
    generatedPath,
    `${JSON.stringify(generated, null, 2)}\n`,
    "utf-8",
  );

  let existingConfig: Record<string, unknown> = {};
  if (existsSync(configPath)) {
    try {
      existingConfig = JSON.parse(readFileSync(configPath, "utf-8")) as Record<
        string,
        unknown
      >;
    } catch {
      existingConfig = {};
    }
  }

  const updatedConfig = {
    ...existingConfig,
    schemaPath: "mockit/schema.mockit",
    generatedPath: GENERATED_SPEC_RELATIVE_PATH,
    lastGeneratedAt: new Date().toISOString(),
  };

  writeFileSync(
    configPath,
    `${JSON.stringify(updatedConfig, null, 2)}\n`,
    "utf-8",
  );

  console.log(`Generated API spec at ${generatedPath}`);
  console.log(`Routes generated: ${parsed.schema.routes.length}`);
  console.log(`Configured server port: ${parsed.schema.port}`);

  return 0;
};

const parseServeOptions = (
  serveArgs: string[],
): { host: string; port?: number } | { error: string } => {
  const getFlagValue = (
    flagName: "--host" | "--port",
  ): string | { error: string } | undefined => {
    const index = serveArgs.indexOf(flagName);

    if (index === -1) {
      return undefined;
    }

    const value = serveArgs[index + 1];
    if (!value || value.startsWith("-")) {
      return { error: `Missing value for ${flagName}` };
    }

    return value;
  };

  const unknownFlags = serveArgs.filter(
    (value) =>
      value.startsWith("-") && value !== "--host" && value !== "--port",
  );
  if (unknownFlags.length > 0) {
    return { error: `Unknown option(s): ${unknownFlags.join(", ")}` };
  }

  const hostValue = getFlagValue("--host");
  if (hostValue && typeof hostValue !== "string") {
    return hostValue;
  }

  const portValue = getFlagValue("--port");
  if (portValue && typeof portValue !== "string") {
    return portValue;
  }

  const host = hostValue ?? "127.0.0.1";
  const port = portValue ? Number(portValue) : undefined;

  if (
    port !== undefined &&
    (!Number.isInteger(port) || port < 1 || port > 65535)
  ) {
    return { error: `Invalid port: ${portValue ?? ""}`.trim() };
  }

  return { host, port };
};

const loadGeneratedApiSpec = (
  projectRoot: string,
): GeneratedApiSpec | undefined => {
  const generatedPath = join(projectRoot, GENERATED_SPEC_RELATIVE_PATH);

  if (!existsSync(generatedPath)) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(readFileSync(generatedPath, "utf-8")) as {
      port?: unknown;
      routes?: unknown;
    };

    if (typeof parsed.port !== "number" || !Array.isArray(parsed.routes)) {
      return undefined;
    }

    return {
      port: parsed.port,
      routes: parsed.routes as GeneratedApiSpec["routes"],
    };
  } catch {
    return undefined;
  }
};

const [firstArg, ...restArgs] = args;

if (firstArg === "init") {
  if (restArgs.includes("--help") || restArgs.includes("-h")) {
    console.log("Usage: mockit init [--force]");
    console.log(
      "Detects frameworks/tooling and creates mockit.config.json + mockit/schema.mockit.",
    );
    console.log("Use --force to overwrite existing files.");
    process.exit(0);
  }

  const initOptions = parseInitOptions(restArgs);
  if ("error" in initOptions) {
    console.error(initOptions.error);
    console.log("");
    console.log("Usage: mockit init [--force]");
    process.exit(1);
  }

  const exitCode = initializeProject({ force: initOptions.force });
  process.exit(exitCode);
} else if (firstArg === "generate") {
  if (restArgs.includes("--help") || restArgs.includes("-h")) {
    console.log("Usage: mockit generate");
    console.log(
      "Reads mockit/schema.mockit and creates mockit/generated.api.json.",
    );
    process.exit(0);
  }

  const generateOptions = parseGenerateOptions(restArgs);
  if (generateOptions.error) {
    console.error(generateOptions.error);
    console.log("");
    console.log("Usage: mockit generate");
    process.exit(1);
  }

  const exitCode = generateFromSchema();
  process.exit(exitCode);
} else if (!firstArg || firstArg === "serve" || firstArg.startsWith("-")) {
  const serveArgs = firstArg === "serve" ? restArgs : args;

  if (serveArgs.includes("--help") || serveArgs.includes("-h")) {
    printHelp();
    process.exit(0);
  }

  const options = parseServeOptions(serveArgs);

  if ("error" in options) {
    console.error(options.error);
    console.log("");
    printHelp();
    process.exit(1);
  }

  const projectRoot = resolveProjectRoot();
  const generatedSpec = projectRoot
    ? loadGeneratedApiSpec(projectRoot)
    : undefined;
  const effectivePort = options.port ?? generatedSpec?.port ?? 4000;

  if (generatedSpec) {
    console.log(
      `Using generated schema routes (${generatedSpec.routes.length}) from ${GENERATED_SPEC_RELATIVE_PATH}`,
    );
  } else {
    console.log(
      "No generated schema found. Run `mockit generate` to serve schema-defined endpoints.",
    );
  }

  const server = startServer({
    host: options.host,
    port: effectivePort,
    apiSpec: generatedSpec,
  });

  const shutdown = () => {
    server.close((error) => {
      if (error) {
        console.error("Error while shutting down server", error);
        process.exit(1);
      }

      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
} else if (firstArg === "help") {
  printHelp();
  process.exit(0);
} else {
  console.error(`Unknown command: ${firstArg}`);
  console.log("");
  printHelp();
  process.exit(1);
}
