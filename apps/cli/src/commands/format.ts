import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseFexapiSchema } from "../schema";
import { resolveProjectRoot } from "../project/paths";

const formatSchemaToMultiline = (schemaText: string): string => {
  const parsed = parseFexapiSchema(schemaText);

  if (
    parsed.errors.length > 0 ||
    !parsed.schema ||
    parsed.schema.routes.length === 0
  ) {
    return schemaText;
  }

  const lines: string[] = [];
  lines.push("# Server");
  lines.push(`port: ${parsed.schema.port}`);
  lines.push("");
  lines.push("# Routes");

  for (const route of parsed.schema.routes) {
    lines.push(`${route.method} ${route.path}:`);

    for (const field of route.fields) {
      lines.push(`  ${field.name}:${field.type}`);
    }

    lines.push("");
  }

  return lines.join("\n").trimEnd() + "\n";
};

export const formatSchema = (): number => {
  const projectRoot = resolveProjectRoot();

  if (!projectRoot) {
    console.error(
      "Could not find package.json in this directory or parent directories.",
    );
    return 1;
  }

  const schemaPath = join(projectRoot, "fexapi", "schema.fexapi");

  if (!existsSync(schemaPath)) {
    console.error(`Schema file not found: ${schemaPath}`);
    console.error("Run `fexapi init` first.");
    return 1;
  }

  const schemaText = readFileSync(schemaPath, "utf-8");
  const parsed = parseFexapiSchema(schemaText);

  if (parsed.errors.length > 0 || !parsed.schema) {
    console.error("Failed to parse schema.fexapi");
    for (const error of parsed.errors) {
      console.error(`- ${error}`);
    }

    return 1;
  }

  const formatted = formatSchemaToMultiline(schemaText);
  writeFileSync(schemaPath, formatted, "utf-8");

  console.log(`Formatted ${schemaPath}`);
  console.log(
    `Routes: ${parsed.schema.routes.length} | Port: ${parsed.schema.port}`,
  );

  return 0;
};
