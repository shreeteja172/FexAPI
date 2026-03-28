import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { GENERATED_SPEC_RELATIVE_PATH } from "../constants";
import { logError, logInfo, logSuccess, printSpacer } from "../cli/ui";
import { resolveProjectRoot } from "../project/paths";
import { parseFexapiSchema } from "../schema";

export const generateFromSchema = (): number => {
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
    logInfo("Run `fexapi init` first.");
    return 1;
  }

  const schemaText = readFileSync(schemaPath, "utf-8");
  const parsed = parseFexapiSchema(schemaText);

  if (parsed.errors.length > 0 || !parsed.schema) {
    logError("Failed to generate API from schema.fexapi");
    for (const error of parsed.errors) {
      logError(`- ${error}`);
    }

    return 1;
  }

  const generated = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    port: parsed.schema.port,
    routes: parsed.schema.routes,
  };

  mkdirSync(migrationsDirectoryPath, { recursive: true });

  const existingMigrationFiles = readdirSync(migrationsDirectoryPath, {
    withFileTypes: true,
  })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => join(migrationsDirectoryPath, entry.name));

  for (const migrationFilePath of existingMigrationFiles) {
    unlinkSync(migrationFilePath);
  }

  const migrationId = new Date().toISOString().replace(/[.:]/g, "-");
  const migrationPath = join(migrationsDirectoryPath, "schema.json");
  const migration = {
    migrationId,
    sourceSchema: "fexapi/schema.fexapi",
    createdAt: generated.generatedAt,
    port: parsed.schema.port,
    routes: parsed.schema.routes,
  };

  writeFileSync(
    generatedPath,
    `${JSON.stringify(generated, null, 2)}\n`,
    "utf-8",
  );

  writeFileSync(
    migrationPath,
    `${JSON.stringify(migration, null, 2)}\n`,
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
    schemaPath: "fexapi/schema.fexapi",
    generatedPath: GENERATED_SPEC_RELATIVE_PATH,
    lastGeneratedAt: new Date().toISOString(),
  };

  writeFileSync(
    configPath,
    `${JSON.stringify(updatedConfig, null, 2)}\n`,
    "utf-8",
  );

  logSuccess(`Generated API spec at ${generatedPath}`);
  logSuccess(`Migration updated at ${migrationPath}`);
  printSpacer();
  logInfo(`Routes generated: ${parsed.schema.routes.length}`);
  logInfo(`Configured server port: ${parsed.schema.port}`);

  return 0;
};
