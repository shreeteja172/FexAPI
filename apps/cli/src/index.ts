#!/usr/bin/env node

import {
  parseGenerateOptions,
  parseInitOptions,
  parseServeOptions,
} from "./cli/args";
import { printHelp } from "./cli/help";
import { generateFromSchema } from "./commands/generate";
import { initializeProject } from "./commands/init";
import { serveProject } from "./commands/serve";

const args = process.argv.slice(2);
const [firstArg, ...restArgs] = args;

if (firstArg === "init") {
  if (restArgs.includes("--help") || restArgs.includes("-h")) {
    console.log("Usage: fexapi init [--force]");
    console.log(
      "Detects frameworks/tooling and creates fexapi.config.json + fexapi/schema.fexapi.",
    );
    console.log("Use --force to overwrite existing files.");
    process.exit(0);
  }

  const initOptions = parseInitOptions(restArgs);
  if ("error" in initOptions) {
    console.error(initOptions.error);
    console.log("");
    console.log("Usage: fexapi init [--force]");
    process.exit(1);
  }

  process.exit(initializeProject({ force: initOptions.force }));
} else if (firstArg === "generate") {
  if (restArgs.includes("--help") || restArgs.includes("-h")) {
    console.log("Usage: fexapi generate");
    console.log(
      "Reads fexapi/schema.fexapi and updates generated API artifacts + migration.",
    );
    process.exit(0);
  }

  const generateOptions = parseGenerateOptions(restArgs);
  if (generateOptions.error) {
    console.error(generateOptions.error);
    console.log("");
    console.log("Usage: fexapi generate");
    process.exit(1);
  }

  process.exit(generateFromSchema());
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
    console.error(options.error);
    console.log("");
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
  console.error(`Unknown command: ${firstArg}`);
  console.log("");
  printHelp();
  process.exit(1);
}
