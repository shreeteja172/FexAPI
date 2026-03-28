#!/usr/bin/env node

import {
  parseDevOptions,
  parseFormatOptions,
  parseGenerateOptions,
  parseInitOptions,
  parseServeOptions,
} from "./cli/args";
import { runDevCommand } from "./commands/dev";
import { printHelp } from "./cli/help";
import {
  formatCommand,
  logError,
  logInfo,
  printBanner,
  printSpacer,
} from "./cli/ui";
import { formatSchema } from "./commands/format";
import { generateFromSchema } from "./commands/generate";
import { initializeProject } from "./commands/init";
import { serveProject } from "./commands/serve";

const args = process.argv.slice(2);
const [firstArg, ...restArgs] = args;

const main = async () => {
  if (firstArg === "init") {
    if (restArgs.includes("--help") || restArgs.includes("-h")) {
      printBanner();
      printSpacer();
      logInfo(`Usage: ${formatCommand("fexapi init [--force]")}`);
      console.log(
        "Runs an interactive setup wizard and creates fexapi config/schema files.",
      );
      console.log("Use --force to overwrite existing files.");
      process.exit(0);
    }

    const initOptions = parseInitOptions(restArgs);
    if ("error" in initOptions) {
      logError(initOptions.error);
      printSpacer();
      logInfo(`Usage: ${formatCommand("fexapi init [--force]")}`);
      process.exit(1);
    }

    process.exit(await initializeProject({ force: initOptions.force }));
  } else if (firstArg === "generate") {
    if (restArgs.includes("--help") || restArgs.includes("-h")) {
      printBanner();
      printSpacer();
      logInfo(`Usage: ${formatCommand("fexapi generate")}`);
      console.log(
        "Reads fexapi/schema.fexapi and updates generated API artifacts + migration.",
      );
      process.exit(0);
    }

    const generateOptions = parseGenerateOptions(restArgs);
    if (generateOptions.error) {
      logError(generateOptions.error);
      printSpacer();
      logInfo(`Usage: ${formatCommand("fexapi generate")}`);
      process.exit(1);
    }

    process.exit(generateFromSchema());
  } else if (firstArg === "format") {
    if (restArgs.includes("--help") || restArgs.includes("-h")) {
      printBanner();
      printSpacer();
      logInfo(`Usage: ${formatCommand("fexapi format")}`);
      console.log(
        "Reformats fexapi/schema.fexapi to use readable multi-line field formatting.",
      );
      process.exit(0);
    }

    const formatOptions = parseFormatOptions(restArgs);
    if (formatOptions.error) {
      logError(formatOptions.error);
      printSpacer();
      logInfo(`Usage: ${formatCommand("fexapi format")}`);
      process.exit(1);
    }

    process.exit(formatSchema());
  } else if (firstArg === "dev") {
    if (restArgs.includes("--help") || restArgs.includes("-h")) {
      printBanner();
      printSpacer();
      logInfo(
        `Usage: ${formatCommand("fexapi dev [--watch] [--host <host>] [--port <number>] [--log]")}`,
      );
      console.log(
        "Starts development server and optionally auto-reloads when config/schema files change.",
      );
      process.exit(0);
    }

    const devOptions = parseDevOptions(restArgs);
    if ("error" in devOptions) {
      logError(devOptions.error);
      printSpacer();
      logInfo(
        `Usage: ${formatCommand("fexapi dev [--watch] [--host <host>] [--port <number>] [--log]")}`,
      );
      process.exit(1);
    }

    const exitCode = runDevCommand(devOptions);
    if (exitCode !== 0) {
      process.exit(exitCode);
    }
  } else if (
    !firstArg ||
    firstArg === "serve" ||
    firstArg === "run" ||
    firstArg.startsWith("-")
  ) {
    const serveArgs =
      firstArg === "serve" || firstArg === "run" ? restArgs : args;

    if (serveArgs.includes("--help") || serveArgs.includes("-h")) {
      printHelp();
      process.exit(0);
    }

    const options = parseServeOptions(serveArgs);

    if ("error" in options) {
      logError(options.error);
      printSpacer();
      printHelp();
      process.exit(1);
    }

    const exitCode = serveProject(options);
    if (exitCode !== 0) {
      process.exit(exitCode);
    }
  } else if (firstArg === "help") {
    printHelp();
    process.exit(0);
  } else {
    logError(`Unknown command: ${firstArg}`);
    printSpacer();
    printHelp();
    process.exit(1);
  }
};

void main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  logError(`Unexpected error: ${message}`);
  process.exit(1);
});
