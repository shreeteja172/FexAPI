import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { GENERATED_SPEC_RELATIVE_PATH } from "../constants";
import {
  formatDuration,
  logError,
  nowMs,
  printSpacer,
  printSummaryCard,
  startSpinner,
  ui,
} from "../cli/ui";
import { resolveProjectRoot } from "../project/paths";
import { parseFexapiSchema } from "../schema";

const createRouteSignature = (value: {
  port: number;
  routes: unknown;
}): string => {
  return JSON.stringify({
    port: value.port,
    routes: value.routes,
  });
};

export const generateFromSchema = (): number => {
  const startedAtMs = nowMs();
  const projectRoot = resolveProjectRoot();

  if (!projectRoot) {
    logError(
      "Could not find package.json in this directory or parent directories.",
    );
    return 1;
  }

  const schemaPath = join(projectRoot, "fexapi", "schema.fexapi");
  const generatedPath = join(projectRoot, "fexapi", "generated.api.json");
  const migrationsDirectoryPath = join(projectRoot, "fexapi", "migrations");
  const configPath = join(projectRoot, "fexapi.config.json");

  if (!existsSync(schemaPath)) {
    logError(`Schema file not found: ${schemaPath}`);
    logError("Run `fexapi init` first.");
    return 1;
  }

  const generationSpinner = startSpinner("Reading schema");

  const schemaText = readFileSync(schemaPath, "utf-8");
  generationSpinner.update("Parsing schema routes");
  const parsed = parseFexapiSchema(schemaText);

  if (parsed.errors.length > 0 || !parsed.schema) {
    generationSpinner.fail("Schema parsing failed");
    logError("Failed to generate API from schema.fexapi");
    for (const error of parsed.errors) {
      logError(`- ${error}`);
    }

    return 1;
  }

  generationSpinner.update("Resolving cache state");

  const previousGenerated = existsSync(generatedPath)
    ? (() => {
        try {
          return JSON.parse(readFileSync(generatedPath, "utf-8")) as {
            port: number;
            routes: unknown;
          };
        } catch {
          return undefined;
        }
      })()
    : undefined;

  const nextSignature = createRouteSignature({
    port: parsed.schema.port,
    routes: parsed.schema.routes,
  });
  const previousSignature = previousGenerated
    ? createRouteSignature(previousGenerated)
    : undefined;
  const schemaChanged = nextSignature !== previousSignature;

  const generated = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    port: parsed.schema.port,
    routes: parsed.schema.routes,
  };

  mkdirSync(migrationsDirectoryPath, { recursive: true });

  const migrationPath = join(migrationsDirectoryPath, "schema.json");
  const migration = {
    migrationId: new Date().toISOString().replace(/[.:]/g, "-"),
    sourceSchema: "fexapi/schema.fexapi",
    createdAt: generated.generatedAt,
    port: parsed.schema.port,
    routes: parsed.schema.routes,
  };

  let generatedStatus: "changed" | "cached" = "cached";
  let migrationStatus: "changed" | "cached" = "cached";

  if (schemaChanged || !existsSync(generatedPath)) {
    generationSpinner.update("Writing generated API spec");
    writeFileSync(
      generatedPath,
      `${JSON.stringify(generated, null, 2)}\n`,
      "utf-8",
    );
    generatedStatus = "changed";
  }

  if (schemaChanged || !existsSync(migrationPath)) {
    generationSpinner.update("Updating migration snapshot");
    writeFileSync(
      migrationPath,
      `${JSON.stringify(migration, null, 2)}\n`,
      "utf-8",
    );
    migrationStatus = "changed";
  }

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
    schemaPath: "fexapi/schema.fexapi",
    generatedPath: GENERATED_SPEC_RELATIVE_PATH,
    ...(schemaChanged ? { lastGeneratedAt: new Date().toISOString() } : {}),
  };

  generationSpinner.update("Syncing project config");
  const nextConfigText = `${JSON.stringify(updatedConfig, null, 2)}\n`;
  const previousConfigText = existsSync(configPath)
    ? readFileSync(configPath, "utf-8")
    : undefined;
  let configStatus: "changed" | "cached" = "cached";

  if (previousConfigText !== nextConfigText) {
    writeFileSync(configPath, nextConfigText, "utf-8");
    configStatus = "changed";
  }

  generationSpinner.succeed(
    `Generate complete (${schemaChanged ? "changed" : "cached"})`,
  );

  printSpacer();
  printSummaryCard("Generate Summary", [
    {
      label: "routes",
      value: ui.cyan(String(parsed.schema.routes.length)),
    },
    {
      label: "port",
      value: ui.cyan(String(parsed.schema.port)),
    },
    {
      label: "schema source",
      value: "fexapi/schema.fexapi",
    },
    {
      label: "generated.api.json",
      value:
        generatedStatus === "changed" ? ui.green("changed") : ui.gray("cached"),
    },
    {
      label: "migration",
      value:
        migrationStatus === "changed" ? ui.green("changed") : ui.gray("cached"),
    },
    {
      label: "config",
      value:
        configStatus === "changed" ? ui.green("changed") : ui.gray("cached"),
    },
    {
      label: "time",
      value: ui.bold(formatDuration(startedAtMs)),
    },
  ]);

  return 0;
};
