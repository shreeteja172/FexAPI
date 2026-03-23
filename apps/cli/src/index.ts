#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { startServer } from "./server";

const args = process.argv.slice(2);

const printHelp = () => {
  console.log("mockit-cli");
  console.log("");
  console.log("Usage:");
  console.log("  mockit init");
  console.log("  mockit serve [--host <host>] [--port <number>]");
  console.log("  mockit [--host <host>] [--port <number>]");
  console.log("  mockit --help");
  console.log("");
  console.log("Examples:");
  console.log("  mockit init");
  console.log("  mockit serve --host 127.0.0.1 --port 5000");
  console.log("  mockit --port 4000");
  console.log("");
  console.log("Package manager usage:");
  console.log("  npx mockit init");
  console.log("  pnpm dlx mockit init");
  console.log("  yarn dlx mockit init");
};

type SupportedFramework = "nextjs" | "reactjs" | "unknown";

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

const detectFramework = (packageJsonPath: string): SupportedFramework => {
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
  const allDeps = { ...dependencies, ...devDependencies };

  if ("next" in allDeps) {
    return "nextjs";
  }

  if ("react" in allDeps || "react-dom" in allDeps) {
    return "reactjs";
  }

  return "unknown";
};

const initializeProject = (): number => {
  const packageJsonPath = findClosestPackageJson(process.cwd());

  if (!packageJsonPath) {
    console.error(
      "Could not find package.json in this directory or parent directories.",
    );
    return 1;
  }

  const projectRoot = dirname(packageJsonPath);
  const framework = detectFramework(packageJsonPath);
  const configPath = join(projectRoot, "mockit.config.json");

  if (existsSync(configPath)) {
    console.log(`mockit.config.json already exists at ${configPath}`);
    console.log(`Detected framework: ${framework}`);
    return 0;
  }

  const config = {
    framework,
    createdAt: new Date().toISOString(),
  };

  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf-8");

  console.log(`Initialized Mockit in ${projectRoot}`);
  console.log(`Detected framework: ${framework}`);
  console.log(`Created ${configPath}`);

  if (framework === "unknown") {
    console.log(
      "No Next.js/React dependency found. Update mockit.config.json if needed.",
    );
  }

  return 0;
};

const parseServeOptions = (
  serveArgs: string[],
): { host: string; port: number } | { error: string } => {
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
  const port = Number(portValue ?? 4000);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return { error: `Invalid port: ${portValue ?? ""}`.trim() };
  }

  return { host, port };
};

const [firstArg, ...restArgs] = args;

if (firstArg === "init") {
  if (restArgs.includes("--help") || restArgs.includes("-h")) {
    console.log("Usage: mockit init");
    console.log(
      "Detects the project framework and creates mockit.config.json.",
    );
    process.exit(0);
  }

  const exitCode = initializeProject();
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

  const server = startServer({ host: options.host, port: options.port });

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
