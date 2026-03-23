#!/usr/bin/env node

import { startServer } from "./server";

const args = process.argv.slice(2);

const printHelp = () => {
  console.log("mockit-cli");
  console.log("");
  console.log("Usage:");
  console.log("  mockit serve [--host <host>] [--port <number>]");
  console.log("  mockit [--host <host>] [--port <number>]");
  console.log("  mockit --help");
  console.log("");
  console.log("Examples:");
  console.log("  mockit serve --host 127.0.0.1 --port 5000");
  console.log("  mockit --port 4000");
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

if (!firstArg || firstArg === "serve" || firstArg.startsWith("-")) {
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
